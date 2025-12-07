package sosrota.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO para requisição de registro de novo usuário.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
  @NotBlank
  private String username;

  @Email
  @NotBlank
  private String email;

  @NotBlank
  private String password;
}
