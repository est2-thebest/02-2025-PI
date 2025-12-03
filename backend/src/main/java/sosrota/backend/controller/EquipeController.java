package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sosrota.backend.entity.Equipe;
import sosrota.backend.service.EquipeService;

@RestController
@RequestMapping("/api/equipes")
@RequiredArgsConstructor
public class EquipeController {

    private final EquipeService equipeService;

    @PostMapping
    public ResponseEntity<Equipe> criarEquipe(@RequestBody Equipe equipe) {
        return ResponseEntity.ok(equipeService.criarEquipe(equipe));
    }

    @PutMapping("/{id}/ativar")
    public ResponseEntity<Equipe> ativarEquipe(@PathVariable Long id) {
        return ResponseEntity.ok(equipeService.ativarEquipe(id));
    }
}
