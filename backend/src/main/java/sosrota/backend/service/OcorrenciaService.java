package sosrota.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.OcorrenciaRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final AtendimentoRepository atendimentoRepository;
    private final DijsktraService dijsktraService;

    public OcorrenciaService(OcorrenciaRepository ocorrenciaRepository,
            AmbulanciaRepository ambulanciaRepository,
            AtendimentoRepository atendimentoRepository,
            DijsktraService dijsktraService) {
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.ambulanciaRepository = ambulanciaRepository;
        this.atendimentoRepository = atendimentoRepository;
        this.dijsktraService = dijsktraService;
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

        Ambulancia nearestAmbulance = null;
        double minDistance = Double.MAX_VALUE;

        for (Ambulancia ambulancia : availableAmbulances) {
            if (ambulancia.getBase() != null) {
                DijsktraService.PathResult result = dijsktraService.findShortestPath(
                        ambulancia.getBase().getId(),
                        ocorrencia.getBairro().getId());

                if (!Double.isNaN(result.totalDistance) && result.totalDistance < minDistance) {
                    minDistance = result.totalDistance;
                    nearestAmbulance = ambulancia;
                }
            }
        }

        if (nearestAmbulance != null) {
            // Create Atendimento
            Atendimento atendimento = new Atendimento();
            atendimento.setOcorrencia(ocorrencia);
            atendimento.setAmbulancia(nearestAmbulance);
            atendimento.setDataHoraDespacho(LocalDateTime.now());
            atendimento.setDistanciaKm(minDistance);
            atendimentoRepository.save(atendimento);

            // Update Ambulancia Status
            nearestAmbulance.setStatus("EM_ATENDIMENTO");
            ambulanciaRepository.save(nearestAmbulance);

            // Update Ocorrencia Status
            ocorrencia.setStatus("EM_ANDAMENTO");
            ocorrenciaRepository.save(ocorrencia);
        }
    }
}
