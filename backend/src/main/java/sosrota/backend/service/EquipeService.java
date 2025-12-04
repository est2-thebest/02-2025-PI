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
        return equipeRepository.save(equipe);
    }

    public void delete(Integer id) {
        equipeRepository.deleteById(id);
    }
}
