package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Equipe;
import sosrota.backend.service.EquipeService;

import java.util.List;

/**
 * Controlador para gerenciamento de equipes.
 * [RF03] Cadastro de Equipes e Profissionais.
 * [Interface de Comunicação] API REST.
 */
@RestController
@RequestMapping("/api/equipes")
public class EquipeController {

    private final EquipeService equipeService;

    public EquipeController(EquipeService equipeService) {
        this.equipeService = equipeService;
    }

    /**
     * Lista todas as equipes.
     *
     * @return Lista de equipes
     * [RF03] Listagem.
     */
    @GetMapping
    public List<Equipe> findAll() {
        return equipeService.findAll();
    }

    /**
     * Busca equipe por ID.
     *
     * @param id Identificador
     * @return Equipe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Equipe> findById(@PathVariable Integer id) {
        Equipe equipe = equipeService.findById(id);
        return equipe != null ? ResponseEntity.ok(equipe) : ResponseEntity.notFound().build();
    }

    /**
     * Cadastra nova equipe.
     *
     * @param equipe Dados
     * @return Equipe salva
     * [RF03] Criação.
     */
    @PostMapping
    public Equipe save(@RequestBody Equipe equipe) {
        return equipeService.save(equipe);
    }

    /**
     * Atualiza equipe.
     *
     * @param id Identificador
     * @param equipe Dados
     * @return Equipe atualizada
     * [RF03] Atualização.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Equipe> update(@PathVariable Integer id, @RequestBody Equipe equipe) {
        Equipe existing = equipeService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        equipe.setId(id);
        return ResponseEntity.ok(equipeService.save(equipe));
    }

    /**
     * Exclui equipe.
     *
     * @param id Identificador
     * @return 204 No Content
     * [RF03] Exclusão.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        equipeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
