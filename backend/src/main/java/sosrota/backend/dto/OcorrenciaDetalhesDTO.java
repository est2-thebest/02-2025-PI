package sosrota.backend.dto;

import lombok.Data;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Equipe;
import sosrota.backend.entity.OcorrenciaHistorico;

import java.util.List;

@Data
public class OcorrenciaDetalhesDTO {
    private Ocorrencia ocorrencia;
    private Atendimento atendimento;
    private Equipe equipe;
    private List<OcorrenciaHistorico> historico;
}
