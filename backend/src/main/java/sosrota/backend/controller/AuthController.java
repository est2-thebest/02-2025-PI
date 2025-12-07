package sosrota.backend.controller;

import sosrota.backend.dto.LoginRequest;
import sosrota.backend.dto.RegisterRequest;
import sosrota.backend.dto.JwtResponse;
import sosrota.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável pela autenticação e registro de usuários.
 * [RF08] Autenticação e Controle de Acesso.
 * [Interface de Comunicação] API REST.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Registra um novo usuário.
     *
     * @param request Dados de registro
     * @return Token JWT
     * [RF08] Cadastro de usuários.
     */
    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Autentica um usuário existente.
     *
     * @param request Credenciais
     * @return Token JWT
     * [RF08] Login.
     */
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticate(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}