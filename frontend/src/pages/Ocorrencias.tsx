import React, { useState, useEffect } from 'react';
import ocorrenciaService, { Ocorrencia } from '../services/ocorrencia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OcorrenciaForm from '../components/ocorrencias/OcorrenciaForm';
import { getCorGravidade, getCorStatus } from '../utils/helpers';
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

  const ocorrenciasFiltradas = ocorrencias.filter((o) => {
    const matchStatus = !filtros.status || o.status === filtros.status;
    const matchGravidade =
      !filtros.gravidade || o.gravidade === filtros.gravidade;
    const matchBusca =
      !filtros.busca ||
      o.local?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      o.tipo?.toLowerCase().includes(filtros.busca.toLowerCase());

    return matchStatus && matchGravidade && matchBusca;
  });

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Ocorrências</h1>
          <p>Gerenciamento de ocorrências de emergência</p>
        </div>
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
              <option value="ATENDENDO">Em Atendimento</option>
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
                        <td>{ocorrencia.local}</td>
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
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleEditar(ocorrencia)}
                            title="Editar"
                          >
                            ✏️
                          </button>
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
    </div>
  );
};

export default Ocorrencias;
