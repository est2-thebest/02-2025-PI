package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "aresta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conexao {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "origem_id")
    private Bairro bairroOrigem;

    @ManyToOne
    @JoinColumn(name = "destino_id")
    private Bairro bairroDestino;

    @Column(name = "distancia_km")
    private Double distanciaKm;
}
