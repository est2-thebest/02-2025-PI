package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sosrota.backend.dto.DashboardDTO;
import sosrota.backend.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
// [Interface de Comunicacao] API REST para Agregacao de Dados (BFF - Backend For Frontend)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // [Requisitos Especificos - RF07] Dados consolidados para o Dashboard
    // [Frontend] Cards de Estatisticas da Home
    @GetMapping("/stats")
    public ResponseEntity<DashboardDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}
