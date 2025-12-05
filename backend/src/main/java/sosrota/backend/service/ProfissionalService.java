package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Profissional;
import sosrota.backend.repository.ProfissionalRepository;

import java.util.List;

@Service
public class ProfissionalService {

    private final ProfissionalRepository profissionalRepository;

    public ProfissionalService(ProfissionalRepository profissionalRepository) {
        this.profissionalRepository = profissionalRepository;
    }

    public List<Profissional> findAll() {
        return profissionalRepository.findAll();
    }

    public Profissional findById(Integer id) {
        return profissionalRepository.findById(id).orElse(null);
    }

    public Profissional save(Profissional profissional) {
        return profissionalRepository.save(profissional);
    }

    public void delete(Integer id) {
        profissionalRepository.deleteById(id);
    }
}
