package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Profissional;
import sosrota.backend.service.ProfissionalService;

import java.util.List;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    private final ProfissionalService profissionalService;

    public ProfissionalController(ProfissionalService profissionalService) {
        this.profissionalService = profissionalService;
    }

    @GetMapping
    public List<Profissional> findAll() {
        return profissionalService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> findById(@PathVariable Integer id) {
        Profissional profissional = profissionalService.findById(id);
        return profissional != null ? ResponseEntity.ok(profissional) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Profissional save(@RequestBody Profissional profissional) {
        return profissionalService.save(profissional);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        profissionalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
