package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.repository.AmbulanciaRepository;

import java.util.List;

@Service
public class AmbulanciaService {

    private final AmbulanciaRepository ambulanciaRepository;

    public AmbulanciaService(AmbulanciaRepository ambulanciaRepository) {
        this.ambulanciaRepository = ambulanciaRepository;
    }

    public List<Ambulancia> findAll() {
        return ambulanciaRepository.findAll();
    }

    public Ambulancia findById(Integer id) {
        return ambulanciaRepository.findById(id).orElse(null);
    }

    public Ambulancia save(Ambulancia ambulancia) {
        return ambulanciaRepository.save(ambulancia);
    }

    public void delete(Integer id) {
        ambulanciaRepository.deleteById(id);
    }
}
