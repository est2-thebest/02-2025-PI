import React, { useState, useEffect } from 'react';
import ocorrenciaService, { Ocorrencia } from '../services/ocorrencia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import OcorrenciaForm from '../components/ocorrencias/OcorrenciaForm';
import OcorrenciaDetailsModal from '../components/ocorrencias/OcorrenciaDetailsModal';

import { Eye, XCircle } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import InputDialog from '../components/common/InputDialog';
import './Ocorrencias.css';

interface Filtros {
  status: string;
  gravidade: string;
  busca: string;
}

const Ocorrencias: React.FC = () => {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState<boolean>(false);
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState<number | null>(null);
  const [ocorrenciaParaExcluir, setOcorrenciaParaExcluir] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    status: '',
    gravidade: '',
    busca: '',
  });

  useEffect(() => {
    carregarOcorrencias();

    // Poll every 5 seconds to update status from simulation
    const interval = setInterval(() => {
      carregarOcorrencias(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const carregarOcorrencias = async (silent = false): Promise<void> => {
    try {
      if (!silent) setCarregando(true);
      const dados = await ocorrenciaService.listarTodas();
      setOcorrencias(dados);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    } finally {
      if (!silent) setCarregando(false);
    }
  };

  const handleNovo = (): void => {
    setMostrarForm(true);
  };

  const handleSalvar = async (): Promise<void> => {
    setMostrarForm(false);
    await carregarOcorrencias();
  };

  const handleCancelar = (): void => {
    setMostrarForm(false);
  };

  const handleVerDetalhes = (id: number) => {
    setOcorrenciaSelecionada(id);
    setMostrarDetalhes(true);
  };



  const handleExcluir = async () => {
    if (ocorrenciaParaExcluir) {
      try {
        await ocorrenciaService.excluir(ocorrenciaParaExcluir);
        setOcorrenciaParaExcluir(null);
        await carregarOcorrencias();
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error);
        alert('Erro ao excluir ocorrência. Verifique se ela já não possui atendimentos.');
      }
    }
  }

  const [ocorrenciaParaCancelar, setOcorrenciaParaCancelar] = useState<number | null>(null);

  // ... (existing useEffect and other handlers)

  const handleCancelarList = (id: number) => {
    setOcorrenciaParaCancelar(id);
  };

  const confirmarCancelamento = async (justificativa: string) => {
    if (ocorrenciaParaCancelar) {
      try {
        await ocorrenciaService.cancelar(ocorrenciaParaCancelar, justificativa);
        await carregarOcorrencias();
      } catch (error) {
        console.error('Erro ao cancelar ocorrência:', error);
        alert('Erro ao cancelar ocorrência.');
      } finally {
        setOcorrenciaParaCancelar(null);
      }
    }
  };

  // ... (rest of component)

  const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) => {
    const matchStatus = !filtros.status || ocorrencia.status === filtros.status;
    const matchGravidade = !filtros.gravidade || ocorrencia.gravidade === filtros.gravidade;
    const matchBusca = !filtros.busca ||
      ocorrencia.bairro?.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      ocorrencia.tipo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      ocorrencia.observacao.toLowerCase().includes(filtros.busca.toLowerCase());
    return matchStatus && matchGravidade && matchBusca;
  }).sort((a, b) => (b.id || 0) - (a.id || 0));

  return (
    <div className="page-container">
      <Banner
        title="Central de Ocorrências"
        subtitle="Gerenciamento de chamados de emergência"
      />

      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <div></div>
        <button className="btn btn-primary" onClick={handleNovo}>
          + Nova Ocorrência
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="filtros-container">
            <div className="form-group">
              <label>Buscar</label>
              <input
                type="text"
                className="filtro-busca"
                placeholder="Buscar por bairro, tipo..."
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="filtro-select"
                value={filtros.status}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="ABERTA">Aberta</option>
                <option value="DESPACHADA">Despachada</option>
                <option value="EM_ATENDIMENTO">Em Atendimento</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Gravidade</label>
              <select
                className="filtro-select"
                value={filtros.gravidade}
                onChange={(e) => setFiltros({ ...filtros, gravidade: e.target.value })}
              >
                <option value="">Todas</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Média</option>
                <option value="BAIXA">Baixa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {carregando ? (
        <LoadingSpinner message="Carregando ocorrências..." />
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Bairro</th>
                    <th>Tipo</th>
                    <th>Gravidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ocorrenciasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Nenhuma ocorrência encontrada
                      </td>
                    </tr>
                  ) : (
                    ocorrenciasFiltradas.map((ocorrencia) => (
                      <tr key={ocorrencia.id}>
                        <td>{ocorrencia.id}</td>
                        <td>{ocorrencia.bairro?.nome || '-'}</td>
                        <td>{ocorrencia.tipo}</td>
                        <td>
                          <span className={`badge ${ocorrencia.gravidade}`}>
                            {ocorrencia.gravidade}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ocorrencia.status}`}>
                            {ocorrencia.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-icon"
                              onClick={() => ocorrencia.id && handleVerDetalhes(ocorrencia.id)}
                              title="Ver Detalhes"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                            >
                              <Eye size={18} />
                            </button>

                            {(ocorrencia.status === 'ABERTA' || ocorrencia.status === 'DESPACHADA') && (
                              <button
                                className="btn-icon"
                                onClick={() => ocorrencia.id && handleCancelarList(ocorrencia.id)}
                                title="Cancelar Ocorrência"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <OcorrenciaForm
        isOpen={mostrarForm}
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />

      {mostrarDetalhes && ocorrenciaSelecionada && (
        <OcorrenciaDetailsModal
          onClose={() => setMostrarDetalhes(false)}
          ocorrenciaId={ocorrenciaSelecionada}
          onUpdate={carregarOcorrencias}
        />
      )}

      <ConfirmDialog
        isOpen={!!ocorrenciaParaExcluir}
        title="Excluir Ocorrência"
        message="Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
        onConfirm={handleExcluir}
        onCancel={() => setOcorrenciaParaExcluir(null)}
        isDangerous
        type="warning"
      />

      <InputDialog
        isOpen={!!ocorrenciaParaCancelar}
        title="Cancelar Ocorrência"
        message="Por favor, informe o motivo do cancelamento."
        label="Justificativa"
        placeholder="Ex: Trote, duplicidade, resolvido no local..."
        confirmText="Cancelar Ocorrência"
        onConfirm={confirmarCancelamento}
        onCancel={() => setOcorrenciaParaCancelar(null)}
        required
      />
    </div>
  );
};

export default Ocorrencias;
