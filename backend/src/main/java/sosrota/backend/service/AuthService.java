package sosrota.backend.service;

import sosrota.backend.dto.LoginRequest;
import sosrota.backend.dto.RegisterRequest;
import sosrota.backend.dto.JwtResponse;
import sosrota.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public JwtResponse authenticate(LoginRequest request) {
        User user = userService.getUserByUsername(request.getUsername());
        
        String jwtToken = jwtService.generateToken(user);
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }

    public JwtResponse register(RegisterRequest request) {
        User user = userService.createUser(
            request.getUsername(), 
            request.getEmail(),
            request.getPassword()
        );
        
        String jwtToken = jwtService.generateToken(user);
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }
}