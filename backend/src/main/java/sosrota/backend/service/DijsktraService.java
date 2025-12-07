package sosrota.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import sosrota.backend.entity.Aresta;
import sosrota.backend.entity.Bairro;
import sosrota.backend.repository.ArestaRepository;
import sosrota.backend.repository.BairroRepository;

import java.util.*;

/**
 * Serviço responsável pelo cálculo de rotas e caminhos mínimos.
 * Implementa o algoritmo de Dijkstra em um grafo ponderado representando o mapa da cidade.
 * [Estrutura de Dados II] Implementação de Algoritmo de Caminho Único (Dijkstra).
 * [RF04] O sistema deve calcular o caminho mínimo.
 */
@Service
public class DijsktraService {

  private final BairroRepository bairroRepository;
  private final ArestaRepository arestaRepository;

  // [Estrutura de Dados II] Representação do Grafo (Lista de Adjacência)
  private final Map<Integer, Node> nodes = new HashMap<>();
  private final Map<Integer, List<Edge>> adj = new HashMap<>();

  public DijsktraService(BairroRepository bairroRepository, ArestaRepository arestaRepository) {
    this.bairroRepository = bairroRepository;
    this.arestaRepository = arestaRepository;
  }

  /**
   * Inicializa o grafo carregando nós (bairros) e arestas (ruas) do banco de dados.
   * Executado automaticamente após a injeção de dependências.
   */
  @PostConstruct
  public void init() {
    loadNodes();
    loadEdges();
  }

  /**
   * Retorna o nome de um nó (bairro) dado seu ID.
   *
   * @param id Identificador do nó
   * @return Nome do bairro ou "Unknown"
   */
  public String getNodeName(int id) {
      if (nodes.containsKey(id)) {
          return nodes.get(id).name;
      }
      return "Unknown (" + id + ")";
  }

  /**
   * Encontra o caminho mais curto entre dois pontos usando o algoritmo de Dijkstra.
   *
   * @param sourceId ID do nó de origem (Bairro da Ambulância)
   * @param targetId ID do nó de destino (Bairro da Ocorrência)
   * @return Objeto PathResult contendo a rota e a distância total
   * [Estrutura de Dados II] Algoritmo de Dijkstra (Fila de Prioridade + Relaxamento).
   * [Teoria da Computação - Contextualização Prática] Cálculo de rota ótima em grafo ponderado.
   * [RF04] Cálculo de rota para despacho.
   */
  public PathResult findShortestPath(int sourceId, int targetId) {
    if (!nodes.containsKey(sourceId) || !nodes.containsKey(targetId)) {
      return new PathResult(Collections.emptyList(), Collections.emptyList(), Double.NaN);
    }

    // Inicialização das estruturas de dados
    Map<Integer, Double> dist = new HashMap<>();
    Map<Integer, Integer> prev = new HashMap<>(); // nó anterior no caminho ótimo
    Map<Integer, Edge> prevEdge = new HashMap<>(); // aresta usada para chegar ao nó

    for (Integer id : nodes.keySet()) {
      dist.put(id, Double.POSITIVE_INFINITY);
    }
    dist.put(sourceId, 0.0);

    // [Estrutura de Dados II] Fila de Prioridade (Min-Heap) para seleção gulosa
    PriorityQueue<NodeDistance> pq = new PriorityQueue<>(Comparator.comparingDouble(nd -> nd.distance));
    pq.add(new NodeDistance(sourceId, 0.0));

    Set<Integer> visited = new HashSet<>();

    while (!pq.isEmpty()) {
      NodeDistance cur = pq.poll();
      int u = cur.nodeId;

      if (visited.contains(u))
        continue;
      visited.add(u);

      if (u == targetId)
        break;

      List<Edge> neighbors = adj.getOrDefault(u, Collections.emptyList());
      for (Edge e : neighbors) {
        int v = e.to;
        double alt = dist.get(u) + e.distance;
        // Passo de Relaxamento
        if (alt < dist.get(v)) {
          dist.put(v, alt);
          prev.put(v, u);
          prevEdge.put(v, e);
          pq.add(new NodeDistance(v, alt));
        }
      }
    }

    if (!dist.containsKey(targetId) || dist.get(targetId).isInfinite()) {
      return new PathResult(Collections.emptyList(), Collections.emptyList(), Double.NaN);
    }

    // Reconstrução do caminho
    LinkedList<Integer> nodePath = new LinkedList<>();
    LinkedList<Edge> edgePath = new LinkedList<>();
    int cur = targetId;
    while (cur != sourceId) {
      nodePath.addFirst(cur);
      Edge e = prevEdge.get(cur);
      if (e != null)
        edgePath.addFirst(e);
      Integer p = prev.get(cur);
      if (p == null)
        break; // safety
      cur = p;
    }
    nodePath.addFirst(sourceId);

    double total = dist.get(targetId);
    return new PathResult(nodePath, edgePath, total);
  }

  private void addEdge(Edge e) {
    adj.computeIfAbsent(e.from, k -> new ArrayList<>()).add(e);
  }

  /**
   * Carrega os vértices do grafo a partir da tabela de bairros.
   * [RF04] Mapeamento de Bairros como nós.
   */
  private void loadNodes() {
    List<Bairro> bairros = bairroRepository.findAll();
    for (Bairro b : bairros) {
      nodes.put(b.getId(), new Node(b.getId(), b.getNome()));
    }
  }

  /**
   * Carrega as arestas do grafo a partir da tabela de conexões (ruas).
   * [RF04] Mapeamento de Ruas como arestas ponderadas pela distância.
   */
  private void loadEdges() {
    List<Aresta> arestas = arestaRepository.findAll();
    for (Aresta a : arestas) {
      // Grafo não-direcionado (mão dupla)
      addUndirected(a.getId(), a.getOrigem().getId(), a.getDestino().getId(), a.getDistanciaKm());
    }
  }

  private void addUndirected(int id, int a, int b, double dist) {
    Edge e1 = new Edge(id, a, b, dist);
    Edge e2 = new Edge(id, b, a, dist);
    addEdge(e1);
    addEdge(e2);
  }

  // Classes auxiliares para representação do grafo
  public static class Node {
    public final int id;
    public final String name;

    public Node(int id, String name) {
      this.id = id;
      this.name = name;
    }

    @Override
    public String toString() {
      return id + "(" + name + ")";
    }
  }

  public static class Edge {
    public final int id;
    public final int from;
    public final int to;
    public final double distance;

    public Edge(int id, int from, int to, double distance) {
      this.id = id;
      this.from = from;
      this.to = to;
      this.distance = distance;
    }

    @Override
    public String toString() {
      return String.format("Edge %d: %d -> %d (%.2f km)", id, from, to, distance);
    }
  }

  public static class PathResult {
    public final List<Integer> nodes; // sequence of node ids
    public final List<Edge> edges; // sequence of edges in order
    public final double totalDistance;

    public PathResult(List<Integer> nodes, List<Edge> edges, double totalDistance) {
      this.nodes = nodes;
      this.edges = edges;
      this.totalDistance = totalDistance;
    }

    @Override
    public String toString() {
      StringBuilder sb = new StringBuilder();
      sb.append("Nodes: ");
      sb.append(nodes);
      sb.append("\nEdges:\n");
      for (Edge e : edges)
        sb.append("  ").append(e).append('\n');
      sb.append(String.format("Total: %.2f km", totalDistance));
      return sb.toString();
    }
  }

  private static class NodeDistance {
    int nodeId;
    double distance;

    public NodeDistance(int nodeId, double distance) {
      this.nodeId = nodeId;
      this.distance = distance;
    }
  }
}
