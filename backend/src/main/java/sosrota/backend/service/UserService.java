package sosrota.backend.service;

import sosrota.backend.entity.User;
import sosrota.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Serviço de gerenciamento de usuários.
 * Implementa UserDetailsService para integração com Spring Security.
 * [RF08] Gestão de Usuários.
 */
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Carrega usuário pelo nome de usuário (login).
     *
     * @param username Nome de usuário
     * @return UserDetails para autenticação
     * @throws UsernameNotFoundException Se não encontrado
     * [RF08] Autenticação.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    /**
     * Cria um novo usuário no sistema.
     *
     * @param username Nome de usuário
     * @param email Email
     * @param password Senha (será criptografada)
     * @return Usuário criado
     * [RF08] Cadastro de usuário.
     * [RNF01] Criptografia de senha.
     */
    public User createUser(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        return userRepository.save(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}