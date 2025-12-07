package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para verificação de saúde e informações da API.
 * [RNF] Monitoramento e Disponibilidade.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * Endpoint de Health Check (Liveness Probe).
     *
     * @return Status UP
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "SOS-Rota Backend is running");
        return ResponseEntity.ok(response);
    }

    /**
     * Informações básicas sobre a API.
     *
     * @return Metadados da aplicação
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> info() {
        Map<String, String> response = new HashMap<>();
        response.put("name", "SOS-Rota Backend");
        response.put("version", "0.0.1-SNAPSHOT");
        response.put("description", "Emergency dispatch system for ambulances");
        return ResponseEntity.ok(response);
    }
}
