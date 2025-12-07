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

/**
 * Serviço responsável pela consolidação de dados para o Dashboard.
 * Agrega informações de múltiplos repositórios para visão gerencial.
 * [RF07] Visualização de Dashboard.
 */
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

    /**
     * Coleta e calcula estatísticas em tempo real do sistema.
     *
     * @return DTO com contadores e métricas
     * [RF07] Painel de Controle.
     * [Banco de Dados II] Agregação de dados (Count/Filter).
     */
    public DashboardDTO getDashboardStats() {
        DashboardDTO stats = new DashboardDTO();

        // [RF01] Monitoramento de fila de espera
        List<Ocorrencia> abertas = ocorrenciaRepository.findByStatus("ABERTA");
        stats.setOcorrenciasAbertas(abertas.size());

        // [RF02] Monitoramento de frota
        List<Ambulancia> todasAmbulancias = ambulanciaRepository.findAll();
        long disponiveis = todasAmbulancias.stream()
                .filter(a -> "DISPONIVEL".equals(a.getStatus()))
                .count();
        stats.setAmbulanciasTotal(todasAmbulancias.size());
        stats.setAmbulanciasDisponiveis((int) disponiveis);

        // [RF07] Indicador de demanda diária
        List<Ocorrencia> todasOcorrencias = ocorrenciaRepository.findAll();
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        long atendimentosHoje = todasOcorrencias.stream()
                .filter(o -> o.getDataHoraAbertura() != null && o.getDataHoraAbertura().isAfter(inicioDoDia))
                .count();
        stats.setAtendimentosHoje((int) atendimentosHoje);

        // [RF03] Monitoramento de recursos humanos - equipes ativas
        stats.setEquipesAtivas((int) equipeRepository.count());

        // [RF03] Monitoramento de recursos humanos - profissionais cadastrados
        stats.setProfissionaisCadastrados((int) profissionalRepository.count());

        return stats;
    }
}
