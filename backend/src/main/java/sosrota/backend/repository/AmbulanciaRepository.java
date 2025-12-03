package sosrota.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.StatusAmbulancia;

@Repository
public interface AmbulanciaRepository extends JpaRepository<Ambulancia, Long> {

    List<Ambulancia> findByStatus(StatusAmbulancia status);

    @Query("""
        select a from Ambulancia a 
        where a.status = :status 
        and exists (
            select e from Equipe e 
            where e.ambulancia = a 
            and e.ativa = true
        )
    """)
    List<Ambulancia> findDisponiveisComEquipeAtiva(@Param("status") StatusAmbulancia status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Ambulancia a where a.id = :id")
    Ambulancia findByIdForUpdate(@Param("id") Long id);
}
