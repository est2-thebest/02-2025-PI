package sosrota.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Equipe;
import sosrota.backend.entity.Profissional;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.EquipeRepository;
import sosrota.backend.repository.ProfissionalRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DeleteRestrictionsTest {

    @Mock
    private AmbulanciaRepository ambulanciaRepository;
    @Mock
    private AtendimentoRepository atendimentoRepository;
    @Mock
    private EquipeRepository equipeRepository;
    @Mock
    private ProfissionalRepository profissionalRepository;

    @InjectMocks
    private AmbulanciaService ambulanciaService;
    @InjectMocks
    private ProfissionalService profissionalService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDeleteAmbulanciaWithAtendimento() {
        Ambulancia ambulancia = new Ambulancia();
        ambulancia.setId(1);

        when(ambulanciaRepository.findById(1)).thenReturn(Optional.of(ambulancia));
        when(atendimentoRepository.existsByAmbulancia(ambulancia)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> ambulanciaService.delete(1));
        verify(ambulanciaRepository, never()).deleteById(1);
    }

    @Test
    void testDeleteAmbulanciaWithEquipe() {
        Ambulancia ambulancia = new Ambulancia();
        ambulancia.setId(1);

        when(ambulanciaRepository.findById(1)).thenReturn(Optional.of(ambulancia));
        when(atendimentoRepository.existsByAmbulancia(ambulancia)).thenReturn(false);
        when(equipeRepository.findByAmbulancia(ambulancia)).thenReturn(java.util.List.of(new Equipe()));

        assertThrows(IllegalStateException.class, () -> ambulanciaService.delete(1));
        verify(ambulanciaRepository, never()).deleteById(1);
    }

    @Test
    void testDeleteProfissionalWithEquipe() {
        Profissional profissional = new Profissional();
        profissional.setId(1);

        when(profissionalRepository.findById(1)).thenReturn(Optional.of(profissional));
        when(equipeRepository.existsByProfissionaisContaining(profissional)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> profissionalService.delete(1));
        verify(profissionalRepository, never()).deleteById(1);
    }

    @Test
    void testInactivateAmbulanciaWithEquipe() {
        Ambulancia ambulancia = new Ambulancia();
        ambulancia.setId(1);
        ambulancia.setStatus("INATIVA");

        when(equipeRepository.findByAmbulancia(ambulancia)).thenReturn(java.util.List.of(new Equipe()));

        assertThrows(IllegalStateException.class, () -> ambulanciaService.save(ambulancia));
        verify(ambulanciaRepository, never()).save(ambulancia);
    }

    @Test
    void testInactivateProfissionalWithEquipe() {
        Profissional profissional = new Profissional();
        profissional.setId(1);
        profissional.setAtivo(false);

        when(equipeRepository.existsByProfissionaisContaining(profissional)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> profissionalService.save(profissional));
        verify(profissionalRepository, never()).save(profissional);
    }
}
