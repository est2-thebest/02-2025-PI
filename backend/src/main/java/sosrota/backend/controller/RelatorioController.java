package sosrota.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sosrota.backend.service.RelatorioService;

import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/atendimentos-por-bairro")
    public List<Object[]> getAtendimentosPorBairro() {
        return relatorioService.getAtendimentosPorBairro();
    }

    @GetMapping("/tempo-medio")
    public List<Object[]> getTempoMedioAtendimento() {
        return relatorioService.getTempoMedioAtendimento();
    }
}
