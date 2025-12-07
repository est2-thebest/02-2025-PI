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
// [Requisitos Especificos - RF01] O sistema deve permitir o cadastro de ocorrencias
// [Problema - 4] Registro e Triagem de Ocorrencias
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

    private String status; // ABERTA, DESPACHADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA
    
    @Column(name = "data_hora_fechamento")
    private LocalDateTime dataHoraFechamento;

    private String observacao;
}
