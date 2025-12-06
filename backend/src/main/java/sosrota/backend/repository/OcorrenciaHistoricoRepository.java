package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.entity.OcorrenciaHistorico;

import java.util.List;

public interface OcorrenciaHistoricoRepository extends JpaRepository<OcorrenciaHistorico, Integer> {
    List<OcorrenciaHistorico> findByOcorrenciaOrderByDataHoraDesc(Ocorrencia ocorrencia);
}
