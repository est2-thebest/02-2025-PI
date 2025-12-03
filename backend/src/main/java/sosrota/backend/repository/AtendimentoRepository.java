package sosrota.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sosrota.backend.entity.Atendimento;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> { }
