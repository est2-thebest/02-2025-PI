package sosrota.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sosrota.backend.service.RelatorioService;

import java.util.List;

/**
 * Controlador para geração de relatórios gerenciais.
 * [RF07] Consultas e Relatórios.
 * [Interface de Comunicação] API REST.
 */
@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    /**
     * Relatório de atendimentos agrupados por bairro.
     *
     * @return Lista de dados agrupados
     * [RF07] Relatório por localidade.
     */
    @GetMapping("/atendimentos-por-bairro")
    public List<Object[]> getAtendimentosPorBairro() {
        return relatorioService.getAtendimentosPorBairro();
    }

    /**
     * Relatório de tempo médio de atendimento.
     *
     * @return Lista de médias
     * [RF07] Relatório de performance.
     */
    @GetMapping("/tempo-medio")
    public List<Object[]> getTempoMedioAtendimento() {
        return relatorioService.getTempoMedioAtendimento();
    }
}
