package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.dto.DashboardDTO;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.EquipeRepository;
import sosrota.backend.repository.OcorrenciaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import sosrota.backend.repository.ProfissionalRepository;

@Service
public class DashboardService {

    private final OcorrenciaRepository ocorrenciaRepository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final EquipeRepository equipeRepository;
    private final ProfissionalRepository profissionalRepository;

    public DashboardService(OcorrenciaRepository ocorrenciaRepository,
                            AmbulanciaRepository ambulanciaRepository,
                            EquipeRepository equipeRepository,
                            ProfissionalRepository profissionalRepository) {
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.ambulanciaRepository = ambulanciaRepository;
        this.equipeRepository = equipeRepository;
        this.profissionalRepository = profissionalRepository;
    }

    public DashboardDTO getDashboardStats() {
        DashboardDTO stats = new DashboardDTO();

        // 1. Ocorrências Abertas
        List<Ocorrencia> abertas = ocorrenciaRepository.findByStatus("ABERTA");
        stats.setOcorrenciasAbertas(abertas.size());

        // 2. Ambulâncias
        List<Ambulancia> todasAmbulancias = ambulanciaRepository.findAll();
        long disponiveis = todasAmbulancias.stream()
                .filter(a -> "DISPONIVEL".equals(a.getStatus()))
                .count();
        stats.setAmbulanciasTotal(todasAmbulancias.size());
        stats.setAmbulanciasDisponiveis((int) disponiveis);

        // 3. Atendimentos Hoje (Ocorrências criadas hoje)
        List<Ocorrencia> todasOcorrencias = ocorrenciaRepository.findAll();
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        long atendimentosHoje = todasOcorrencias.stream()
                .filter(o -> o.getDataHoraAbertura() != null && o.getDataHoraAbertura().isAfter(inicioDoDia))
                .count();
        stats.setAtendimentosHoje((int) atendimentosHoje);

        // 5. Equipes Ativas
        stats.setEquipesAtivas((int) equipeRepository.count());

        // 6. Profissionais Cadastrados
        stats.setProfissionaisCadastrados((int) profissionalRepository.count());

        return stats;
    }
}
