package sosrota.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.OcorrenciaRepository;
import sosrota.backend.repository.EquipeRepository;
import sosrota.backend.repository.OcorrenciaHistoricoRepository;
import sosrota.backend.entity.Equipe;
import sosrota.backend.entity.Profissional;
import sosrota.backend.entity.OcorrenciaHistorico;
import sosrota.backend.dto.OcorrenciaDetalhesDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OcorrenciaService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(OcorrenciaService.class);

    private final OcorrenciaRepository ocorrenciaRepository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final AtendimentoRepository atendimentoRepository;
    private final DijsktraService dijsktraService;
    private final EquipeRepository equipeRepository;
    private final sosrota.backend.repository.OcorrenciaHistoricoRepository ocorrenciaHistoricoRepository;

    private static final double AVERAGE_SPEED_KMH = 60.0;

    public OcorrenciaService(OcorrenciaRepository ocorrenciaRepository,
            AmbulanciaRepository ambulanciaRepository,
            AtendimentoRepository atendimentoRepository,
            DijsktraService dijsktraService,
            EquipeRepository equipeRepository,
            OcorrenciaHistoricoRepository ocorrenciaHistoricoRepository) {
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.ambulanciaRepository = ambulanciaRepository;
        this.atendimentoRepository = atendimentoRepository;
        this.dijsktraService = dijsktraService;
        this.equipeRepository = equipeRepository;
        this.ocorrenciaHistoricoRepository = ocorrenciaHistoricoRepository;
    }

    // [Requisitos Especificos - RF01] O sistema deve permitir a consulta de ocorrencias
    public List<Ocorrencia> findAll() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia findById(Integer id) {
        return ocorrenciaRepository.findById(id).orElse(null);
    }

    // [Requisitos Especificos - RF07] O sistema deve permitir consultas de historico de atendimentos
    public List<OcorrenciaHistorico> findHistoricoByOcorrenciaId(Integer id) {
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia == null) {
            return List.of();
        }
        return ocorrenciaHistoricoRepository.findByOcorrenciaOrderByDataHoraDesc(ocorrencia);
    }

    public sosrota.backend.dto.OcorrenciaDetalhesDTO getOcorrenciaDetalhes(Integer id) {
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia == null) {
            return null;
        }

        sosrota.backend.dto.OcorrenciaDetalhesDTO dto = new sosrota.backend.dto.OcorrenciaDetalhesDTO();
        dto.setOcorrencia(ocorrencia);
        dto.setHistorico(findHistoricoByOcorrenciaId(id));

        Atendimento atendimento = atendimentoRepository.findFirstByOcorrenciaOrderByIdDesc(ocorrencia);
        dto.setAtendimento(atendimento);

        if (atendimento != null && atendimento.getAmbulancia() != null) {
            List<Equipe> equipes = equipeRepository.findByAmbulancia(atendimento.getAmbulancia());
            if (!equipes.isEmpty()) {
                dto.setEquipe(equipes.get(0)); // Takes the first one found. Ideally should match turn/time.
            }
        }

        return dto;
    }

    @Transactional
    // [Requisitos Especificos - RF01] O sistema deve permitir o cadastro de ocorrencias
    public Ocorrencia createOcorrencia(Ocorrencia ocorrencia) {
        ocorrencia.setDataHoraAbertura(LocalDateTime.now());
        ocorrencia.setStatus("ABERTA");
        Ocorrencia savedOcorrencia = ocorrenciaRepository.save(ocorrencia);

        registrarHistorico(savedOcorrencia, null, "ABERTA", "Ocorrência criada.");

        dispatchAmbulance(savedOcorrencia);

        return savedOcorrencia;
    }

    private void registrarHistorico(Ocorrencia ocorrencia, String statusAnterior, String statusNovo, String observacao) {
        sosrota.backend.entity.OcorrenciaHistorico historico = new sosrota.backend.entity.OcorrenciaHistorico();
        historico.setOcorrencia(ocorrencia);
        historico.setStatusAnterior(statusAnterior);
        historico.setStatusNovo(statusNovo);
        historico.setDataHora(LocalDateTime.now());
        historico.setObservacao(observacao);
        ocorrenciaHistoricoRepository.save(historico);
    }

    // [Requisitos Especificos - RF05] O sistema deve sugerir ambulancias aptas para uma ocorrencia
    // [Regras de Negocio - 4] Despacho e Atendimento (Logica Central)
    private void dispatchAmbulance(Ocorrencia ocorrencia) {
        List<Ambulancia> allAmbulances = ambulanciaRepository.findAll();
        logger.info("Total de ambulâncias no banco: {}", allAmbulances.size());
        
        List<Ambulancia> availableAmbulances = ambulanciaRepository.findByStatus("DISPONIVEL");
        logger.info("Encontradas {} ambulâncias com status DISPONIVEL", availableAmbulances.size());

        Ambulancia bestAmbulancia = null;
        double minDistance = Double.MAX_VALUE;
        
        // Fallback: keep track of the closest ambulance even if out of SLA
        Ambulancia closestAmbulanciaOverall = null;
        double minDistanceOverall = Double.MAX_VALUE;

        // SLA Rules (in minutes/km)
        // [Regras de Negocio - 2] Cadastro de Ocorrencias - Gravidade define SLA
        double slaLimit = getSlaLimit(ocorrencia.getGravidade());
        
        logger.info("Iniciando despacho para Ocorrencia {}. Gravidade: {}, Bairro: {}", ocorrencia.getId(), ocorrencia.getGravidade(), ocorrencia.getBairro().getId());
        for (Ambulancia ambulancia : availableAmbulances) {
            
            // 1. Valida Tipo da Ambulância
            // [Regras de Negocio - 4] O tipo da ambulancia deve ser compativel com o tipo requerido
            if (!isTypeCompatible(ambulancia.getTipo(), ocorrencia.getGravidade())) {
                continue;
            }

            // 2. Valida Composicao da Equipe
            // [Regras de Negocio - 3] Uma ambulancia so pode estar disponivel se possuir equipe completa
            if (!validateTeamComposition(ambulancia)) {
                continue;
            }

            // 3. Calcula Distancia (Dijkstra)
            // [Requisitos Especificos - RF04] O sistema deve calcular o caminho minimo (Dijkstra)
            if (ambulancia.getBairro() != null) {
                DijsktraService.PathResult result = dijsktraService.findShortestPath(
                        ambulancia.getBairro().getId(),
                        ocorrencia.getBairro().getId());

                if (!Double.isNaN(result.totalDistance)) {
                    
                    // Track closest overall (fallback)
                    if (result.totalDistance < minDistanceOverall) {
                        minDistanceOverall = result.totalDistance;
                        closestAmbulanciaOverall = ambulancia;
                    }

                    // 3. Valida SLA
                    // [Regras de Negocio - 4] A distancia calculada deve ser menor ou igual ao SLA
                    if (result.totalDistance <= slaLimit) {
                        // 4. Encontra a mais proxima entre as que atendem ao SLA
                        if (result.totalDistance < minDistance) {
                            minDistance = result.totalDistance;
                            bestAmbulancia = ambulancia;
                        }
                    }
                }
            }
        }

        boolean foraDoSla = false;
        
        // If no ambulance found within SLA, use the closest one overall
        if (bestAmbulancia == null && closestAmbulanciaOverall != null) {
            logger.warn("Nenhuma ambulância dentro do SLA ({} km) para Ocorrencia {}. Usando a mais próxima ({} km).", slaLimit, ocorrencia.getId(), minDistanceOverall);
            bestAmbulancia = closestAmbulanciaOverall;
            minDistance = minDistanceOverall;
            foraDoSla = true;
        }

        if (bestAmbulancia != null) {
            // 5. Cria Atendimento
            Atendimento atendimento = new Atendimento();
            atendimento.setOcorrencia(ocorrencia);
            atendimento.setAmbulancia(bestAmbulancia);
            atendimento.setDataHoraDespacho(LocalDateTime.now());
            atendimento.setDistanciaKm(minDistance);
            
            // Set SLA info
            atendimento.setSlaPrevisto(slaLimit);
            atendimento.setSlaReal(minDistance);
            atendimento.setForaDoSla(foraDoSla);
            
            // 6. Calcula Tempo Estimado (Tempo = Distancia / Velocidade * 60)
            double estimatedTimeMinutes = (minDistance / AVERAGE_SPEED_KMH) * 60;
            atendimento.setTempoEstimado(estimatedTimeMinutes);
            
            // 7. Constroi String de Rota
            if (dijsktraService.findShortestPath(bestAmbulancia.getBairro().getId(), ocorrencia.getBairro().getId()) != null) {
                DijsktraService.PathResult path = dijsktraService.findShortestPath(bestAmbulancia.getBairro().getId(), ocorrencia.getBairro().getId());
                if (path.nodes != null && !path.nodes.isEmpty()) {
                    StringBuilder routeBuilder = new StringBuilder();
                    for (int i = 0; i < path.nodes.size(); i++) {
                        routeBuilder.append(dijsktraService.getNodeName(path.nodes.get(i)));
                        if (i < path.nodes.size() - 1) {
                            routeBuilder.append(" -> ");
                        }
                    }
                    atendimento.setRota(routeBuilder.toString());
                }
            }
            
            atendimentoRepository.save(atendimento);

            // 8. Atualiza Status da Ambulancia
            bestAmbulancia.setStatus("EM_ATENDIMENTO");
            ambulanciaRepository.save(bestAmbulancia);

            // 9. Atualiza Status da Ocorrencia
            // [Requisitos Especificos - RF06] O sistema deve registrar o despacho e atualizar status
            String oldStatus = ocorrencia.getStatus();
            ocorrencia.setStatus("DESPACHADA");
            ocorrenciaRepository.save(ocorrencia);
            
            String obs = "Ambulância " + bestAmbulancia.getPlaca() + " despachada automaticamente.";
            if (foraDoSla) {
                obs += " (FORA DO SLA)";
            }
            registrarHistorico(ocorrencia, oldStatus, "DESPACHADA", obs);
            
            logger.info("Ocorrencia {} despachada com sucesso. Ambulancia: {}. Fora do SLA: {}", ocorrencia.getId(), bestAmbulancia.getId(), foraDoSla);
        } else {
            logger.warn("Nenhuma ambulância disponível para a Ocorrencia {}", ocorrencia.getId());
        }
    }

    // [Regras de Negocio - 2] Cadastro de Ocorrencias - Definicao de SLA por gravidade
    private double getSlaLimit(String gravidade) {
        if (gravidade == null) return 30.0;
        switch (gravidade.toUpperCase()) {
            case "ALTA": return 8.0;
            case "MEDIA": return 15.0;
            case "BAIXA": return 30.0;
            default: return 30.0;
        }
    }

    // [Regras de Negocio - 2] Cadastro de Ocorrencias - Tipo de ambulancia requerido
    // [Teoria da Computacao - Teoria Aplicada] Logica de Predicados para validacao de compatibilidade
    // Predicado: P(tipo, gravidade) = (gravidade == ALTA -> tipo \in {USA, UTI}) AND (gravidade != ALTA -> True)
    private boolean isTypeCompatible(String ambulanciaTipo, String gravidade) {
        if (ambulanciaTipo == null || gravidade == null) return false;
        
        String tipo = ambulanciaTipo.toUpperCase();
        String grav = gravidade.toUpperCase();

        if (grav.equals("ALTA")) {
            return tipo.equals("USA") || tipo.equals("UTI"); // Aceita os dos dois por precaução
        } else {
            // MEDIA or BAIXA: Aceita USA/UTI ou USB/BASICA
            return true; 
        }
    }

    // [Regras de Negocio - 3] Cadastro de Ambulancias e Equipes - Equipe minima
    private boolean validateTeamComposition(Ambulancia ambulancia) {
        List<Equipe> equipes = equipeRepository.findByAmbulancia(ambulancia);
        return equipes.stream().anyMatch(equipe -> {
            List<Profissional> profissionais = equipe.getProfissionais();
            boolean hasMotorista = profissionais.stream()
                    .anyMatch(p -> "MOTORISTA".equalsIgnoreCase(p.getFuncao()) && Boolean.TRUE.equals(p.getAtivo()));
            boolean hasMedico = profissionais.stream()
                    .anyMatch(p -> "MEDICO".equalsIgnoreCase(p.getFuncao()) && Boolean.TRUE.equals(p.getAtivo()));
            boolean hasEnfermeiro = profissionais.stream()
                    .anyMatch(p -> "ENFERMEIRO".equalsIgnoreCase(p.getFuncao()) && Boolean.TRUE.equals(p.getAtivo()));

            String tipo = ambulancia.getTipo().toUpperCase();
            if ("USA".equals(tipo) || "UTI".equals(tipo)) {
                return hasMotorista && hasMedico && hasEnfermeiro;
            } else {
                // USB / BASICA
                return hasMotorista && (hasMedico || hasEnfermeiro);
            }
        });
    }
    
    // [Regras de Negocio - 6] Restricoes e Validacoes Globais - Nao excluir ocorrencia com despacho
    public void delete(Integer id) {
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && !"ABERTA".equals(ocorrencia.getStatus())) {
             throw new IllegalStateException("Não é permitido excluir uma ocorrência que já possui despacho/atendimento.");
        }
        ocorrenciaRepository.deleteById(id);
    }

    // [Regras de Negocio - 6] Restricoes e Validacoes Globais - Confirmar saida
    @Transactional
    public void confirmDeparture(Integer id) {
        logger.info("Tentando confirmar saída para Ocorrencia {}", id);
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && "DESPACHADA".equals(ocorrencia.getStatus())) {
            String oldStatus = ocorrencia.getStatus();
            ocorrencia.setStatus("EM_ATENDIMENTO");
            ocorrenciaRepository.save(ocorrencia);
            
            registrarHistorico(ocorrencia, oldStatus, "EM_ATENDIMENTO", "Saída da ambulância confirmada.");
            
            // Atualiza Atendimento com hora de chegada
            Atendimento atendimento = atendimentoRepository.findFirstByOcorrenciaOrderByIdDesc(ocorrencia);
            if (atendimento != null) {
                atendimento.setDataHoraChegada(LocalDateTime.now());
                atendimentoRepository.save(atendimento);
            }

            logger.info("Saída confirmada para Ocorrencia {}. Status atualizado para EM_ATENDIMENTO", id);
        } else {
            logger.error("Falha ao confirmar saída. Ocorrencia {} não encontrada ou status inválido: {}", id, (ocorrencia != null ? ocorrencia.getStatus() : "null"));
            throw new IllegalStateException("Ocorrência não encontrada ou não está no status DESPACHADA.");
        }
    }

    // [Regras de Negocio - 6] Restricoes e Validacoes Globais - Concluir atendimento
    @Transactional
    public void finishOccurrence(Integer id) {
        logger.info("Tentando concluir Ocorrencia {}", id);
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && "EM_ATENDIMENTO".equals(ocorrencia.getStatus())) {
            String oldStatus = ocorrencia.getStatus();
            ocorrencia.setStatus("CONCLUIDA");
            ocorrencia.setDataHoraFechamento(LocalDateTime.now());
            ocorrenciaRepository.save(ocorrencia);
            
            registrarHistorico(ocorrencia, oldStatus, "CONCLUIDA", "Atendimento concluído.");
            
            logger.info("Ocorrencia {} concluída.", id);

            freeAmbulance(ocorrencia);
        } else {
            logger.error("Falha ao concluir. Ocorrencia {} não encontrada ou status inválido: {}", id, (ocorrencia != null ? ocorrencia.getStatus() : "null"));
            throw new IllegalStateException("Ocorrência não encontrada ou não está em atendimento.");
        }
    }

    // [Requisitos Especificos - RF01] O sistema deve permitir o cancelamento de ocorrencias
    @Transactional
    public void cancelOccurrence(Integer id, String justificativa) {
        logger.info("Tentando cancelar Ocorrencia {}", id);
        Ocorrencia ocorrencia = findById(id);
        
        if (ocorrencia == null) {
             throw new IllegalStateException("Ocorrência não encontrada.");
        }
        
        if ("CONCLUIDA".equals(ocorrencia.getStatus()) || "CANCELADA".equals(ocorrencia.getStatus())) {
             throw new IllegalStateException("Não é possível cancelar uma ocorrência já concluída ou cancelada.");
        }
        
        // Permite cancelamento apenas para ocorrências Abertas ou Despachadas
        if (!"ABERTA".equals(ocorrencia.getStatus()) && !"DESPACHADA".equals(ocorrencia.getStatus())) {
             throw new IllegalStateException("Cancelamento permitido apenas para ocorrências Abertas ou Despachadas.");
        }

        String oldStatus = ocorrencia.getStatus();
        ocorrencia.setStatus("CANCELADA");
        ocorrencia.setDataHoraFechamento(LocalDateTime.now());
        ocorrenciaRepository.save(ocorrencia);
        
        registrarHistorico(ocorrencia, oldStatus, "CANCELADA", "Cancelamento: " + justificativa);
        
        logger.info("Ocorrencia {} cancelada.", id);

        // Se foi despachada, libera a ambulância
        if ("DESPACHADA".equals(oldStatus)) {
             freeAmbulance(ocorrencia);
        }
    }
    
    public void cancelOccurrence(Integer id) {
        cancelOccurrence(id, "Cancelamento solicitado sem justificativa.");
    }

    private void freeAmbulance(Ocorrencia ocorrencia) {
        Atendimento atendimento = atendimentoRepository.findFirstByOcorrenciaOrderByIdDesc(ocorrencia);
        if (atendimento != null) {
            Ambulancia ambulancia = atendimento.getAmbulancia();
            if (ambulancia != null) {
                ambulancia.setStatus("DISPONIVEL");
                ambulanciaRepository.save(ambulancia);
                logger.info("Ambulancia {} liberada (DISPONIVEL) após fim da Ocorrencia {}", ambulancia.getId(), ocorrencia.getId());
                
                // Trigger dispatch for pending occurrences
                processPendingOccurrences();
            } else {
                logger.warn("Atendimento {} não tem ambulância vinculada.", atendimento.getId());
            }
        } else {
            logger.warn("Nenhum atendimento encontrado para Ocorrencia {} ao tentar liberar ambulância.", ocorrencia.getId());
        }
    }

    // [Regras de Negocio - 4] Despacho - Processamento de fila
    private void processPendingOccurrences() {
        List<Ocorrencia> pendingOccurrences = ocorrenciaRepository.findByStatus("ABERTA");
        if (!pendingOccurrences.isEmpty()) {
            logger.info("Processando fila de espera. {} ocorrências pendentes.", pendingOccurrences.size());
            for (Ocorrencia pending : pendingOccurrences) {
                dispatchAmbulance(pending);
            }
        }
    }
}
