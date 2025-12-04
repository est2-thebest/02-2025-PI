package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Equipe;

public interface EquipeRepository extends JpaRepository<Equipe, Integer> {
}
