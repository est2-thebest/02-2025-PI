package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sosrota.backend.entity.Equipe;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> { }
