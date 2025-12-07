package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidade que registra o atendimento de uma ocorrência por uma ambulância.
 * [RF01] Gestão de Ocorrências.
 * [RF07] Dados para Relatórios e SLA.
 */
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

    // [Regra de Negócio] Indicadores de SLA (Service Level Agreement)
    @Column(name = "fora_do_sla")
    private Boolean foraDoSla;

    @Column(name = "sla_previsto")
    private Double slaPrevisto;

    @Column(name = "sla_real")
    private Double slaReal;

    public String getRota() {
        return rota;
    }

    public void setRota(String rota) {
        this.rota = rota;
    }
}
