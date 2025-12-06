package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.service.OcorrenciaService;

import java.util.List;

@RestController
@RequestMapping("/api/ocorrencias")
public class OcorrenciaController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(OcorrenciaController.class);

    private final OcorrenciaService ocorrenciaService;

    public OcorrenciaController(OcorrenciaService ocorrenciaService) {
        this.ocorrenciaService = ocorrenciaService;
    }

    @GetMapping
    public List<Ocorrencia> findAll() {
        return ocorrenciaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> findById(@PathVariable Integer id) {
        Ocorrencia ocorrencia = ocorrenciaService.findById(id);
        return ocorrencia != null ? ResponseEntity.ok(ocorrencia) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Ocorrencia create(@RequestBody Ocorrencia ocorrencia) {
        logger.info("Recebida requisição para criar Ocorrencia: {}", ocorrencia);
        return ocorrenciaService.createOcorrencia(ocorrencia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ocorrencia> update(@PathVariable Integer id, @RequestBody Ocorrencia ocorrencia) {
        Ocorrencia existing = ocorrenciaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        ocorrencia.setId(id);
        return ResponseEntity.ok(ocorrenciaService.createOcorrencia(ocorrencia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Ocorrencia existing = ocorrenciaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        ocorrenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/confirmar-saida")
    public ResponseEntity<Void> confirmDeparture(@PathVariable Integer id) {
        logger.info("Recebida requisição para confirmar saída da Ocorrencia {}", id);
        ocorrenciaService.confirmDeparture(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/concluir")
    public ResponseEntity<Void> finishOccurrence(@PathVariable Integer id) {
        logger.info("Recebida requisição para concluir Ocorrencia {}", id);
        ocorrenciaService.finishOccurrence(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/detalhes")
    public ResponseEntity<sosrota.backend.dto.OcorrenciaDetalhesDTO> getDetalhes(@PathVariable Integer id) {
        sosrota.backend.dto.OcorrenciaDetalhesDTO detalhes = ocorrenciaService.getOcorrenciaDetalhes(id);
        if (detalhes != null) {
            return ResponseEntity.ok(detalhes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelOccurrence(@PathVariable Integer id, @RequestBody(required = false) java.util.Map<String, String> payload) {
        String justificativa = (payload != null) ? payload.get("justificativa") : "Sem justificativa";
        logger.info("Recebida requisição para cancelar Ocorrencia {} com justificativa: {}", id, justificativa);
        ocorrenciaService.cancelOccurrence(id, justificativa);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<sosrota.backend.entity.OcorrenciaHistorico>> getHistorico(@PathVariable Integer id) {
        List<sosrota.backend.entity.OcorrenciaHistorico> historico = ocorrenciaService.findHistoricoByOcorrenciaId(id);
        return ResponseEntity.ok(historico);
    }
}
