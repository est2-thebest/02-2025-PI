import React, { useEffect, useState } from 'react';
import ocorrenciaService, { OcorrenciaDetalhes } from '../../services/ocorrencia';
import { X, CheckCircle, XCircle, Clock, MapPin, Ambulance, Users } from 'lucide-react';

import './OcorrenciaDetailsModal.css';

interface OcorrenciaDetailsModalProps {
  ocorrenciaId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const OcorrenciaDetailsModal: React.FC<OcorrenciaDetailsModalProps> = ({ ocorrenciaId, onClose, onUpdate }) => {
  const [detalhes, setDetalhes] = useState<OcorrenciaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [justificativa, setJustificativa] = useState('');
  const [mostrarInputJustificativa, setMostrarInputJustificativa] = useState(false);

  useEffect(() => {
    loadData(); // Initial load (full loading state)
    const interval = setInterval(() => {
      loadData(true); // Silent polling
    }, 5000);

    return () => clearInterval(interval);
  }, [ocorrenciaId]);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await ocorrenciaService.buscarDetalhes(ocorrenciaId);
      setDetalhes(data);

      // Only reset these on initial load, not during polling
      if (!silent) {
        setMostrarInputJustificativa(false);
        setJustificativa('');
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleConcluirClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmConcluir = async () => {
    try {
      await ocorrenciaService.concluirAtendimento(ocorrenciaId);
      setShowConfirmDialog(false);
      onUpdate();
      loadData();
    } catch (error) {
      alert('Erro ao concluir atendimento.');
    }
  };

  const handleCancelar = async () => {
    if (!justificativa.trim()) {
      alert('A justificativa é obrigatória.');
      return;
    }
    try {
      await ocorrenciaService.cancelar(ocorrenciaId, justificativa);
      onUpdate();
      loadData();
      setMostrarInputJustificativa(false);
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Erro ao cancelar ocorrência.');
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content details-modal">
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="p-4 text-center">Carregando detalhes...</div>
        </div>
      </div>
    );
  }

  if (!detalhes) {
    return (
      <div className="modal-overlay">
        <div className="modal-content details-modal">
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="p-4 text-center">Ocorrência não encontrada.</div>
        </div>
      </div>
    );
  }

  const { ocorrencia, atendimento, equipe, historico } = detalhes;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content details-modal">
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="modal-header">
            <h2>Ocorrência #{ocorrencia.id}</h2>
            <div className="status-badges">
              <span className={`badge ${ocorrencia.gravidade}`}>
                {ocorrencia.gravidade}
              </span>
              <span className={`badge ${ocorrencia.status}`}>
                {ocorrencia.status}
              </span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-section">
              <h3><MapPin size={18} /> Localização</h3>
              <div className="info-row">
                <span className="label">Bairro:</span>
                <span className="value">{ocorrencia.bairro?.nome}</span>
              </div>
              <div className="info-row">
                <span className="label">Tipo:</span>
                <span className="value">{ocorrencia.tipo}</span>
              </div>
              <div className="info-row">
                <span className="label">Observação:</span>
                <span className="value">{ocorrencia.observacao || '-'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3><Clock size={18} /> Tempos</h3>
              <div className="info-row">
                <span className="label">Abertura:</span>
                <span className="value">{new Date(ocorrencia.dataHoraAbertura).toLocaleTimeString()}</span>
              </div>

              {ocorrencia.dataHoraFechamento && (
                <>
                  <div className="info-row">
                    <span className="label">Fechamento:</span>
                    <span className="value">{new Date(ocorrencia.dataHoraFechamento).toLocaleTimeString()}</span>
                  </div>
                </>
              )}

              {atendimento?.dataHoraChegada && atendimento.dataHoraDespacho && (
                <>
                  <div className="info-row">
                    <span className="label">Deslocamento:</span>
                    <span className="value">
                      {atendimento.tempoEstimado !== undefined ? atendimento.tempoEstimado.toFixed(1) : '-'} min
                    </span>
                  </div>
                </>
              )}

              {ocorrencia.dataHoraFechamento && (
                <div className="info-row">
                  <span className="label">Status SLA:</span>
                  <span className="value">
                    {(() => {
                      if (ocorrencia.status === 'CANCELADA') {
                        return (
                          <span className="badge" style={{ backgroundColor: 'var(--text-secondary)', color: 'white', marginLeft: '0.5rem' }}>
                            NÃO APLICÁVEL
                          </span>
                        );
                      }

                      let responseSimMin = 0;

                      if (atendimento?.dataHoraChegada && atendimento.dataHoraDespacho && atendimento.distanciaKm) {
                        // 1. Calculate Speed Factor (Simulated Min / Real Sec)
                        const travelRealSec = (new Date(atendimento.dataHoraChegada).getTime() - new Date(atendimento.dataHoraDespacho).getTime()) / 1000;
                        const speedFactor = atendimento.distanciaKm / (travelRealSec / 60);

                        // 2. Calculate Real Response Time (Arrival - Opening)
                        const responseRealSec = (new Date(atendimento.dataHoraChegada).getTime() - new Date(ocorrencia.dataHoraAbertura).getTime()) / 1000;

                        // 3. Convert to Simulated Response Time
                        responseSimMin = (responseRealSec / 60) * speedFactor;
                      } else {
                        // Fallback
                        const totalRealSec = (new Date(ocorrencia.dataHoraFechamento).getTime() - new Date(ocorrencia.dataHoraAbertura).getTime()) / 1000;
                        responseSimMin = totalRealSec / 60 * 60;
                      }

                      let slaLimit = 30;
                      if (ocorrencia.gravidade === 'ALTA') slaLimit = 8;
                      else if (ocorrencia.gravidade === 'MEDIA') slaLimit = 15;

                      const isSlaMet = responseSimMin <= slaLimit;

                      return (
                        <span className={`badge ${isSlaMet ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: '0.5rem' }}>
                          {isSlaMet ? 'DENTRO DO PRAZO' : 'FORA DO PRAZO'}
                          {/* ({responseSimMin.toFixed(1)} min) */}
                        </span>
                      );
                    })()}
                  </span>
                </div>
              )}
            </div>

            {atendimento?.rota && (
              <div className="detail-section" style={{ gridColumn: '1 / -1' }}>
                <h3><MapPin size={18} /> Rota Percorrida</h3>
                {/* [Estrutura de Dados II - Visualizacao da rota calculada pelo Dijkstra */}
                <div className="route-container" style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', fontSize: '0.9rem' }}>
                  {atendimento.rota}
                </div>
              </div>
            )}
          </div>

          {atendimento && (
            <div className="resource-section">
              <h3><Ambulance size={18} /> Recursos Alocados</h3>
              <div className="resource-card">
                <div className="resource-header">
                  <span className="resource-title">Ambulância {atendimento.ambulancia?.placa}</span>
                  <span className="resource-type">{atendimento.ambulancia?.tipo}</span>
                </div>
                <div className="resource-body">
                  <div className="resource-info">
                    <strong>Base:</strong> {atendimento.ambulancia?.bairro?.nome || 'N/A'}
                  </div>
                  <div className="resource-info">
                    <strong>Distância:</strong> {atendimento.distanciaKm !== undefined ? `${atendimento.distanciaKm.toFixed(2)} km` : 'N/A'}
                  </div>
                </div>
                {equipe && (
                  <div className="team-section">
                    <div className="team-header"><Users size={14} /> Equipe: {equipe.descricao}</div>
                    <div className="team-list">
                      {equipe.profissionais.map((p, index) => (
                        <span key={index} className="team-member" title={p.funcao}>
                          {p.nome.split(' ')[0]} <small>({p.funcao.substring(0, 3)})</small>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="history-section">
            <h3>Histórico de Status</h3>
            <div className="timeline">
              {historico.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">
                    {new Date(item.dataHora).toLocaleString()}
                  </div>
                  <div className="timeline-content">
                    <strong>{item.statusAnterior || 'INICIO'} ➔ {item.statusNovo}</strong>
                    {item.observacao && <p>{item.observacao}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            {ocorrencia.status === 'EM_ATENDIMENTO' && (
              <button className="btn-concluir" onClick={handleConcluirClick}>
                <CheckCircle size={18} /> Concluir Atendimento
              </button>
            )}

            {(ocorrencia.status === 'ABERTA' || ocorrencia.status === 'DESPACHADA') && (
              <div className="cancel-action">
                {!mostrarInputJustificativa ? (
                  <button className="btn-cancelar" onClick={() => setMostrarInputJustificativa(true)}>
                    <XCircle size={18} /> Cancelar Ocorrência
                  </button>
                ) : (
                  <div className="justificativa-box">
                    <input
                      type="text"
                      placeholder="Motivo do cancelamento (obrigatório)"
                      value={justificativa}
                      onChange={(e) => setJustificativa(e.target.value)}
                    />
                    <div className="justificativa-buttons">
                      <button className="btn btn-danger" onClick={handleCancelar}>Confirmar</button>
                      <button className="btn btn-secondary" onClick={() => setMostrarInputJustificativa(false)}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {
        showConfirmDialog && (
          <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content confirm-dialog" style={{ maxWidth: '400px', padding: '2rem' }}>
              <h3>Confirmar Conclusão</h3>
              <p>Tem certeza que deseja concluir este atendimento?</p>
              <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                <button className="btn btn-success" onClick={handleConfirmConcluir}>Sim, Concluir</button>
                <button className="btn btn-secondary" onClick={() => setShowConfirmDialog(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default OcorrenciaDetailsModal;
