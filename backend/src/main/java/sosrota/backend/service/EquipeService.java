package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Equipe;
import sosrota.backend.repository.EquipeRepository;

import java.util.List;

@Service
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final sosrota.backend.repository.AmbulanciaRepository ambulanciaRepository;

    public EquipeService(EquipeRepository equipeRepository, sosrota.backend.repository.AmbulanciaRepository ambulanciaRepository) {
        this.equipeRepository = equipeRepository;
        this.ambulanciaRepository = ambulanciaRepository;
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

        Equipe savedEquipe = equipeRepository.save(equipe);

        // Update Ambulance Status to DISPONIVEL if it was SEM_EQUIPE
        if (savedEquipe.getAmbulancia() != null) {
            sosrota.backend.entity.Ambulancia amb = savedEquipe.getAmbulancia();
            if ("SEM_EQUIPE".equals(amb.getStatus())) {
                amb.setStatus("DISPONIVEL");
                ambulanciaRepository.save(amb);
            }
        }
        
        return savedEquipe;
    }

    public void delete(Integer id) {
        Equipe equipe = findById(id);
        if (equipe != null && equipe.getAmbulancia() != null) {
            sosrota.backend.entity.Ambulancia amb = equipe.getAmbulancia();
            equipeRepository.deleteById(id);
            
            // Check if ambulance has other teams
            List<Equipe> remainingTeams = equipeRepository.findByAmbulancia(amb);
            if (remainingTeams.isEmpty()) {
                if ("DISPONIVEL".equals(amb.getStatus())) {
                    amb.setStatus("SEM_EQUIPE");
                    ambulanciaRepository.save(amb);
                }
            }
        } else {
            equipeRepository.deleteById(id);
        }
    }
}
