package sosrota.backend.dto;

import lombok.Data;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.entity.Atendimento;
import sosrota.backend.entity.Equipe;
import sosrota.backend.entity.OcorrenciaHistorico;

import java.util.List;

/**
 * DTO composto para detalhes completos de uma ocorrência.
 * Agrega dados da ocorrência, atendimento, equipe e histórico.
 */
@Data
public class OcorrenciaDetalhesDTO {
    private Ocorrencia ocorrencia;
    private Atendimento atendimento;
    private Equipe equipe;
    private List<OcorrenciaHistorico> historico;
}
