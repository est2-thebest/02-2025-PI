package sosrota.backend.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sosrota.backend.entity.Ambulancia;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Gravidade;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.entity.StatusAmbulancia;
import sosrota.backend.entity.StatusOcorrencia;
import sosrota.backend.repository.AmbulanciaRepository;
import sosrota.backend.repository.AtendimentoRepository;
import sosrota.backend.repository.OcorrenciaRepository;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepo;
    private final AmbulanciaRepository ambulanciaRepo;
    private final AtendimentoRepository atendimentoRepo;
    private final GrafoService grafoService;

    private int calcSla(Gravidade g) {
        return switch (g) {
            case ALTA -> 8;
            case MEDIA -> 15;
            case BAIXA -> 30;
        };
    }

    @Transactional
    public Ocorrencia criarOcorrencia(Ocorrencia o) {
        o.setStatus(StatusOcorrencia.ABERTA);
        o.setDataHoraAbertura(LocalDateTime.now());
        o.setSlaMinutos(calcSla(o.getGravidade()));
        return ocorrenciaRepo.save(o);
    }

    @Transactional
    public Atendimento despachar(Long ocorrenciaId) {

        Ocorrencia o = ocorrenciaRepo.findById(ocorrenciaId)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));

        if (o.getStatus() != StatusOcorrencia.ABERTA)
            throw new RuntimeException("Ocorrência não está em estado válido para despacho.");

        List<Ambulancia> candidatos =
                ambulanciaRepo.findDisponiveisComEquipeAtiva(StatusAmbulancia.DISPONIVEL);

        if (candidatos.isEmpty())
            throw new RuntimeException("Nenhuma ambulância disponível.");

        record Candidato(Ambulancia amb, double dist, int tempo) {}

        var filtrados = candidatos.stream()
                .map(a -> {
                    double dist = grafoService.calcularDistanciaKm(
                            a.getBase().getId(),
                            o.getLocal().getId()
                    );
                    int tempo = (int) Math.ceil(dist);
                    return new Candidato(a, dist, tempo);
                })
                .filter(c -> c.tempo <= o.getSlaMinutos())
                .sorted(Comparator.comparingInt(Candidato::tempo))
                .toList();

        if (filtrados.isEmpty())
            throw new RuntimeException("Nenhuma ambulância atende o SLA.");

        Candidato escolhido = filtrados.get(0);

        Ambulancia ambLock = ambulanciaRepo.findByIdForUpdate(escolhido.amb().getId());

        if (ambLock.getStatus() != StatusAmbulancia.DISPONIVEL)
            throw new RuntimeException("Ambulância já foi usada por outro despacho.");

        Atendimento at = new Atendimento();
        at.setOcorrencia(o);
        at.setAmbulancia(ambLock);
        at.setDistanciaKm(escolhido.dist());
        at.setDataHoraDespacho(LocalDateTime.now());
        atendimentoRepo.save(at);

        ambLock.setStatus(StatusAmbulancia.EM_ATENDIMENTO);
        ambulanciaRepo.save(ambLock);

        o.setStatus(StatusOcorrencia.DESPACHADA);
        o.setDistanciaKmCalculada(escolhido.dist());
        ocorrenciaRepo.save(o);

        return at;
    }
}
