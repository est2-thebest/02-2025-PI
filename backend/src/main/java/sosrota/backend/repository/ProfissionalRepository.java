package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Profissional;

public interface ProfissionalRepository extends JpaRepository<Profissional, Integer> {
}
