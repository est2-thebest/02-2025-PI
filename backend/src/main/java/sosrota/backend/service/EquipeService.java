package sosrota.backend.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sosrota.backend.entity.Equipe;
import sosrota.backend.entity.EquipeProfissional;
import sosrota.backend.entity.Funcao;
import sosrota.backend.entity.Profissional;
import sosrota.backend.entity.TipoAmbulancia;
import sosrota.backend.repository.EquipeProfissionalRepository;
import sosrota.backend.repository.EquipeRepository;

@Service
@RequiredArgsConstructor
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final EquipeProfissionalRepository epRepo;

    private boolean validaEquipeMinima(Equipe equipe) {
        Map<Funcao, Long> contagem =
                equipe.getMembros().stream()
                        .map(EquipeProfissional::getProfissional)
                        .filter(Objects::nonNull)
                        .collect(Collectors.groupingBy(Profissional::getFuncao, Collectors.counting()));

        TipoAmbulancia tipo = equipe.getAmbulancia().getTipo();

        if (tipo == TipoAmbulancia.UTI) {
            return contagem.getOrDefault(Funcao.MEDICO, 0L) >= 1 &&
                   contagem.getOrDefault(Funcao.ENFERMEIRO, 0L) >= 1 &&
                   contagem.getOrDefault(Funcao.CONDUTOR, 0L) >= 1;
        } else {
            return contagem.getOrDefault(Funcao.ENFERMEIRO, 0L) >= 1 &&
                   contagem.getOrDefault(Funcao.CONDUTOR, 0L) >= 1;
        }
    }

    @Transactional
    public Equipe criarEquipe(Equipe equipe) {

        for (EquipeProfissional ep : equipe.getMembros()) {
            Long profId = ep.getProfissional().getId();
            LocalDateTime inicio = ep.getInicioAlocacao();
            LocalDateTime fim = ep.getFimAlocacao();

            if (inicio == null || fim == null) {
                throw new RuntimeException("Alocação deve ter início e fim.");
            }

            var conflitos = epRepo.findConflitos(profId, inicio, fim);
            if (!conflitos.isEmpty()) {
                throw new RuntimeException("Profissional com conflito de horário: " + profId);
            }
        }

        if (!validaEquipeMinima(equipe)) {
            throw new RuntimeException("Equipe não atende composição mínima.");
        }

        return equipeRepository.save(equipe);
    }

    @Transactional
    public Equipe ativarEquipe(Long equipeId) {
        Equipe e = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        for (EquipeProfissional ep : e.getMembros()) {
            var conflitos = epRepo.findConflitos(ep.getProfissional().getId(),
                    ep.getInicioAlocacao(),
                    ep.getFimAlocacao());

            if (!conflitos.isEmpty()) {
                throw new RuntimeException("Conflito ao ativar equipe para profissional: " +
                        ep.getProfissional().getId());
            }
        }

        if (!validaEquipeMinima(e)) {
            throw new RuntimeException("Equipe não atende composição mínima.");
        }

        e.setAtiva(true);
        return equipeRepository.save(e);
    }
}
