package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidade que representa uma ocorrência de emergência.
 * [RF01] Cadastro de Ocorrências.
 * [Regra de Negócio] Ciclo de vida: ABERTA -> DESPACHADA -> EM_ANDAMENTO -> CONCLUIDA.
 */
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
    
    // [Regra de Negócio] Gravidade define prioridade e SLA
    private String gravidade; // ALTA, MEDIA, BAIXA

    @ManyToOne
    @JoinColumn(name = "bairro_id")
    private Bairro bairro;

    @Column(name = "data_hora_abertura")
    private LocalDateTime dataHoraAbertura;

    private String status; // ABERTA, DESPACHADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA
    
    @Column(name = "data_hora_fechamento")
    private LocalDateTime dataHoraFechamento;

    private String observacao;
}
