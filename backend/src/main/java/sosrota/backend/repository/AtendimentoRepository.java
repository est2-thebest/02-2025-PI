package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Atendimento;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Integer> {
    boolean existsByAmbulancia(sosrota.backend.entity.Ambulancia ambulancia);
}
