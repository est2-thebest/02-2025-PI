package sosrota.backend.controller;


import sosrota.backend.dto.UserResponse;
import sosrota.backend.entity.User;
import sosrota.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para gerenciamento de usuários.
 * [RF08] Gestão de Usuários.
 * [Interface de Comunicação] API REST.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    /**
     * Obtém os dados do usuário logado.
     *
     * @param authentication Contexto de segurança
     * @return Dados do usuário
     * [RF08] Perfil de usuário.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserResponse response = new UserResponse(
            user.getId(), 
            user.getUsername(), 
            user.getEmail(), 
            user.getRole().name()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Busca usuário por nome de usuário.
     *
     * @param username Nome de usuário
     * @return Dados do usuário
     * [RF08] Consulta de usuários.
     */
    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        UserResponse response = new UserResponse(
            user.getId(), 
            user.getUsername(), 
            user.getEmail(), 
            user.getRole().name()
        );
        return ResponseEntity.ok(response);
    }
}