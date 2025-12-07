package sosrota.backend.service;

import org.springframework.stereotype.Service;
import sosrota.backend.entity.Equipe;
import sosrota.backend.repository.EquipeRepository;

import java.util.List;

/**
 * Serviço de gerenciamento de equipes.
 * Responsável pela alocação de profissionais em ambulâncias e validação de conflitos de turno.
 * [RF03] Cadastro de Equipes.
 * [Regra de Negócio] Gestão de escalas e turnos.
 */
@Service
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final sosrota.backend.repository.AmbulanciaRepository ambulanciaRepository;

    public EquipeService(EquipeRepository equipeRepository, sosrota.backend.repository.AmbulanciaRepository ambulanciaRepository) {
        this.equipeRepository = equipeRepository;
        this.ambulanciaRepository = ambulanciaRepository;
    }

    /**
     * Lista todas as equipes cadastradas.
     *
     * @return Lista de equipes
     * [RF03] Listagem de equipes.
     */
    public List<Equipe> findAll() {
        return equipeRepository.findAll();
    }

    public Equipe findById(Integer id) {
        return equipeRepository.findById(id).orElse(null);
    }

    /**
     * Salva uma nova equipe, validando conflitos de alocação.
     * Garante que ambulância e profissionais não estejam em outra equipe no mesmo turno.
     *
     * @param equipe Dados da equipe
     * @return Equipe salva
     * [RF03] Criação de equipe.
     * [Regra de Negócio] Validação de disponibilidade de recursos por turno.
     */
    public Equipe save(Equipe equipe) {
        // Validação de Ambulância
        if (equipe.getAmbulancia() != null) {
            List<Equipe> conflitosAmbulancia = equipeRepository.findByAmbulanciaAndTurno(equipe.getAmbulancia(), equipe.getTurno());
            for (Equipe conflito : conflitosAmbulancia) {
                if (!conflito.getId().equals(equipe.getId())) {
                    throw new IllegalArgumentException("A ambulância já está alocada em outra equipe neste turno.");
                }
            }
        }

        // Validação de Profissionais
        if (equipe.getProfissionais() != null) {
            for (var profissional : equipe.getProfissionais()) {
                List<Equipe> conflitosProfissional = equipeRepository.findByProfissionalAndTurno(profissional, equipe.getTurno());
                for (Equipe conflito : conflitosProfissional) {
                    if (!conflito.getId().equals(equipe.getId())) {
                        throw new IllegalArgumentException("O profissional " + profissional.getNome() + " já está alocado em outra equipe neste turno.");
                    }
                }
            }
        }

        Equipe savedEquipe = equipeRepository.save(equipe);

        // [Regra de Negócio] Atualização automática de status da ambulância
        if (savedEquipe.getAmbulancia() != null) {
            sosrota.backend.entity.Ambulancia amb = savedEquipe.getAmbulancia();
            if ("SEM_EQUIPE".equals(amb.getStatus())) {
                amb.setStatus("DISPONIVEL");
                ambulanciaRepository.save(amb);
            }
        }
        
        return savedEquipe;
    }

    /**
     * Exclui uma equipe e atualiza o status da ambulância vinculada, se necessário.
     *
     * @param id Identificador da equipe
     * [RF03] Dissolução de equipe.
     */
    public void delete(Integer id) {
        Equipe equipe = findById(id);
        if (equipe != null && equipe.getAmbulancia() != null) {
            sosrota.backend.entity.Ambulancia amb = equipe.getAmbulancia();
            equipeRepository.deleteById(id);
            
            // [Regra de Negócio] Se ambulância ficar sem equipes, volta para SEM_EQUIPE
            List<Equipe> remainingTeams = equipeRepository.findByAmbulancia(amb);
            if (remainingTeams.isEmpty()) {
                if ("DISPONIVEL".equals(amb.getStatus())) {
                    amb.setStatus("SEM_EQUIPE");
                    ambulanciaRepository.save(amb);
                }
            }
        } else {
            equipeRepository.deleteById(id);
        }
    }
}
