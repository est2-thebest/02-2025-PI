package sosrota.backend.controller;


import sosrota.backend.dto.UserResponse;
import sosrota.backend.entity.User;
import sosrota.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

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