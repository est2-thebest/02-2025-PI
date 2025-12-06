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
            if (existing != null && !"DISPONIVEL".equals(existing.getStatus())) {
                 // Allow only if status is changing back to DISPONIVEL (manual release fallback) ??
                 // User agreed to strict blocking because we have "Concluir" now.
                 // But wait, what if "Concluir" fails?
                 // Let's stick to the plan: "Strictly restrict".
                 // However, to be safe, I will allow if the NEW status is DISPONIVEL.
                 // Actually, the user said "permitir editar apenas se estiver disponível".
                 // This implies: if existing status != DISPONIVEL, BLOCK.
                 // Unless the system is doing it? The system calls save() too.
                 // OcorrenciaService calls save() to update status to EM_ATENDIMENTO/DISPONIVEL.
                 // So I must allow status changes if they are valid transitions.
                 // But OcorrenciaService uses the same repository/service?
                 // OcorrenciaService uses AmbulanciaRepository directly. So it bypasses this service check!
                 // So I can safely block here in Service (which is used by Controller/User).
                 
                 throw new IllegalStateException("Não é possível editar uma ambulância que não está disponível.");
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
