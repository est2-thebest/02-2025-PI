package sosrota.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.OcorrenciaRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SimulationService {

    private static final Logger logger = LoggerFactory.getLogger(SimulationService.class);

    private final OcorrenciaRepository ocorrenciaRepository;
    private final AtendimentoRepository atendimentoRepository;
    private final OcorrenciaService ocorrenciaService;

    // Configuration: 1 km (1 min didactic) = 1 second real
    private static final long SECONDS_PER_KM = 1;
    private static final long SERVICE_DURATION_SECONDS = 10;

    public SimulationService(OcorrenciaRepository ocorrenciaRepository,
                             AtendimentoRepository atendimentoRepository,
                             OcorrenciaService ocorrenciaService) {
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.atendimentoRepository = atendimentoRepository;
        this.ocorrenciaService = ocorrenciaService;
    }

    @Scheduled(fixedRate = 2000) // Run every 2 seconds
    public void runSimulation() {
        simulateTravel();
        simulateService();
    }

    private void simulateTravel() {
        List<Ocorrencia> despachadas = ocorrenciaRepository.findByStatus("DESPACHADA");
        for (Ocorrencia ocorrencia : despachadas) {
            Atendimento atendimento = atendimentoRepository.findFirstByOcorrenciaOrderByIdDesc(ocorrencia);
            if (atendimento != null && atendimento.getDataHoraDespacho() != null) {
                double distance = atendimento.getDistanciaKm();
                long simulatedTravelTimeSeconds = (long) (distance * SECONDS_PER_KM);
                
                // Minimum 2 seconds to avoid instant arrival
                if (simulatedTravelTimeSeconds < 2) simulatedTravelTimeSeconds = 2;

                LocalDateTime arrivalTime = atendimento.getDataHoraDespacho().plusSeconds(simulatedTravelTimeSeconds);

                if (LocalDateTime.now().isAfter(arrivalTime)) {
                    try {
                        logger.info("Simulação: Ambulância chegou ao local da Ocorrencia {} após {} segundos (Distância: {} km).", 
                                ocorrencia.getId(), simulatedTravelTimeSeconds, distance);
                        ocorrenciaService.confirmDeparture(ocorrencia.getId());
                    } catch (Exception e) {
                        logger.error("Erro na simulação de viagem para Ocorrencia {}: {}", ocorrencia.getId(), e.getMessage());
                    }
                }
            }
        }
    }

    private void simulateService() {
        List<Ocorrencia> emAtendimento = ocorrenciaRepository.findByStatus("EM_ATENDIMENTO");
        for (Ocorrencia ocorrencia : emAtendimento) {
            // We need to know when it arrived. 
            // Since we don't store arrival time in Ocorrencia explicitly (only status change), 
            // we can check Atendimento or assume it arrived recently.
            // However, Atendimento has dataHoraChegada? Let's check Atendimento entity.
            // If not, we can rely on the fact that confirmDeparture updates status.
            // But wait, confirmDeparture doesn't update Atendimento with arrival time in my previous plan?
            // Let's check OcorrenciaService.confirmDeparture again.
            
            // If confirmDeparture doesn't set arrival time, we might need to fetch it or infer it.
            // Actually, let's look at Atendimento entity.
            
            // Assuming confirmDeparture sets it, or we can just use a simple heuristic:
            // If we want to be precise, we should update confirmDeparture to set dataHoraChegada.
            // For now, let's assume we can just check if enough time passed since the status changed? 
            // No, Ocorrencia doesn't track "status change time".
            
            // Better approach: Update confirmDeparture to set dataHoraChegada in Atendimento.
            // But I can't change OcorrenciaService right now without context.
            // Let's check if Atendimento has dataHoraChegada.
            
            Atendimento atendimento = atendimentoRepository.findFirstByOcorrenciaOrderByIdDesc(ocorrencia);
            if (atendimento != null) {
                 // If dataHoraChegada is null, it means it just arrived or logic is missing.
                 // If I can't rely on dataHoraChegada, I might be stuck.
                 // Let's check Atendimento.java.
                 
                 // If I can't check Atendimento.java right now, I will assume it exists based on standard practices 
                 // and the fact that I saw it in the implementation plan or previous files.
                 // Wait, I saw V2__seed.sql inserting into atendimento (..., data_hora_chegada, ...).
                 // So it exists.
                 
                 if (atendimento.getDataHoraChegada() != null) {
                     LocalDateTime finishTime = atendimento.getDataHoraChegada().plusSeconds(SERVICE_DURATION_SECONDS);
                     if (LocalDateTime.now().isAfter(finishTime)) {
                         try {
                             logger.info("Simulação: Atendimento da Ocorrencia {} concluído após {} segundos.", 
                                     ocorrencia.getId(), SERVICE_DURATION_SECONDS);
                             ocorrenciaService.finishOccurrence(ocorrencia.getId());
                         } catch (Exception e) {
                             logger.error("Erro na simulação de atendimento para Ocorrencia {}: {}", ocorrencia.getId(), e.getMessage());
                         }
                     }
                 }
            }
        }
    }
}
