package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Profissional;
import sosrota.backend.repository.ProfissionalRepository;
import sosrota.backend.repository.EquipeRepository;

import java.util.List;

/**
 * Serviço de gerenciamento de profissionais de saúde.
 * Responsável por validações de integridade e operações CRUD.
 * [RF03] Cadastro de Equipes e Profissionais.
 */
@Service
public class ProfissionalService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ProfissionalService.class);

    private final ProfissionalRepository profissionalRepository;
    private final EquipeRepository equipeRepository;

    public ProfissionalService(ProfissionalRepository profissionalRepository, EquipeRepository equipeRepository) {
        this.profissionalRepository = profissionalRepository;
        this.equipeRepository = equipeRepository;
    }

    /**
     * Lista todos os profissionais cadastrados.
     *
     * @return Lista de profissionais
     * [RF03] Listagem de recursos humanos.
     */
    public List<Profissional> findAll() {
        return profissionalRepository.findAll();
    }

    public Profissional findById(Integer id) {
        return profissionalRepository.findById(id).orElse(null);
    }

    /**
     * Salva um novo profissional ou atualiza existente.
     * Realiza validação de integridade referencial antes de inativar.
     *
     * @param profissional Dados do profissional
     * @return Profissional salvo
     * [RF03] Cadastro de profissional.
     * [Regra de Domínio - RD03] Integridade (Não inativar se vinculado a equipe).
     */
    public Profissional save(Profissional profissional) {
        logger.info("Tentando salvar Profissional: Nome={}, Funcao={}, Turno={}", profissional.getNome(), profissional.getFuncao(), profissional.getTurno());
        if (Boolean.FALSE.equals(profissional.getAtivo())) {
             if (profissional.getId() != null && equipeRepository.existsByProfissionaisContaining(profissional)) {
                 throw new IllegalStateException("Não é possível inativar um profissional vinculado a uma equipe.");
             }
        }
        return profissionalRepository.save(profissional);
    }

    /**
     * Atualiza dados de um profissional.
     *
     * @param id Identificador
     * @param profissional Dados atualizados
     * @return Profissional atualizado
     * [RF03] Atualização cadastral.
     */
    public Profissional update(Integer id, Profissional profissional) {
        if (!profissionalRepository.existsById(id)) {
            return null;
        }
        profissional.setId(id);
        
        // [Regra de Domínio - RD03] Validação de dependência antes de inativar
        if (Boolean.FALSE.equals(profissional.getAtivo())) {
             if (equipeRepository.existsByProfissionaisContaining(profissional)) {
                 throw new IllegalStateException("Não é possível inativar um profissional vinculado a uma equipe.");
             }
        }
        
        return profissionalRepository.save(profissional);
    }

    /**
     * Exclui um profissional do sistema.
     *
     * @param id Identificador
     * [RF03] Exclusão de registro.
     * [Regra de Domínio - RD03] Bloqueio de exclusão se vinculado a equipe.
     */
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
