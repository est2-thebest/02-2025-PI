import React, { useState, useEffect } from 'react';
import ocorrenciaService, { Ocorrencia } from '../services/ocorrencia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import OcorrenciaForm from '../components/ocorrencias/OcorrenciaForm';
import { getCorGravidade, getCorStatus } from '../utils/helpers';
import { Edit, Trash2, Play, Check, XCircle } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';
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
  const [ocorrenciaEdit, setOcorrenciaEdit] = useState<Ocorrencia | null>(null);
  const [ocorrenciaParaExcluir, setOcorrenciaParaExcluir] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    status: '',
    gravidade: '',
    busca: '',
  });

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  const carregarOcorrencias = async (): Promise<void> => {
    try {
      setCarregando(true);
      const dados = await ocorrenciaService.listarTodas();
      setOcorrencias(dados);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleNovo = (): void => {
    setOcorrenciaEdit(null);
    setMostrarForm(true);
  };

  const handleEditar = (ocorrencia: Ocorrencia): void => {
    setOcorrenciaEdit(ocorrencia);
    setMostrarForm(true);
  };

  const handleSalvar = async (): Promise<void> => {
    setMostrarForm(false);
    await carregarOcorrencias();
  };

  const handleCancelar = (): void => {
    setMostrarForm(false);
    setOcorrenciaEdit(null);
  };

  const confirmarExclusao = (id: number) => {
    setOcorrenciaParaExcluir(id);
  };

  const handleExcluir = async () => {
    if (ocorrenciaParaExcluir) {
      try {
        await ocorrenciaService.excluir(ocorrenciaParaExcluir);
        setOcorrenciaParaExcluir(null);
        await carregarOcorrencias();
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error);
        alert('Erro ao excluir ocorrência.');
      }
    }
  }


  const handleConfirmarSaida = async (id: number) => {
    if (window.confirm('Confirmar saída da ambulância para o local?')) {
      try {
        await ocorrenciaService.confirmarSaida(id);
        await carregarOcorrencias();
      } catch (error) {
        console.error('Erro ao confirmar saída:', error);
        alert('Erro ao confirmar saída.');
      }
    }
  };

  const handleConcluir = async (id: number) => {
    if (window.confirm('Confirmar conclusão do atendimento? A ambulância será liberada.')) {
      try {
        await ocorrenciaService.concluir(id);
        await carregarOcorrencias();
      } catch (error) {
        console.error('Erro ao concluir ocorrência:', error);
        alert('Erro ao concluir ocorrência.');
      }
    }
  };

  const handleCancelarOcorrencia = async (id: number) => {
    if (window.confirm('Tem certeza que deseja cancelar esta ocorrência?')) {
      try {
        await ocorrenciaService.cancelar(id);
        await carregarOcorrencias();
      } catch (error) {
        console.error('Erro ao cancelar ocorrência:', error);
        alert('Erro ao cancelar ocorrência.');
      }
    }
  };

  const ocorrenciasFiltradas = ocorrencias.filter((o) => {
    const matchStatus = !filtros.status || o.status === filtros.status;
    const matchGravidade =
      !filtros.gravidade || o.gravidade === filtros.gravidade;
    const matchBusca =
      !filtros.busca ||
      o.bairro?.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      o.tipo?.toLowerCase().includes(filtros.busca.toLowerCase());

    return matchStatus && matchGravidade && matchBusca;
  });

  return (
    <div className="page-container">
      <Banner
        title="Ocorrências"
        subtitle="Gerenciamento de ocorrências de emergência"
      />
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div></div>
        <button className="btn btn-primary" onClick={handleNovo}>
          + Nova Ocorrência
        </button>
      </div>

      <OcorrenciaForm
        isOpen={mostrarForm}
        ocorrencia={ocorrenciaEdit || undefined}
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />

      <div className="card">
        <div className="card-body">
          <div className="filtros-container">
            <input
              type="text"
              placeholder="Buscar por local ou tipo..."
              value={filtros.busca}
              onChange={(e) =>
                setFiltros({ ...filtros, busca: e.target.value })
              }
              className="filtro-busca"
            />

            <select
              value={filtros.status}
              onChange={(e) =>
                setFiltros({ ...filtros, status: e.target.value })
              }
              className="filtro-select"
            >
              <option value="">Todos os Status</option>
              <option value="ABERTA">Aberta</option>
              <option value="DESPACHADA">Despachada</option>
              <option value="EM_ATENDIMENTO">Em Atendimento</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="CANCELADA">Cancelada</option>
            </select>

            <select
              value={filtros.gravidade}
              onChange={(e) =>
                setFiltros({ ...filtros, gravidade: e.target.value })
              }
              className="filtro-select"
            >
              <option value="">Todas as Gravidades</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Média</option>
              <option value="BAIXA">Baixa</option>
            </select>
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
                    <th>Local</th>
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
                        <td>#{ocorrencia.id}</td>
                        <td>{ocorrencia.bairro?.nome || '-'}</td>
                        <td>{ocorrencia.tipo}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: getCorGravidade(
                                ocorrencia.gravidade,
                              ),
                            }}
                          >
                            {ocorrencia.gravidade}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: getCorStatus(ocorrencia.status),
                            }}
                          >
                            {ocorrencia.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-icon"
                              onClick={() => handleEditar(ocorrencia)}
                              title="Editar"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => ocorrencia.id && confirmarExclusao(ocorrencia.id)}
                              title="Excluir"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                            >
                              <Trash2 size={18} />
                            </button>

                            {ocorrencia.status === 'DESPACHADA' && (
                              <button
                                className="btn-icon"
                                onClick={() => ocorrencia.id && handleConfirmarSaida(ocorrencia.id)}
                                title="Confirmar Saída"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warning)' }}
                              >
                                <Play size={18} />
                              </button>
                            )}

                            {ocorrencia.status === 'EM_ATENDIMENTO' && (
                              <button
                                className="btn-icon"
                                onClick={() => ocorrencia.id && handleConcluir(ocorrencia.id)}
                                title="Concluir Atendimento"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)' }}
                              >
                                <Check size={18} />
                              </button>
                            )}

                            {['ABERTA', 'DESPACHADA', 'EM_ATENDIMENTO'].includes(ocorrencia.status) && (
                              <button
                                className="btn-icon"
                                onClick={() => ocorrencia.id && handleCancelarOcorrencia(ocorrencia.id)}
                                title="Cancelar Ocorrência"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
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

      <ConfirmDialog
        isOpen={!!ocorrenciaParaExcluir}
        title="Excluir Ocorrência"
        message="Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
        onConfirm={handleExcluir}
        onCancel={() => setOcorrenciaParaExcluir(null)}
        isDangerous
        type="warning"
      />
    </div>
  );
};

export default Ocorrencias;
