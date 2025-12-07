package sosrota.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;

/**
 * Manipulador global de exceções da API.
 * Centraliza o tratamento de erros e padroniza as respostas HTTP.
 * [RNF] Tratamento de Erros e Resiliência.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata exceções de estado ilegal.
     *
     * @param e Exceção
     * @return 400 Bad Request
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }

    /**
     * Trata exceções de argumento inválido.
     *
     * @param e Exceção
     * @return 400 Bad Request
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }
    
    /**
     * Trata exceções genéricas não capturadas.
     *
     * @param e Exceção
     * @return 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Erro interno do servidor."));
    }
}
