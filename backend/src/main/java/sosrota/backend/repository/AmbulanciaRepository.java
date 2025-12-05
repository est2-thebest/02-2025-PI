package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Ambulancia;

import java.util.List;

public interface AmbulanciaRepository extends JpaRepository<Ambulancia, Integer> {
    List<Ambulancia> findByStatus(String status);
}
