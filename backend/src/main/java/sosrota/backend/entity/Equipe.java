package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Entidade que representa uma equipe de atendimento.
 * [RF03] Cadastro de Equipes.
 * [Banco de Dados II] Relacionamento com Profissionais.
 */
@Entity
@Table(name = "equipe")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String descricao;

    @OneToOne
    @JoinColumn(name = "ambulancia_id")
    private Ambulancia ambulancia;

    @Enumerated(EnumType.STRING)
    private Turno turno;

    @ManyToMany
    @JoinTable(name = "equipe_profissional", joinColumns = @JoinColumn(name = "equipe_id"), inverseJoinColumns = @JoinColumn(name = "profissional_id"))
    private List<Profissional> profissionais;
}
