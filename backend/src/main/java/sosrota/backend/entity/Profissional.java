package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa um profissional de saúde.
 * [RF03] Cadastro de Profissionais.
 * [Regra de Negócio] Vinculação a Turnos e Equipes.
 */
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
    
    // [Regra de Negócio] Funções: MOTORISTA, ENFERMEIRO, MEDICO
    private String funcao; 
    
    private String contato;
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    private Turno turno; // MATUTINO, VESPERTINO, NOTURNO
}
