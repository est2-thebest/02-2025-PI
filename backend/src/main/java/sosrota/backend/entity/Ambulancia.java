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
// [Requisitos Especificos - RF02] O sistema deve permitir o cadastro de ambulancias
// [Problema - 1] Cadastro e Gerenciamento de Ambulancias
public class Ambulancia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String placa;
    private String tipo; // USA, USB
    private String status; // SEM_EQUIPE, DISPONIVEL, EM_ATENDIMENTO, INATIVA, MANUTENCAO

    @ManyToOne
    @JoinColumn(name = "base_id")
    private Bairro bairro;
}
