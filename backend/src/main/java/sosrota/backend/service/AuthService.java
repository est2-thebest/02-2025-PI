package sosrota.backend.service;

import sosrota.backend.dto.LoginRequest;
import sosrota.backend.dto.JwtResponse;
import sosrota.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public JwtResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        User user = (User) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(user);
        
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }

    public JwtResponse register(LoginRequest request) {
        User user = userService.createUser(
            request.getUsername(), 
            request.getUsername() + "@example.com", // Adjust as needed
            request.getPassword()
        );
        
        String jwtToken = jwtService.generateToken(user);
        return new JwtResponse(jwtToken, user.getUsername(), user.getRole().name());
    }
}