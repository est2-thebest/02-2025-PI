package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidade que registra o histórico de mudanças de status de uma ocorrência.
 * [RF01] Rastreabilidade de Ocorrências.
 */
@Entity
@Table(name = "ocorrencia_historico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OcorrenciaHistorico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ocorrencia_id")
    private Ocorrencia ocorrencia;

    @Column(name = "status_anterior")
    private String statusAnterior;

    @Column(name = "status_novo")
    private String statusNovo;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    private String observacao;
}
