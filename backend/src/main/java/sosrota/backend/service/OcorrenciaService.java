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
import sosrota.backend.entity.Equipe;
import sosrota.backend.entity.Profissional;

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

    public OcorrenciaService(OcorrenciaRepository ocorrenciaRepository,
            AmbulanciaRepository ambulanciaRepository,
            AtendimentoRepository atendimentoRepository,
            DijsktraService dijsktraService,
            EquipeRepository equipeRepository) {
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.ambulanciaRepository = ambulanciaRepository;
        this.atendimentoRepository = atendimentoRepository;
        this.dijsktraService = dijsktraService;
        this.equipeRepository = equipeRepository;
    }

    public List<Ocorrencia> findAll() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia findById(Integer id) {
        return ocorrenciaRepository.findById(id).orElse(null);
    }

    @Transactional
    public Ocorrencia createOcorrencia(Ocorrencia ocorrencia) {
        ocorrencia.setDataHoraAbertura(LocalDateTime.now());
        ocorrencia.setStatus("ABERTA");
        Ocorrencia savedOcorrencia = ocorrenciaRepository.save(ocorrencia);

        dispatchAmbulance(savedOcorrencia);

        return savedOcorrencia;
    }

    private void dispatchAmbulance(Ocorrencia ocorrencia) {
        List<Ambulancia> allAmbulances = ambulanciaRepository.findAll();
        logger.info("Total de ambulâncias no banco: {}", allAmbulances.size());
        for (Ambulancia a : allAmbulances) {
            logger.info("Ambulancia DB: ID={}, Placa={}, Status='{}', Base={}", a.getId(), a.getPlaca(), a.getStatus(), (a.getBairro() != null ? a.getBairro().getNome() : "null"));
        }

        List<Ambulancia> availableAmbulances = ambulanciaRepository.findByStatus("DISPONIVEL");
        logger.info("Encontradas {} ambulâncias com status DISPONIVEL", availableAmbulances.size());

        Ambulancia bestAmbulancia = null;
        double minDistance = Double.MAX_VALUE;

        // SLA Rules (in minutes/km)
        double slaLimit = getSlaLimit(ocorrencia.getGravidade());
        
        logger.info("Iniciando despacho para Ocorrencia {}. Gravidade: {}, Bairro: {}", ocorrencia.getId(), ocorrencia.getGravidade(), ocorrencia.getBairro().getId());
        for (Ambulancia ambulancia : availableAmbulances) {
            logger.debug("Verificando Ambulancia {}. Tipo: {}, Bairro: {}", ambulancia.getId(), ambulancia.getTipo(), (ambulancia.getBairro() != null ? ambulancia.getBairro().getId() : "null"));
            
            // 1. Validate Ambulance Type
            if (!isTypeCompatible(ambulancia.getTipo(), ocorrencia.getGravidade())) {
                logger.debug("Ambulancia {} rejeitada: Tipo incompatível.", ambulancia.getId());
                continue;
            }

            // 2. Validate Team Composition
            if (!validateTeamComposition(ambulancia)) {
                logger.debug("Ambulancia {} rejeitada: Equipe inválida ou incompleta.", ambulancia.getId());
                continue;
            }

            // 3. Calculate Distance (Dijkstra)
            if (ambulancia.getBairro() != null) {
                DijsktraService.PathResult result = dijsktraService.findShortestPath(
                        ambulancia.getBairro().getId(),
                        ocorrencia.getBairro().getId());

                logger.debug("Distância calculada para Ambulancia {}: {} km", ambulancia.getId(), result.totalDistance);

                if (!Double.isNaN(result.totalDistance)) {
                    // 3. Validate SLA
                    if (result.totalDistance <= slaLimit) {
                        // Find the nearest one among those that satisfy SLA
                        if (result.totalDistance < minDistance) {
                            minDistance = result.totalDistance;
                            bestAmbulancia = ambulancia;
                            logger.debug("Ambulancia {} é a melhor candidata até agora.", ambulancia.getId());
                        }
                    } else {
                        logger.debug("Ambulancia {} rejeitada: Fora do SLA ({} > {})", ambulancia.getId(), result.totalDistance, slaLimit);
                    }
                }
            } else {
                logger.debug("Ambulancia {} rejeitada: Sem base definida.", ambulancia.getId());
            }
        }

        if (bestAmbulancia != null) {
            // Create Atendimento
            Atendimento atendimento = new Atendimento();
            atendimento.setOcorrencia(ocorrencia);
            atendimento.setAmbulancia(bestAmbulancia);
            atendimento.setDataHoraDespacho(LocalDateTime.now());
            atendimento.setDistanciaKm(minDistance);
            atendimentoRepository.save(atendimento);

            // Update Ambulancia Status
            bestAmbulancia.setStatus("EM_ATENDIMENTO");
            ambulanciaRepository.save(bestAmbulancia);

            // Update Ocorrencia Status
            ocorrencia.setStatus("DESPACHADA");
            ocorrenciaRepository.save(ocorrencia);
            logger.info("Ocorrencia {} despachada com sucesso. Ambulancia: {}", ocorrencia.getId(), bestAmbulancia.getId());
        } else {
            // Log failure to dispatch (optional: could set status to PENDING_RESOURCE)
            logger.warn("Nenhuma ambulância disponível para a Ocorrencia {}", ocorrencia.getId());
            System.out.println("No suitable ambulance found for Ocorrencia " + ocorrencia.getId());
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
        ocorrenciaRepository.deleteById(id);
    }

    @Transactional
    public void confirmDeparture(Integer id) {
        logger.info("Tentando confirmar saída para Ocorrencia {}", id);
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && "DESPACHADA".equals(ocorrencia.getStatus())) {
            ocorrencia.setStatus("EM_ATENDIMENTO");
            ocorrenciaRepository.save(ocorrencia);
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
            ocorrencia.setStatus("CONCLUIDA");
            ocorrencia.setDataHoraFechamento(LocalDateTime.now());
            ocorrenciaRepository.save(ocorrencia);
            logger.info("Ocorrencia {} concluída.", id);

            freeAmbulance(ocorrencia);
        } else {
            logger.error("Falha ao concluir. Ocorrencia {} não encontrada ou status inválido: {}", id, (ocorrencia != null ? ocorrencia.getStatus() : "null"));
            throw new IllegalStateException("Ocorrência não encontrada ou não está em atendimento.");
        }
    }

    @Transactional
    public void cancelOccurrence(Integer id) {
        logger.info("Tentando cancelar Ocorrencia {}", id);
        Ocorrencia ocorrencia = findById(id);
        if (ocorrencia != null && !"CONCLUIDA".equals(ocorrencia.getStatus())) {
            ocorrencia.setStatus("CANCELADA");
            ocorrencia.setDataHoraFechamento(LocalDateTime.now());
            ocorrenciaRepository.save(ocorrencia);
            logger.info("Ocorrencia {} cancelada.", id);

            freeAmbulance(ocorrencia);
        } else {
             logger.error("Falha ao cancelar. Ocorrencia {} não encontrada ou já concluída.", id);
             throw new IllegalStateException("Ocorrência não encontrada ou já concluída.");
        }
    }

    private void freeAmbulance(Ocorrencia ocorrencia) {
        Atendimento atendimento = atendimentoRepository.findByOcorrencia(ocorrencia);
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
