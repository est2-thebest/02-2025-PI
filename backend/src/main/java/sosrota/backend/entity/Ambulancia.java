package sosrota.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa uma ambulância no sistema.
 * [RF02] Cadastro de Ambulâncias.
 * [Banco de Dados II] Mapeamento Objeto-Relacional (ORM).
 */
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
    
    // [Regra de Negócio] Tipos: USA (Suporte Avançado), USB (Suporte Básico)
    private String tipo; 
    
    // [Regra de Negócio] Status: DISPONIVEL, EM_ATENDIMENTO, INATIVA, MANUTENCAO
    private String status; 

    @ManyToOne
    @JoinColumn(name = "base_id")
    private Bairro bairro;
}
