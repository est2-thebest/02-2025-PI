package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.EquipeRepository;

import java.util.List;

/**
 * Serviço de negócio responsável pelas regras e persistência de ambulâncias.
 * [ENG4 - RF02] Lógica de negócio para gestão de frota.
 * [Banco de Dados II] Interação com repositórios JPA.
 */
@Service
public class AmbulanciaService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AmbulanciaService.class);

    private final AmbulanciaRepository ambulanciaRepository;
    private final AtendimentoRepository atendimentoRepository;
    private final EquipeRepository equipeRepository;

    public AmbulanciaService(AmbulanciaRepository ambulanciaRepository,
                             AtendimentoRepository atendimentoRepository,
                             EquipeRepository equipeRepository) {
        this.ambulanciaRepository = ambulanciaRepository;
        this.atendimentoRepository = atendimentoRepository;
        this.equipeRepository = equipeRepository;
    }

    /**
     * Lista todas as ambulâncias.
     *
     * @return Lista completa de ambulâncias
     * [ENG4 - RF02] Listagem geral.
     */
    public List<Ambulancia> findAll() {
        return ambulanciaRepository.findAll();
    }

    /**
     * Busca ambulância por ID.
     *
     * @param id Identificador da ambulância
     * @return Ambulância encontrada ou null
     */
    public Ambulancia findById(Integer id) {
        return ambulanciaRepository.findById(id).orElse(null);
    }

    /**
     * Salva ou atualiza uma ambulância, aplicando validações de estado.
     *
     * @param ambulancia Entidade a ser persistida
     * @return Ambulância salva
     * [ENG4 - RF02] Persistência com validação de regras de negócio.
     */
    public Ambulancia save(Ambulancia ambulancia) {
        logger.info("Tentando salvar Ambulancia: Placa={}, Tipo={}, Status={}, Base={}", ambulancia.getPlaca(), ambulancia.getTipo(), ambulancia.getStatus(), (ambulancia.getBairro() != null ? ambulancia.getBairro().getId() : "null"));
        
        if (ambulancia.getId() == null) {
            // [Regra de Negócio] Nova ambulância inicia sem equipe vinculada
            ambulancia.setStatus("SEM_EQUIPE");
        } else {
            Ambulancia existing = findById(ambulancia.getId());
            if (existing != null) {
                // [Regra de Domínio] Validação complexa de transição de estados
                // Permite atualização apenas se estiver DISPONIVEL ou em transições válidas (Manutenção -> Disponível, etc)
                
                boolean isAvailable = "DISPONIVEL".equals(existing.getStatus());
                boolean isInactivating = "INATIVA".equals(ambulancia.getStatus());
                boolean isFixing = "MANUTENCAO".equals(existing.getStatus()) && "DISPONIVEL".equals(ambulancia.getStatus());
                boolean isReactivating = "INATIVA".equals(existing.getStatus()) && "DISPONIVEL".equals(ambulancia.getStatus());
                boolean isTeamAssigned = "SEM_EQUIPE".equals(existing.getStatus()) && "DISPONIVEL".equals(ambulancia.getStatus());
                boolean isTeamRemoved = "DISPONIVEL".equals(existing.getStatus()) && "SEM_EQUIPE".equals(ambulancia.getStatus());
                boolean isReactivatingToSemEquipe = "INATIVA".equals(existing.getStatus()) && "SEM_EQUIPE".equals(ambulancia.getStatus());
                boolean isSameStatus = existing.getStatus().equals(ambulancia.getStatus());

                if (!isAvailable && !isInactivating && !isFixing && !isReactivating && !isTeamAssigned && !isTeamRemoved && !isReactivatingToSemEquipe && !isSameStatus) {
                     // Permite edição de outros campos se status for SEM_EQUIPE
                     if (!"SEM_EQUIPE".equals(existing.getStatus())) {
                        throw new IllegalStateException("Não é possível editar uma ambulância que está " + existing.getStatus() + ".");
                     }
                }
            }
        }

        if ("INATIVA".equals(ambulancia.getStatus())) {
            // [Regra de Domínio - RD03] Não inativar se estiver em equipe ativa
            if (ambulancia.getId() != null && !equipeRepository.findByAmbulancia(ambulancia).isEmpty()) {
                throw new IllegalStateException("Não é possível inativar uma ambulância vinculada a uma equipe.");
            }
        }
        return ambulanciaRepository.save(ambulancia);
    }

    /**
     * Exclui uma ambulância do sistema.
     *
     * @param id Identificador da ambulância
     * [ENG4 - RF02] Remoção física de registro.
     * [Regra de Domínio - RD03] Exclusões limitadas (integridade referencial).
     */
    public void delete(Integer id) {
        Ambulancia ambulancia = findById(id);
        if (ambulancia == null) {
            throw new IllegalArgumentException("Ambulância não encontrada.");
        }

        // [Regra de Domínio - RD03] Impede exclusão se houver histórico de atendimentos
        if (atendimentoRepository.existsByAmbulancia(ambulancia)) {
            throw new IllegalStateException("Não é possível excluir ambulância com histórico de atendimentos. Inative-a.");
        }

        // [Regra de Domínio] Impede exclusão se estiver vinculada a equipe
        if (equipeRepository.findByAmbulancia(ambulancia).size() > 0) {
            throw new IllegalStateException("Não é possível excluir ambulância vinculada a uma equipe.");
        }

        ambulanciaRepository.deleteById(id);
    }
}
