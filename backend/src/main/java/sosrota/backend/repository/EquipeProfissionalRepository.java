package sosrota.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sosrota.backend.entity.EquipeProfissional;

public interface EquipeProfissionalRepository extends JpaRepository<EquipeProfissional, Long> {

    @Query("""
        select ep from EquipeProfissional ep 
        where ep.profissional.id = :profId
        and ep.equipe.ativa = true
        and (
            ep.inicioAlocacao < :fim
            and ep.fimAlocacao > :inicio
        )
    """)
    List<EquipeProfissional> findConflitos(
            @Param("profId") Long profId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );
}
