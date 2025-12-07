package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Bairro;
import sosrota.backend.service.BairroService;

import java.util.List;

/**
 * Controlador para consulta de bairros (mapa).
 * [RF04] Cadastro de Mapa e Rotas.
 * [Interface de Comunicação] API REST.
 */
@RestController
@RequestMapping("/api/bairros")
public class BairroController {

    private final BairroService bairroService;

    public BairroController(BairroService bairroService) {
        this.bairroService = bairroService;
    }

    /**
     * Lista todos os bairros.
     *
     * @return Lista de bairros
     * [RF04] Consulta de locais.
     */
    @GetMapping
    public List<Bairro> findAll() {
        return bairroService.findAll();
    }

    /**
     * Busca bairro por ID.
     *
     * @param id Identificador
     * @return Bairro
     */
    @GetMapping("/{id}")
    public ResponseEntity<Bairro> findById(@PathVariable Integer id) {
        Bairro bairro = bairroService.findById(id);
        return bairro != null ? ResponseEntity.ok(bairro) : ResponseEntity.notFound().build();
    }

    // Como os bairros são carregados a partir de arquivos CSV, os métodos abaixo não são implementados.
    
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
