package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sosrota.backend.dto.DashboardDTO;
import sosrota.backend.service.DashboardService;

/**
 * Controlador para fornecimento de dados consolidados ao Dashboard.
 * [RF07] Visualização de Dashboard.
 * [Interface de Comunicação] API REST (BFF).
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Retorna estatísticas gerais do sistema.
     *
     * @return DTO com contadores
     * [RF07] Dados para cards.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}
