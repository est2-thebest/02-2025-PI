package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Profissional;
import sosrota.backend.repository.ProfissionalRepository;
import sosrota.backend.repository.EquipeRepository;

import java.util.List;

@Service
public class ProfissionalService {

    private final ProfissionalRepository profissionalRepository;
    private final EquipeRepository equipeRepository;

    public ProfissionalService(ProfissionalRepository profissionalRepository, EquipeRepository equipeRepository) {
        this.profissionalRepository = profissionalRepository;
        this.equipeRepository = equipeRepository;
    }

    public List<Profissional> findAll() {
        return profissionalRepository.findAll();
    }

    public Profissional findById(Integer id) {
        return profissionalRepository.findById(id).orElse(null);
    }

    public Profissional save(Profissional profissional) {
        if (Boolean.FALSE.equals(profissional.getAtivo())) {
             if (profissional.getId() != null && equipeRepository.existsByProfissionaisContaining(profissional)) {
                 throw new IllegalStateException("Não é possível inativar um profissional vinculado a uma equipe.");
             }
        }
        return profissionalRepository.save(profissional);
    }

    public Profissional update(Integer id, Profissional profissional) {
        if (!profissionalRepository.existsById(id)) {
            return null;
        }
        profissional.setId(id);
        
        if (Boolean.FALSE.equals(profissional.getAtivo())) {
             if (equipeRepository.existsByProfissionaisContaining(profissional)) {
                 throw new IllegalStateException("Não é possível inativar um profissional vinculado a uma equipe.");
             }
        }
        
        return profissionalRepository.save(profissional);
    }

    public void delete(Integer id) {
        Profissional profissional = findById(id);
        if (profissional == null) {
            throw new IllegalArgumentException("Profissional não encontrado.");
        }

        if (equipeRepository.existsByProfissionaisContaining(profissional)) {
            throw new IllegalStateException("Não é possível excluir profissional vinculado a uma equipe.");
        }

        profissionalRepository.deleteById(id);
    }
}
