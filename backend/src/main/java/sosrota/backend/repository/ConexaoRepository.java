package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sosrota.backend.entity.Conexao;

public interface ConexaoRepository extends JpaRepository<Conexao, Integer> {
}
