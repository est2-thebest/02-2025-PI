package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Equipe;
import sosrota.backend.repository.EquipeRepository;

import java.util.List;

@Service
public class EquipeService {

    private final EquipeRepository equipeRepository;

    public EquipeService(EquipeRepository equipeRepository) {
        this.equipeRepository = equipeRepository;
    }

    public List<Equipe> findAll() {
        return equipeRepository.findAll();
    }

    public Equipe findById(Integer id) {
        return equipeRepository.findById(id).orElse(null);
    }

    public Equipe save(Equipe equipe) {
        // Validação de Ambulância
        if (equipe.getAmbulancia() != null) {
            List<Equipe> conflitosAmbulancia = equipeRepository.findByAmbulanciaAndTurno(equipe.getAmbulancia(), equipe.getTurno());
            for (Equipe conflito : conflitosAmbulancia) {
                if (!conflito.getId().equals(equipe.getId())) {
                    throw new IllegalArgumentException("A ambulância já está alocada em outra equipe neste turno.");
                }
            }
        }

        // Validação de Profissionais
        if (equipe.getProfissionais() != null) {
            for (var profissional : equipe.getProfissionais()) {
                List<Equipe> conflitosProfissional = equipeRepository.findByProfissionalAndTurno(profissional, equipe.getTurno());
                for (Equipe conflito : conflitosProfissional) {
                    if (!conflito.getId().equals(equipe.getId())) {
                        throw new IllegalArgumentException("O profissional " + profissional.getNome() + " já está alocado em outra equipe neste turno.");
                    }
                }
            }
        }

        return equipeRepository.save(equipe);
    }

    public void delete(Integer id) {
        equipeRepository.deleteById(id);
    }
}
