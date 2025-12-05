package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ocorrencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ocorrencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tipo;
    private String gravidade; // ALTA, MEDIA, BAIXA

    @ManyToOne
    @JoinColumn(name = "bairro_id")
    private Bairro bairro;

    @Column(name = "data_hora_abertura")
    private LocalDateTime dataHoraAbertura;

    private String status; // ABERTA, EM_ANDAMENTO, CONCLUIDA, CANCELADA
    private String observacao;
}
