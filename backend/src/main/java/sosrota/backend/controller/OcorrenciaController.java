package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.service.OcorrenciaService;

import java.util.List;

@RestController
@RequestMapping("/api/ocorrencias")
public class OcorrenciaController {

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
        return ocorrenciaService.createOcorrencia(ocorrencia);
    }
}
