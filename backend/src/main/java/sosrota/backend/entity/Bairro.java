package sosrota.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bairro")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bairro {
    @Id
    private Integer id;
    private String nome;
}
