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
// [Requisitos Especificos - RF03] O sistema deve permitir o cadastro de profissionais
// [Problema - 2] Cadastro de Profissionais e Montagem de Equipes
public class Profissional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String funcao; // MOTORISTA, ENFERMEIRO, MEDICO
    private String contato;
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    private Turno turno; // MATUTINO, VESPERTINO, NOTURNO
}
