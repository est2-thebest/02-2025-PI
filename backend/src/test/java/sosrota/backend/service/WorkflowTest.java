package sosrota.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.EquipeRepository;
import sosrota.backend.repository.OcorrenciaRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WorkflowTest {

    @Mock
    private OcorrenciaRepository ocorrenciaRepository;
    @Mock
    private AmbulanciaRepository ambulanciaRepository;
    @Mock
    private AtendimentoRepository atendimentoRepository;
    @Mock
    private EquipeRepository equipeRepository;

    @InjectMocks
    private OcorrenciaService ocorrenciaService;
    
    @InjectMocks
    private AmbulanciaService ambulanciaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testConfirmDeparture() {
        Ocorrencia ocorrencia = new Ocorrencia();
        ocorrencia.setId(1);
        ocorrencia.setStatus("DESPACHADA");

        when(ocorrenciaRepository.findById(1)).thenReturn(Optional.of(ocorrencia));

        ocorrenciaService.confirmDeparture(1);

        assertEquals("EM_ATENDIMENTO", ocorrencia.getStatus());
        verify(ocorrenciaRepository).save(ocorrencia);
    }

    @Test
    void testFinishOccurrenceFreesAmbulance() {
        Ocorrencia ocorrencia = new Ocorrencia();
        ocorrencia.setId(1);
        ocorrencia.setStatus("EM_ATENDIMENTO");

        Ambulancia ambulancia = new Ambulancia();
        ambulancia.setId(10);
        ambulancia.setStatus("EM_ATENDIMENTO");

        Atendimento atendimento = new Atendimento();
        atendimento.setOcorrencia(ocorrencia);
        atendimento.setAmbulancia(ambulancia);

        when(ocorrenciaRepository.findById(1)).thenReturn(Optional.of(ocorrencia));
        when(atendimentoRepository.findFirstByOcorrenciaOrderByIdDesc(ocorrencia)).thenReturn(atendimento);

        ocorrenciaService.finishOccurrence(1);

        assertEquals("CONCLUIDA", ocorrencia.getStatus());
        assertEquals("DISPONIVEL", ambulancia.getStatus());
        verify(ambulanciaRepository).save(ambulancia);
    }

    @Test
    void testEditAmbulanciaInUseThrowsException() {
        Ambulancia ambulancia = new Ambulancia();
        ambulancia.setId(10);
        ambulancia.setStatus("EM_ATENDIMENTO");

        when(ambulanciaRepository.findById(10)).thenReturn(Optional.of(ambulancia));

        Ambulancia updateRequest = new Ambulancia();
        updateRequest.setId(10);
        updateRequest.setStatus("DISPONIVEL"); // Trying to manually free it

        assertThrows(IllegalStateException.class, () -> ambulanciaService.save(updateRequest));
    }
}
