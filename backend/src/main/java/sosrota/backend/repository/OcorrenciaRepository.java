package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Ocorrencia;

import java.util.List;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Integer> {
    List<Ocorrencia> findByStatus(String status);
}
