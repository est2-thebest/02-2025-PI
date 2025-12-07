package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Equipe;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Profissional;
import sosrota.backend.entity.Turno;

import java.util.List;

public interface EquipeRepository extends JpaRepository<Equipe, Integer> {
    List<Equipe> findByAmbulanciaAndTurno(Ambulancia ambulancia, Turno turno);

    @Query("SELECT e FROM Equipe e JOIN e.profissionais p WHERE p = :profissional AND e.turno = :turno")
    List<Equipe> findByProfissionalAndTurno(@Param("profissional") Profissional profissional, @Param("turno") Turno turno);

    List<Equipe> findByAmbulancia(Ambulancia ambulancia);

    boolean existsByProfissionaisContaining(Profissional profissional);
}
