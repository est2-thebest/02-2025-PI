package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Bairro;
import sosrota.backend.repository.BairroRepository;

import java.util.List;

@Service
public class BairroService {

    private final BairroRepository bairroRepository;

    public BairroService(BairroRepository bairroRepository) {
        this.bairroRepository = bairroRepository;
    }

    public List<Bairro> findAll() {
        return bairroRepository.findAll();
    }

    public Bairro findById(Integer id) {
        return bairroRepository.findById(id).orElse(null);
    }

    /* 
    public Bairro save(Bairro bairro) {
        return bairroRepository.save(bairro);
    }

    public void delete(Integer id) {
        bairroRepository.deleteById(id);
    }
    */
}
