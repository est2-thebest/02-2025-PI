package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Equipe;
import sosrota.backend.service.EquipeService;

import java.util.List;

@RestController
@RequestMapping("/api/equipes")
public class EquipeController {

    private final EquipeService equipeService;

    public EquipeController(EquipeService equipeService) {
        this.equipeService = equipeService;
    }

    @GetMapping
    public List<Equipe> findAll() {
        return equipeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipe> findById(@PathVariable Integer id) {
        Equipe equipe = equipeService.findById(id);
        return equipe != null ? ResponseEntity.ok(equipe) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Equipe save(@RequestBody Equipe equipe) {
        return equipeService.save(equipe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        equipeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
