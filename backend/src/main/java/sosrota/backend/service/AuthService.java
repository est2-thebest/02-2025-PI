package sosrota.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sosrota.backend.dto.JwtResponse;
import sosrota.backend.dto.LoginRequest;
import sosrota.backend.dto.RegisterRequest;
import sosrota.backend.entity.User;

/**
 * Serviço de autenticação e registro de usuários.
 * Gerencia o ciclo de vida de tokens JWT e validação de credenciais.
 * [RF08] Autenticação e Controle de Acesso.
 * [RNF01] Segurança e Criptografia.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Autentica um usuário e gera um token JWT.
     *
     * @param request Credenciais de login (username, password)
     * @return Token JWT e detalhes do usuário
     * [RF08] Login de usuário.
     * [RNF01] Validação segura de senha (Hash BCrypt).
     */
    public JwtResponse authenticate(LoginRequest request) {
        User user = userService.getUserByUsername(request.getUsername());
        
        // [RNF01] O sistema armazena senhas com uso de hash criptografico
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        String jwtToken = jwtService.generateToken(user);
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }

    /**
     * Registra um novo usuário no sistema.
     *
     * @param request Dados de registro
     * @return Token JWT para acesso imediato
     * [RF08] Cadastro de novos usuários.
     */
    public JwtResponse register(RegisterRequest request) {
        User user = userService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword());

        String jwtToken = jwtService.generateToken(user);
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }
}