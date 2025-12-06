package sosrota.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Bairro;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.OcorrenciaRepository;
import sosrota.backend.repository.EquipeRepository;
import sosrota.backend.entity.Equipe;
import sosrota.backend.entity.Profissional;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DispatchTest {

    @Mock
    private OcorrenciaRepository ocorrenciaRepository;

    @Mock
    private AmbulanciaRepository ambulanciaRepository;

    @Mock
    private AtendimentoRepository atendimentoRepository;

    @Mock
    private EquipeRepository equipeRepository;

    @Mock
    private DijsktraService dijsktraService;

    @InjectMocks
    private OcorrenciaService ocorrenciaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDispatchAmbulance() {
        // Setup Bairros
        Bairro bairroOcorrencia = new Bairro(1, "Bairro 1");
        Bairro bairroAmb1 = new Bairro(2, "Bairro 2");
        Bairro bairroAmb2 = new Bairro(3, "Bairro 3");

        // Setup Ocorrencia
        Ocorrencia ocorrencia = new Ocorrencia();
        ocorrencia.setId(1);
        ocorrencia.setBairro(bairroOcorrencia);
        ocorrencia.setStatus("ABERTA");
        ocorrencia.setGravidade("BAIXA");

        // Setup Ambulancias
        Ambulancia amb1 = new Ambulancia();
        amb1.setId(1);
        amb1.setBairro(bairroAmb1);
        amb1.setBairro(bairroAmb1);
        amb1.setStatus("DISPONIVEL");
        amb1.setTipo("USB");

        Ambulancia amb2 = new Ambulancia();
        amb2.setId(2);
        amb2.setBairro(bairroAmb2);
        amb2.setStatus("DISPONIVEL");
        amb2.setTipo("USB");

        when(ambulanciaRepository.findByStatus("DISPONIVEL")).thenReturn(Arrays.asList(amb1, amb2));
        when(ocorrenciaRepository.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArguments()[0]);

        // Mock Equipe
        Profissional motorista = new Profissional();
        motorista.setFuncao("MOTORISTA");
        motorista.setAtivo(true);
        
        Profissional enfermeiro = new Profissional();
        enfermeiro.setFuncao("ENFERMEIRO");
        enfermeiro.setAtivo(true);

        Equipe equipe = new Equipe();
        equipe.setProfissionais(Arrays.asList(motorista, enfermeiro));

        when(equipeRepository.findByAmbulancia(any(Ambulancia.class))).thenReturn(java.util.Optional.of(equipe));

        // Mock Dijkstra
        // Amb1 is 10km away
        when(dijsktraService.findShortestPath(2, 1)).thenReturn(
                new DijsktraService.PathResult(Collections.emptyList(), Collections.emptyList(), 10.0));
        // Amb2 is 5km away (Should be chosen)
        when(dijsktraService.findShortestPath(3, 1)).thenReturn(
                new DijsktraService.PathResult(Collections.emptyList(), Collections.emptyList(), 5.0));

        // Execute
        ocorrenciaService.createOcorrencia(ocorrencia);

        // Verify
        verify(atendimentoRepository, times(1)).save(any());
        verify(ambulanciaRepository, times(1)).save(amb2); // Amb2 should be saved (status update)
        verify(ocorrenciaRepository, atLeastOnce()).save(ocorrencia);

        // Check if status updated
        assert amb2.getStatus().equals("EM_ATENDIMENTO");
        assert ocorrencia.getStatus().equals("EM_ANDAMENTO");
    }
}
