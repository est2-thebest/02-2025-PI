package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.repository.OcorrenciaRepository;
import sosrota.backend.service.OcorrenciaService;

@RestController
@RequestMapping("/api/ocorrencias")
@RequiredArgsConstructor
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;
    private final OcorrenciaRepository ocorrenciaRepository;

    @PostMapping
    public ResponseEntity<Ocorrencia> criar(@RequestBody Ocorrencia ocorrencia) {
        return ResponseEntity.ok(ocorrenciaService.criarOcorrencia(ocorrencia));
    }

    @PostMapping("/{id}/despachar")
    public ResponseEntity<Atendimento> despachar(@PathVariable Long id) {
        return ResponseEntity.ok(ocorrenciaService.despachar(id));
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(ocorrenciaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(
            ocorrenciaRepository.findById(id).orElse(null)
        );
    }
}
