package sosrota.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável pela geração de relatórios e consultas analíticas.
 * Utiliza consultas nativas (SQL) para agregação de dados.
 * [RF07] Consultas e Relatórios.
 * [Banco de Dados II] Consultas complexas com JOIN e Aggregation.
 */
@Service
public class RelatorioService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Retorna a contagem de atendimentos agrupados por bairro.
     *
     * @return Lista de objetos [Nome do Bairro, Quantidade]
     * [RF07] Relatório de Ocorrências por Bairro.
     * [Teoria da Computacao - Demonstracao Numerica] Agregacao de dados para analise
     * [Banco de Dados II] Consulta que retorna valor.
     */
    public List<Object[]> getAtendimentosPorBairro() {
        String sql = "SELECT b.nome, COUNT(o.id) " +
                "FROM ocorrencia o " +
                "JOIN bairro b ON o.bairro_id = b.id " +
                "GROUP BY b.nome";
        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }

    /**
     * Retorna a média de distância percorrida por tipo de ambulância.
     *
     * @return Lista de objetos [Tipo Ambulância, Distância Média]
     */
    public List<Object[]> getTempoMedioAtendimento() {
        String sql = "SELECT a.tipo, AVG(at.distancia_km) " +
                "FROM atendimento at " +
                "JOIN ambulancia a ON at.ambulancia_id = a.id " +
                "GROUP BY a.tipo";
        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }
}
