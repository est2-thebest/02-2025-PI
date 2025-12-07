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

    // [Banco de Dados II - Consultas SQL] Consulta que retorna valor de negocio relevante (Ocorrencias por bairro)
    // [Teoria da Computacao - Demonstracao Numerica] Agregacao de dados para analise
    // [Requisitos Especificos - RF07] Consultar mapa de ocorrencias (quantidade por bairro)
    public List<Object[]> getAtendimentosPorBairro() {
        String sql = "SELECT b.nome, COUNT(o.id) " +
                "FROM ocorrencia o " +
                "JOIN bairro b ON o.bairro_id = b.id " +
                "GROUP BY b.nome";
        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }

    // [Banco de Dados II - Consultas SQL] Consulta que retorna valor de negocio relevante (Media de distancia/tempo)
    // [Requisitos Especificos - RF07] Consultar tempo medio de resposta
    public List<Object[]> getTempoMedioAtendimento() {
        String sql = "SELECT a.tipo, AVG(at.distancia_km) " +
                "FROM atendimento at " +
                "JOIN ambulancia a ON at.ambulancia_id = a.id " +
                "GROUP BY a.tipo";
        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }
}
