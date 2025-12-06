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
        List<Ambulancia> availableAmbulances = ambulanciaRepository.findByStatus("DISPONIVEL");

        Ambulancia bestAmbulancia = null;
        double minDistance = Double.MAX_VALUE;

        // SLA Rules (in minutes/km)
        double slaLimit = getSlaLimit(ocorrencia.getGravidade());
        
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
            atendimentoRepository.save(atendimento);

            // Update Ambulancia Status
            bestAmbulancia.setStatus("EM_ATENDIMENTO");
            ambulanciaRepository.save(bestAmbulancia);

            // Update Ocorrencia Status
            ocorrencia.setStatus("EM_ANDAMENTO");
            ocorrenciaRepository.save(ocorrencia);
        } else {
            // Log failure to dispatch (optional: could set status to PENDING_RESOURCE)
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
}
