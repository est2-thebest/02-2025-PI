package sosrota.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sosrota.backend.dto.JwtResponse;
import sosrota.backend.dto.LoginRequest;
import sosrota.backend.dto.RegisterRequest;
import sosrota.backend.entity.User;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public JwtResponse authenticate(LoginRequest request) {
        User user = userService.getUserByUsername(request.getUsername());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        String jwtToken = jwtService.generateToken(user);
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }

    public JwtResponse register(RegisterRequest request) {
        User user = userService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword());

        String jwtToken = jwtService.generateToken(user);
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }
}