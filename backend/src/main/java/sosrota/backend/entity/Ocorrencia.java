package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ocorrencias")
@Data
@NoArgsConstructor
public class Ocorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;

    @Enumerated(EnumType.STRING)
    private Gravidade gravidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "local_base_id")
    private Base local;

    private LocalDateTime dataHoraAbertura = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private StatusOcorrencia status = StatusOcorrencia.ABERTA;

    private String observacao;

    private Double distanciaKmCalculada;

    private Integer slaMinutos;
}
