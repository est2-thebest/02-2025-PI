package sosrota.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelatorioService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Object[]> getAtendimentosPorBairro() {
        String sql = "SELECT b.nome, COUNT(o.id) " +
                "FROM ocorrencia o " +
                "JOIN bairro b ON o.bairro_id = b.id " +
                "GROUP BY b.nome";
        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }

    public List<Object[]> getTempoMedioAtendimento() {
        // Assuming we calculate time from dispatch to arrival (if arrival is set)
        // Or just listing some stats. Let's do a simple count for now or average
        // distance.
        // The requirement says "Implementar e exibir resultados de duas consultas SQL
        // relevantes".
        // Let's do Average Distance per Ambulance Type.
        String sql = "SELECT a.tipo, AVG(at.distancia_km) " +
                "FROM atendimento at " +
                "JOIN ambulancia a ON at.ambulancia_id = a.id " +
                "GROUP BY a.tipo";
        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }
}
