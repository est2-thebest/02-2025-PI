package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Bairro;
import sosrota.backend.service.BairroService;

import java.util.List;

@RestController
@RequestMapping("/api/bairros")
public class BairroController {

    private final BairroService bairroService;

    public BairroController(BairroService bairroService) {
        this.bairroService = bairroService;
    }

    @GetMapping
    public List<Bairro> findAll() {
        return bairroService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bairro> findById(@PathVariable Integer id) {
        Bairro bairro = bairroService.findById(id);
        return bairro != null ? ResponseEntity.ok(bairro) : ResponseEntity.notFound().build();
    }

    // Read-only controller for Bairros as per business rule (CSV source only)
    
    /* 
    @PostMapping
    public Bairro save(@RequestBody Bairro bairro) {
        return bairroService.save(bairro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bairro> update(@PathVariable Integer id, @RequestBody Bairro bairro) {
        Bairro existingBairro = bairroService.findById(id);
        if (existingBairro == null) {
            return ResponseEntity.notFound().build();
        }
        bairro.setId(id);
        return ResponseEntity.ok(bairroService.save(bairro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        bairroService.delete(id);
        return ResponseEntity.noContent().build();
    }
    */
}
