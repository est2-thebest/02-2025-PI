package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "atendimento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Atendimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "ocorrencia_id")
    private Ocorrencia ocorrencia;

    @ManyToOne
    @JoinColumn(name = "ambulancia_id")
    private Ambulancia ambulancia;

    @Column(name = "data_hora_despacho")
    private LocalDateTime dataHoraDespacho;

    @Column(name = "data_hora_chegada")
    private LocalDateTime dataHoraChegada;

    @Column(name = "distancia_km")
    private Double distanciaKm;

    @Column(name = "tempo_estimado")
    private Double tempoEstimado;

    @Column(name = "rota", columnDefinition = "TEXT")
    private String rota;

    public String getRota() {
        return rota;
    }

    public void setRota(String rota) {
        this.rota = rota;
    }
}
