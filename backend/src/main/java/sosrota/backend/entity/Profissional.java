package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profissional")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profissional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String funcao; // MOTORISTA, ENFERMEIRO, MEDICO
    private String contato;
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    private Turno turno;
}
