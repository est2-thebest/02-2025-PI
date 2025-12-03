package sosrota.backend.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.repository.AtendimentoRepository;

@RestController
@RequestMapping("/api/atendimentos")
@RequiredArgsConstructor
public class AtendimentoController {

    private final AtendimentoRepository atendimentoRepository;

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(atendimentoRepository.findAll());
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<Atendimento> finalizar(@PathVariable Long id) {
        Atendimento at = atendimentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atendimento não encontrado"));

        if (at.getDataHoraChegada() != null)
            throw new RuntimeException("Atendimento já finalizado.");

        at.setDataHoraChegada(LocalDateTime.now());
        return ResponseEntity.ok(atendimentoRepository.save(at));
    }
}
