package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Bairro;
import sosrota.backend.repository.BairroRepository;

import java.util.List;

/**
 * Serviço de gerenciamento de bairros (nós do grafo).
 * [RF04] Cadastro de Mapa e Rotas.
 */
@Service
public class BairroService {

    private final BairroRepository bairroRepository;

    public BairroService(BairroRepository bairroRepository) {
        this.bairroRepository = bairroRepository;
    }

    /**
     * Lista todos os bairros cadastrados.
     *
     * @return Lista de bairros
     * [RF04] Consulta de locais.
     */
    public List<Bairro> findAll() {
        return bairroRepository.findAll();
    }

    public Bairro findById(Integer id) {
        return bairroRepository.findById(id).orElse(null);
    }

    // Como os bairros são carregados a partir de arquivos CSV, os métodos abaixo não são implementados.
    
    /* 
    public Bairro save(Bairro bairro) {
        return bairroRepository.save(bairro);
    }

    public void delete(Integer id) {
        bairroRepository.deleteById(id);
    }
    */
}
