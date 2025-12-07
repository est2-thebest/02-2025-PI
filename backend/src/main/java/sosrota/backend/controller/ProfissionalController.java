package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Profissional;
import sosrota.backend.service.ProfissionalService;

import java.util.List;

/**
 * Controlador para gerenciamento de profissionais.
 * [RF03] Cadastro de Equipes e Profissionais.
 * [Interface de Comunicação] API REST.
 */
@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    private final ProfissionalService profissionalService;

    public ProfissionalController(ProfissionalService profissionalService) {
        this.profissionalService = profissionalService;
    }

    /**
     * Lista todos os profissionais.
     *
     * @return Lista de profissionais
     * [RF03] Listagem.
     */
    @GetMapping
    public List<Profissional> findAll() {
        return profissionalService.findAll();
    }

    /**
     * Busca profissional por ID.
     *
     * @param id Identificador
     * @return Profissional
     */
    @GetMapping("/{id}")
    public ResponseEntity<Profissional> findById(@PathVariable Integer id) {
        Profissional profissional = profissionalService.findById(id);
        return profissional != null ? ResponseEntity.ok(profissional) : ResponseEntity.notFound().build();
    }

    /**
     * Cadastra novo profissional.
     *
     * @param profissional Dados
     * @return Profissional salvo
     * [RF03] Cadastro.
     */
    @PostMapping
    public Profissional save(@RequestBody Profissional profissional) {
        return profissionalService.save(profissional);
    }

    /**
     * Atualiza profissional.
     *
     * @param id Identificador
     * @param profissional Dados
     * @return Profissional atualizado
     * [RF03] Atualização.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Profissional> update(@PathVariable Integer id, @RequestBody Profissional profissional) {
        Profissional updated = profissionalService.update(id, profissional);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    /**
     * Exclui profissional.
     *
     * @param id Identificador
     * @return 204 No Content
     * [RF03] Exclusão.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        profissionalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
