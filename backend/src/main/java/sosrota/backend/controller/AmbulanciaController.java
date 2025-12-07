package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.service.AmbulanciaService;

import java.util.List;

@RestController
@RequestMapping("/api/ambulancias")
// [Interface de Comunicacao] API REST para gerenciamento de frota
public class AmbulanciaController {

    private final AmbulanciaService ambulanciaService;

    public AmbulanciaController(AmbulanciaService ambulanciaService) {
        this.ambulanciaService = ambulanciaService;
    }

    // [Requisitos Especificos - RF02] Listar ambulancias
    // [Frontend] Tela de Gestao de Frota
    @GetMapping
    public List<Ambulancia> findAll() {
        return ambulanciaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ambulancia> findById(@PathVariable Integer id) {
        Ambulancia ambulancia = ambulanciaService.findById(id);
        return ambulancia != null ? ResponseEntity.ok(ambulancia) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Ambulancia save(@RequestBody Ambulancia ambulancia) {
        return ambulanciaService.save(ambulancia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ambulancia> update(@PathVariable Integer id, @RequestBody Ambulancia ambulancia) {
        Ambulancia existing = ambulanciaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        ambulancia.setId(id);
        return ResponseEntity.ok(ambulanciaService.save(ambulancia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ambulanciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
