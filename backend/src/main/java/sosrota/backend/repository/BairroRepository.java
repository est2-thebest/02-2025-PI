package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Bairro;

public interface BairroRepository extends JpaRepository<Bairro, Integer> {
}
