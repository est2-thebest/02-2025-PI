package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.EquipeRepository;

import java.util.List;

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

    public List<Ambulancia> findAll() {
        return ambulanciaRepository.findAll();
    }

    public Ambulancia findById(Integer id) {
        return ambulanciaRepository.findById(id).orElse(null);
    }

    public Ambulancia save(Ambulancia ambulancia) {
        logger.info("Tentando salvar Ambulancia: Placa={}, Tipo={}, Status={}, Base={}", ambulancia.getPlaca(), ambulancia.getTipo(), ambulancia.getStatus(), (ambulancia.getBairro() != null ? ambulancia.getBairro().getId() : "null"));
        
        if (ambulancia.getId() != null) {
            Ambulancia existing = findById(ambulancia.getId());
            if (existing != null) {
                // Allow update if:
                // 1. Existing status is DISPONIVEL
                // 2. New status is INATIVA (user wants to inactivate)
                // 3. Existing status is MANUTENCAO and New status is DISPONIVEL (user fixing it)
                // 4. Existing status is INATIVA and New status is DISPONIVEL (reactivating)
                
                boolean isAvailable = "DISPONIVEL".equals(existing.getStatus());
                boolean isInactivating = "INATIVA".equals(ambulancia.getStatus());
                boolean isFixing = "MANUTENCAO".equals(existing.getStatus()) && "DISPONIVEL".equals(ambulancia.getStatus());
                boolean isReactivating = "INATIVA".equals(existing.getStatus()) && "DISPONIVEL".equals(ambulancia.getStatus());

                if (!isAvailable && !isInactivating && !isFixing && !isReactivating) {
                     throw new IllegalStateException("Não é possível editar uma ambulância que está " + existing.getStatus() + ".");
                }
            }
        }

        if ("INATIVA".equals(ambulancia.getStatus())) {
            // Se já tem ID (edição), verifica se está em equipe
            if (ambulancia.getId() != null && equipeRepository.findByAmbulancia(ambulancia).isPresent()) {
                throw new IllegalStateException("Não é possível inativar uma ambulância vinculada a uma equipe.");
            }
        }
        return ambulanciaRepository.save(ambulancia);
    }

    public void delete(Integer id) {
        Ambulancia ambulancia = findById(id);
        if (ambulancia == null) {
            throw new IllegalArgumentException("Ambulância não encontrada.");
        }

        if (atendimentoRepository.existsByAmbulancia(ambulancia)) {
            throw new IllegalStateException("Não é possível excluir ambulância com histórico de atendimentos. Inative-a.");
        }

        if (equipeRepository.findByAmbulancia(ambulancia).isPresent()) {
            throw new IllegalStateException("Não é possível excluir ambulância vinculada a uma equipe.");
        }

        ambulanciaRepository.deleteById(id);
    }
}
