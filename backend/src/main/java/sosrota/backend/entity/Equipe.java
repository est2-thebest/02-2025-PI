package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "equipe")
@Data
@NoArgsConstructor
@AllArgsConstructor
// [Requisitos Especificos - RF03] O sistema deve permitir o cadastro de profissionais e montagem de equipes
// [Problema - 2] Cadastro de Profissionais e Montagem de Equipes
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
