package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.service.AmbulanciaService;

import java.util.List;

/**
 * Controlador responsável pelo gerenciamento das ambulâncias.
 * Implementa operações CRUD e atende ao requisito RF02 do projeto SOS-Rota.
 * [RF02] Cadastro e gerenciamento de ambulâncias.
 * [Interface de Comunicação] Exposto via API REST.
 */
@RestController
@RequestMapping("/api/ambulancias")
public class AmbulanciaController {

    private final AmbulanciaService ambulanciaService;

    public AmbulanciaController(AmbulanciaService ambulanciaService) {
        this.ambulanciaService = ambulanciaService;
    }

    /**
     * Recupera todas as ambulâncias registradas no sistema.
     *
     * @return lista de ambulâncias cadastradas
     * [RF02] Leitura de dados de frota.
     * [Banco de Dados II - Consultas SQL] Select all from ambulancia.
     */
    @GetMapping
    public List<Ambulancia> findAll() {
        return ambulanciaService.findAll();
    }

    /**
     * Busca uma ambulância específica pelo seu ID.
     *
     * @param id Identificador único da ambulância
     * @return ResponseEntity com a ambulância encontrada ou 404 Not Found
     * [RF02] Consulta detalhada de recurso.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ambulancia> findById(@PathVariable Integer id) {
        Ambulancia ambulancia = ambulanciaService.findById(id);
        return ambulancia != null ? ResponseEntity.ok(ambulancia) : ResponseEntity.notFound().build();
    }

    /**
     * Cadastra uma nova ambulância no sistema.
     *
     * @param ambulancia Objeto contendo os dados da nova ambulância
     * @return A ambulância persistida com seu ID gerado
     * [RF02] Criação de novo recurso de frota.
     */
    @PostMapping
    public Ambulancia save(@RequestBody Ambulancia ambulancia) {
        return ambulanciaService.save(ambulancia);
    }

    /**
     * Atualiza os dados de uma ambulância existente.
     *
     * @param id Identificador da ambulância a ser atualizada
     * @param ambulancia Dados atualizados
     * @return ResponseEntity com a ambulância atualizada ou 404 se não existir
     * [RF02] Atualização de dados cadastrais.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ambulancia> update(@PathVariable Integer id, @RequestBody Ambulancia ambulancia) {
        Ambulancia existing = ambulanciaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        ambulancia.setId(id);
        return ResponseEntity.ok(ambulanciaService.save(ambulancia));
    }

    /**
     * Remove uma ambulância do sistema, respeitando as regras de integridade.
     *
     * @param id Identificador da ambulância a ser removida
     * @return ResponseEntity 204 No Content
     * [RF02] Exclusão de recurso (respeitando RD03).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ambulanciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
