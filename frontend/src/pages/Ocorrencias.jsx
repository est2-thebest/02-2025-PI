import { useState, useEffect } from 'react';
import ocorrenciaService from '../services/ocorrencia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OcorrenciaForm from '../components/ocorrencias/OcorrenciaForm';
import { getCorGravidade, getCorStatus } from '../utils/helpers';
import './Ocorrencias.css';

const Ocorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [ocorrenciaEdit, setOcorrenciaEdit] = useState(null);
  const [filtros, setFiltros] = useState({
    status: '',
    gravidade: '',
    busca: '',
  });

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  const carregarOcorrencias = async () => {
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

  const handleNovo = () => {
    setOcorrenciaEdit(null);
    setMostrarForm(true);
  };

  const handleEditar = (ocorrencia) => {
    setOcorrenciaEdit(ocorrencia);
    setMostrarForm(true);
  };

  const handleSalvar = async () => {
    setMostrarForm(false);
    await carregarOcorrencias();
  };

  const handleCancelar = () => {
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

  if (mostrarForm) {
    return (
      <div className="page-container">
        <OcorrenciaForm
          ocorrencia={ocorrenciaEdit}
          onSalvar={handleSalvar}
          onCancelar={handleCancelar}
        />
      </div>
    );
  }

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
                    <th>Data/Hora</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ocorrenciasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
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
                          {new Date(ocorrencia.dataHoraAbertura).toLocaleString(
                            'pt-BR',
                          )}
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
