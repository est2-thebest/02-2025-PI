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

    public List<Ocorrencia> findAll() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia findById(Integer id) {
        return ocorrenciaRepository.findById(id).orElse(null);
    }

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
            sosrota.backend.entity.Equipe equipe = equipeRepository.findByAmbulancia(atendimento.getAmbulancia()).orElse(null);
            dto.setEquipe(equipe);
        }

        return dto;
    }

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

    private void dispatchAmbulance(Ocorrencia ocorrencia) {
        List<Ambulancia> allAmbulances = ambulanciaRepository.findAll();
        logger.info("Total de ambulâncias no banco: {}", allAmbulances.size());
        
        List<Ambulancia> availableAmbulances = ambulanciaRepository.findByStatus("DISPONIVEL");
        logger.info("Encontradas {} ambulâncias com status DISPONIVEL", availableAmbulances.size());

        Ambulancia bestAmbulancia = null;
        double minDistance = Double.MAX_VALUE;

        // SLA Rules (in minutes/km)
        double slaLimit = getSlaLimit(ocorrencia.getGravidade());
        
        logger.info("Iniciando despacho para Ocorrencia {}. Gravidade: {}, Bairro: {}", ocorrencia.getId(), ocorrencia.getGravidade(), ocorrencia.getBairro().getId());
        for (Ambulancia ambulancia : availableAmbulances) {
            
            // 1. Validate Ambulance Type
            if (!isTypeCompatible(ambulancia.getTipo(), ocorrencia.getGravidade())) {
                continue;
            }

            // 2. Validate Team Composition
            if (!validateTeamComposition(ambulancia)) {
                continue;
            }

            // 3. Calculate Distance (Dijkstra)
            if (ambulancia.getBairro() != null) {
                DijsktraService.PathResult result = dijsktraService.findShortestPath(
                        ambulancia.getBairro().getId(),
                        ocorrencia.getBairro().getId());

                if (!Double.isNaN(result.totalDistance)) {
                    // 3. Validate SLA
                    if (result.totalDistance <= slaLimit) {
                        // Find the nearest one among those that satisfy SLA
                        if (result.totalDistance < minDistance) {
                            minDistance = result.totalDistance;
                            bestAmbulancia = ambulancia;
                        }
                    }
                }
            }
        }

        if (bestAmbulancia != null) {
            // Create Atendimento
            Atendimento atendimento = new Atendimento();
            atendimento.setOcorrencia(ocorrencia);
            atendimento.setAmbulancia(bestAmbulancia);
            atendimento.setDataHoraDespacho(LocalDateTime.now());
            atendimento.setDistanciaKm(minDistance);
            
            // Calculate Estimated Time (Time = Distance / Speed * 60)
            double estimatedTimeMinutes = (minDistance / AVERAGE_SPEED_KMH) * 60;
            atendimento.setTempoEstimado(estimatedTimeMinutes);
            
            // Build Route String
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

            // Update Ambulancia Status
            bestAmbulancia.setStatus("EM_ATENDIMENTO");
            ambulanciaRepository.save(bestAmbulancia);

            // Update Ocorrencia Status
            String oldStatus = ocorrencia.getStatus();
            ocorrencia.setStatus("DESPACHADA");
            ocorrenciaRepository.save(ocorrencia);
            
            registrarHistorico(ocorrencia, oldStatus, "DESPACHADA", "Ambulância " + bestAmbulancia.getPlaca() + " despachada automaticamente.");
            
            logger.info("Ocorrencia {} despachada com sucesso. Ambulancia: {}", ocorrencia.getId(), bestAmbulancia.getId());
        } else {
            logger.warn("Nenhuma ambulância disponível para a Ocorrencia {}", ocorrencia.getId());
        }
    }

    private double getSlaLimit(String gravidade) {
        if (gravidade == null) return 30.0; // Default to lowest severity
        switch (gravidade.toUpperCase()) {
            case "ALTA": return 8.0;
            case "MEDIA": return 15.0;
            case "BAIXA": return 30.0;
            default: return 30.0;
        }
    }

    private boolean isTypeCompatible(String ambulanciaTipo, String gravidade) {
        if (ambulanciaTipo == null || gravidade == null) return false;
        
        String tipo = ambulanciaTipo.toUpperCase();
        String grav = gravidade.toUpperCase();

        if (grav.equals("ALTA")) {
            return tipo.equals("USA") || tipo.equals("UTI"); // Accept both just in case
        } else {
            // MEDIA or BAIXA: Accept USA/UTI or USB/BASICA
            return true; 
        }
    }

    private boolean validateTeamComposition(Ambulancia ambulancia) {
        return equipeRepository.findByAmbulancia(ambulancia)
                .map(equipe -> {
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
                })
                .orElse(false);
    }
    
    public void delete(Integer id) {
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && !"ABERTA".equals(ocorrencia.getStatus())) {
             throw new IllegalStateException("Não é permitido excluir uma ocorrência que já possui despacho/atendimento.");
        }
        ocorrenciaRepository.deleteById(id);
    }

    @Transactional
    public void confirmDeparture(Integer id) {
        logger.info("Tentando confirmar saída para Ocorrencia {}", id);
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && "DESPACHADA".equals(ocorrencia.getStatus())) {
            String oldStatus = ocorrencia.getStatus();
            ocorrencia.setStatus("EM_ATENDIMENTO");
            ocorrenciaRepository.save(ocorrencia);
            
            registrarHistorico(ocorrencia, oldStatus, "EM_ATENDIMENTO", "Saída da ambulância confirmada.");
            
            // Update Atendimento with arrival time
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
        
        // Allow cancellation only if ABERTA or DESPACHADA
        if (!"ABERTA".equals(ocorrencia.getStatus()) && !"DESPACHADA".equals(ocorrencia.getStatus())) {
             throw new IllegalStateException("Cancelamento permitido apenas para ocorrências Abertas ou Despachadas.");
        }

        String oldStatus = ocorrencia.getStatus();
        ocorrencia.setStatus("CANCELADA");
        ocorrencia.setDataHoraFechamento(LocalDateTime.now());
        ocorrenciaRepository.save(ocorrencia);
        
        registrarHistorico(ocorrencia, oldStatus, "CANCELADA", "Cancelamento: " + justificativa);
        
        logger.info("Ocorrencia {} cancelada.", id);

        // If it was dispatched, free the ambulance
        if ("DESPACHADA".equals(oldStatus)) {
             freeAmbulance(ocorrencia);
        }
    }
    
    // Overload for backward compatibility if needed, but we should update controller
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
            } else {
                logger.warn("Atendimento {} não tem ambulância vinculada.", atendimento.getId());
            }
        } else {
            logger.warn("Nenhum atendimento encontrado para Ocorrencia {} ao tentar liberar ambulância.", ocorrencia.getId());
        }
    }
}
