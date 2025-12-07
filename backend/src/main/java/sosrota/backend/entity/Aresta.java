package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa uma conexão (rua) entre dois bairros.
 * [RF04] Mapa e Rotas.
 * [Estrutura de Dados II] Aresta de um Grafo Ponderado.
 */
@Entity
@Table(name = "aresta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aresta {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "origem_id")
    private Bairro origem;

    @ManyToOne
    @JoinColumn(name = "destino_id")
    private Bairro destino;

    // [Teoria da Computação] Peso da aresta para cálculo de caminho mínimo
    @Column(name = "distancia_km")
    private Double distanciaKm;
}
