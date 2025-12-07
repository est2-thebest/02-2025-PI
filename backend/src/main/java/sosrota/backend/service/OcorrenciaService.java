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

/**
 * Serviço central de gerenciamento de ocorrências e despacho.
 * Responsável por orquestrar a lógica de SLA, seleção de ambulâncias e cálculo de rotas.
 * [RF01] Cadastro e Gestão de Ocorrências.
 * [RF05] Sugestão de Ambulâncias Aptas.
 * [RF06] Despacho e Registro.
 * [Estruturas de Dados II] Uso de Grafos e Dijkstra para roteamento.
 */
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

    /**
     * Lista todas as ocorrências.
     *
     * @return Lista de ocorrências
     * [RF01] Listagem geral.
     */
    public List<Ocorrencia> findAll() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia findById(Integer id) {
        return ocorrenciaRepository.findById(id).orElse(null);
    }

    /**
     * Busca histórico de uma ocorrência.
     *
     * @param id Identificador da ocorrência
     * @return Lista de histórico ordenado por data
     * [RF07] Rastreabilidade de eventos.
     */
    public List<OcorrenciaHistorico> findHistoricoByOcorrenciaId(Integer id) {
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia == null) {
            return List.of();
        }
        return ocorrenciaHistoricoRepository.findByOcorrenciaOrderByDataHoraDesc(ocorrencia);
    }

    /**
     * Obtém detalhes completos (DTO) para visualização.
     *
     * @param id Identificador da ocorrência
     * @return DTO com ocorrência, atendimento, equipe e histórico
     * [Banco de Dados II] Agregação de dados de múltiplas tabelas.
     */
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

    /**
     * Cria uma nova ocorrência e executa o algoritmo de despacho.
     *
     * @param ocorrencia Dados da ocorrência
     * @return Ocorrência salva
     * [RF01] Persistência inicial.
     * [RF05] Acionamento automático do despacho.
     */
    @Transactional
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

    /**
     * Algoritmo principal de despacho de ambulâncias.
     * Seleciona a melhor ambulância baseada em SLA, Tipo e Distância.
     *
     * @param ocorrencia Ocorrência a ser atendida
     * [RF05] Sugestão de Ambulâncias Aptas.
     * [Estruturas de Dados II - Dijkstra] Cálculo de menor caminho no grafo.
     * [Regra de Domínio - SLA] Verificação de tempo limite por gravidade.
     */
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

        // [Regra de Domínio - RD01] SLA definido pela gravidade
        double slaLimit = getSlaLimit(ocorrencia.getGravidade());
        
        logger.info("Iniciando despacho para Ocorrencia {}. Gravidade: {}, Bairro: {}", ocorrencia.getId(), ocorrencia.getGravidade(), ocorrencia.getBairro().getId());
        for (Ambulancia ambulancia : availableAmbulances) {
            
            // [Regra de Negócio] Valida compatibilidade de tipo (UTI/Básica)
            if (!isTypeCompatible(ambulancia.getTipo(), ocorrencia.getGravidade())) {
                continue;
            }

            // [Regra de Domínio - RD02] Valida se equipe está completa
            if (!validateTeamComposition(ambulancia)) {
                continue;
            }

            // [Estruturas de Dados II] Execução do Dijkstra para calcular distância real no grafo
            if (ambulancia.getBairro() != null) {
                DijsktraService.PathResult result = dijsktraService.findShortestPath(
                        ambulancia.getBairro().getId(),
                        ocorrencia.getBairro().getId());

                if (!Double.isNaN(result.totalDistance)) {
                    
                    if (result.totalDistance < minDistanceOverall) {
                        minDistanceOverall = result.totalDistance;
                        closestAmbulanciaOverall = ambulancia;
                    }

                    // [Regra de Negócio] Verifica se atende ao SLA
                    if (result.totalDistance <= slaLimit) {
                        // Encontra a mais proxima entre as que atendem ao SLA
                        if (result.totalDistance < minDistance) {
                            minDistance = result.totalDistance;
                            bestAmbulancia = ambulancia;
                        }
                    }
                }
            }
        }

        boolean foraDoSla = false;
        
        // Se nenhuma atender ao SLA, usa a mais próxima (Fallback)
        if (bestAmbulancia == null && closestAmbulanciaOverall != null) {
            logger.warn("Nenhuma ambulância dentro do SLA ({} km) para Ocorrencia {}. Usando a mais próxima ({} km).", slaLimit, ocorrencia.getId(), minDistanceOverall);
            bestAmbulancia = closestAmbulanciaOverall;
            minDistance = minDistanceOverall;
            foraDoSla = true;
        }

        if (bestAmbulancia != null) {
            // [RF06] Registro do despacho e atualização de status
            Atendimento atendimento = new Atendimento();
            atendimento.setOcorrencia(ocorrencia);
            atendimento.setAmbulancia(bestAmbulancia);
            atendimento.setDataHoraDespacho(LocalDateTime.now());
            atendimento.setDistanciaKm(minDistance);
            
            // Set SLA info
            atendimento.setSlaPrevisto(slaLimit);
            atendimento.setSlaReal(minDistance);
            atendimento.setForaDoSla(foraDoSla);
            
            // Tempo = Distancia / Velocidade * 60
            double estimatedTimeMinutes = (minDistance / AVERAGE_SPEED_KMH) * 60;
            atendimento.setTempoEstimado(estimatedTimeMinutes);
            
            // [Estruturas de Dados II] Recuperação do caminho (sequência de vértices)
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

            // Atualiza Status da Ambulancia
            bestAmbulancia.setStatus("EM_ATENDIMENTO");
            ambulanciaRepository.save(bestAmbulancia);

            // Atualiza Status da Ocorrencia
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

    /**
     * Define o limite de SLA (em minutos/km) baseado na gravidade.
     *
     * @param gravidade Nível de gravidade (ALTA, MEDIA, BAIXA)
     * @return Limite em minutos (assumindo 1km = 1min)
     * [Regra de Domínio - RD01] Tabela de SLA.
     */
    private double getSlaLimit(String gravidade) {
        if (gravidade == null) return 30.0;
        switch (gravidade.toUpperCase()) {
            case "ALTA": return 8.0;
            case "MEDIA": return 15.0;
            case "BAIXA": return 30.0;
            default: return 30.0;
        }
    }

    /**
     * Verifica compatibilidade entre tipo de ambulância e gravidade.
     *
     * @param ambulanciaTipo Tipo da ambulância (USA, USB)
     * @param gravidade Gravidade da ocorrência
     * @return true se compatível
     * [Teoria da Computação] Lógica de Predicados: P(tipo, gravidade).
     */
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

    /**
     * Valida se a ambulância possui equipe completa ativa.
     *
     * @param ambulancia Ambulância a ser verificada
     * @return true se equipe válida
     * [Regra de Domínio - RD02] Critério de Disponibilidade.
     */
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
    
    /**
     * Exclui ocorrência, garantindo integridade.
     *
     * @param id Identificador da ocorrência
     * [Regra de Negócio] Não permite excluir se já houve despacho.
     */
    public void delete(Integer id) {
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && !"ABERTA".equals(ocorrencia.getStatus())) {
             throw new IllegalStateException("Não é permitido excluir uma ocorrência que já possui despacho/atendimento.");
        }
        ocorrenciaRepository.deleteById(id);
    }

    /**
     * Confirma saída da ambulância.
     *
     * @param id Identificador da ocorrência
     * [RF06] Atualização de status operacional.
     */
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

    /**
     * Finaliza a ocorrência e libera a ambulância.
     *
     * @param id Identificador da ocorrência
     * [RF06] Conclusão de ciclo de vida.
     */
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

    /**
     * Cancela uma ocorrência.
     *
     * @param id Identificador da ocorrência
     * @param justificativa Motivo do cancelamento
     * [Regra de Negócio] Validação de estados permitidos para cancelamento.
     */
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

    /**
     * Libera a ambulância vinculada a uma ocorrência (torna DISPONIVEL).
     *
     * @param ocorrencia Ocorrência finalizada/cancelada
     * [Regra de Negócio] Retorno de recurso ao pool de disponibilidade.
     */
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

    /**
     * Processa fila de ocorrências pendentes (ABERTA) quando um recurso é liberado.
     *
     * @param none
     * [Regra de Negócio] Fila de espera e reprocessamento.
     */
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
