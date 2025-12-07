package sosrota.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de autenticação bem-sucedida.
 * Retorna o token JWT e dados básicos do usuário.
 * [RF08] Autenticação.
 * [RNF01] Segurança (Token Bearer).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String username;
    private String role;
}