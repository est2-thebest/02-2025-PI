package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ambulancia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ambulancia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String placa;
    private String tipo; // USA, USB
    private String status; // DISPONIVEL, EM_ATENDIMENTO, INATIVA

    @ManyToOne
    @JoinColumn(name = "base_id")
    private Bairro bairro;
}
