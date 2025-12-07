package sosrota.backend.controller;

import sosrota.backend.dto.LoginRequest;
import sosrota.backend.dto.RegisterRequest;
import sosrota.backend.dto.JwtResponse;
import sosrota.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
// [Interface de Comunicacao] API REST para Autenticacao e Seguranca
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // [Regras de Negocio - 1] Login de usuario
    // [Frontend] Tela de Login (JWT Storage)
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticate(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}