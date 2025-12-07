package sosrota.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sosrota.backend.entity.Ocorrencia;
import sosrota.backend.service.OcorrenciaService;

import java.util.List;

/**
 * Controlador responsável pelo gerenciamento das ocorrências.
 * Implementa operações de abertura, despacho, cancelamento e conclusão.
 * [RF01] Cadastro de Ocorrências.
 * [RF06] Despacho e Registro.
 * [Interface de Comunicação] Exposto via API REST.
 */
@RestController
@RequestMapping("/api/ocorrencias")
public class OcorrenciaController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(OcorrenciaController.class);

    private final OcorrenciaService ocorrenciaService;

    public OcorrenciaController(OcorrenciaService ocorrenciaService) {
        this.ocorrenciaService = ocorrenciaService;
    }

    /**
     * Lista todas as ocorrências registradas.
     *
     * @return Lista de ocorrências
     * [RF07] Consulta de ocorrências.
     */
    @GetMapping
    public List<Ocorrencia> findAll() {
        return ocorrenciaService.findAll();
    }

    /**
     * Busca uma ocorrência por ID.
     *
     * @param id Identificador da ocorrência
     * @return Ocorrência encontrada ou 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> findById(@PathVariable Integer id) {
        Ocorrencia ocorrencia = ocorrenciaService.findById(id);
        return ocorrencia != null ? ResponseEntity.ok(ocorrencia) : ResponseEntity.notFound().build();
    }

    /**
     * Cria uma nova ocorrência e inicia o processo de despacho automático.
     *
     * @param ocorrencia Dados da nova ocorrência
     * @return Ocorrência criada com status inicial
     * [RF01] Cadastro de Ocorrências.
     * [RF05] Sugestão automática (via Service).
     */
    @PostMapping
    public Ocorrencia create(@RequestBody Ocorrencia ocorrencia) {
        logger.info("Recebida requisição para criar Ocorrencia: {}", ocorrencia);
        return ocorrenciaService.createOcorrencia(ocorrencia);
    }

    /**
     * Atualiza dados de uma ocorrência.
     *
     * @param id Identificador da ocorrência
     * @param ocorrencia Dados atualizados
     * @return Ocorrência atualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ocorrencia> update(@PathVariable Integer id, @RequestBody Ocorrencia ocorrencia) {
        Ocorrencia existing = ocorrenciaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        ocorrencia.setId(id);
        return ResponseEntity.ok(ocorrenciaService.createOcorrencia(ocorrencia));
    }

    /**
     * Exclui uma ocorrência (apenas se não tiver atendimentos vinculados).
     *
     * @param id Identificador da ocorrência
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Ocorrencia existing = ocorrenciaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        ocorrenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Confirma a saída da ambulância para o local da ocorrência.
     *
     * @param id Identificador da ocorrência
     * @return 200 OK
     * [RF06] Atualização de status para EM_ATENDIMENTO.
     */
    @PostMapping("/{id}/confirmar-saida")
    public ResponseEntity<Void> confirmDeparture(@PathVariable Integer id) {
        logger.info("Recebida requisição para confirmar saída da Ocorrencia {}", id);
        ocorrenciaService.confirmDeparture(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Conclui o atendimento de uma ocorrência.
     *
     * @param id Identificador da ocorrência
     * @return 200 OK
     * [RF06] Finalização e liberação de recursos.
     */
    @PostMapping("/{id}/concluir")
    public ResponseEntity<Void> finishOccurrence(@PathVariable Integer id) {
        logger.info("Recebida requisição para concluir Ocorrencia {}", id);
        ocorrenciaService.finishOccurrence(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Obtém detalhes completos da ocorrência, incluindo histórico e equipe.
     *
     * @param id Identificador da ocorrência
     * @return DTO com detalhes completos
     * [RF07] Consulta detalhada para relatórios/visualização.
     */
    @GetMapping("/{id}/detalhes")
    public ResponseEntity<sosrota.backend.dto.OcorrenciaDetalhesDTO> getDetalhes(@PathVariable Integer id) {
        sosrota.backend.dto.OcorrenciaDetalhesDTO detalhes = ocorrenciaService.getOcorrenciaDetalhes(id);
        if (detalhes != null) {
            return ResponseEntity.ok(detalhes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cancela uma ocorrência.
     *
     * @param id Identificador da ocorrência
     * @param payload Mapa contendo a justificativa (opcional)
     * @return 200 OK
     * [Regra de Negócio] Cancelamento permitido apenas em estados específicos.
     */
    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelOccurrence(@PathVariable Integer id, @RequestBody(required = false) java.util.Map<String, String> payload) {
        String justificativa = (payload != null) ? payload.get("justificativa") : "Sem justificativa";
        logger.info("Recebida requisição para cancelar Ocorrencia {} com justificativa: {}", id, justificativa);
        ocorrenciaService.cancelOccurrence(id, justificativa);
        return ResponseEntity.ok().build();
    }

    /**
     * Recupera o histórico de mudanças de status de uma ocorrência.
     *
     * @param id Identificador da ocorrência
     * @return Lista de histórico
     * [RF07] Rastreabilidade de ações.
     */
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<sosrota.backend.entity.OcorrenciaHistorico>> getHistorico(@PathVariable Integer id) {
        List<sosrota.backend.entity.OcorrenciaHistorico> historico = ocorrenciaService.findHistoricoByOcorrenciaId(id);
        return ResponseEntity.ok(historico);
    }
}
