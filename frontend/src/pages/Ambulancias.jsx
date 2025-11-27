import { useState, useEffect } from 'react';
import ambulanciaService from '../services/ambulancia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AmbulanciaForm from '../components/ambulancias/AmbulanciaForm';
import './Ambulancias.css';

const Ambulancias = () => {
  const [ambulancias, setAmbulancias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [ambulanciaEdit, setAmbulanciaEdit] = useState(null);
  const [filtros, setFiltros] = useState({
    status: '',
    tipo: '',
    busca: ''
  });

  useEffect(() => {
    carregarAmbulancias();
  }, []);

  const carregarAmbulancias = async () => {
    try {
      setCarregando(true);
      const dados = await ambulanciaService.listarTodas();
      setAmbulancias(dados);
    } catch (error) {
      console.error('Erro ao carregar ambulâncias:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleNovo = () => {
    setAmbulanciaEdit(null);
    setMostrarForm(true);
  };

  const handleEditar = (ambulancia) => {
    setAmbulanciaEdit(ambulancia);
    setMostrarForm(true);
  };

  const handleSalvar = async () => {
    setMostrarForm(false);
    await carregarAmbulancias();
  };

  const handleCancelar = () => {
    setMostrarForm(false);
    setAmbulanciaEdit(null);
  };

  const getCorStatus = (status) => {
    const cores = {
      DISPONIVEL: '#4caf50',
      EM_ATENDIMENTO: '#ff9800',
      EM_MANUTENCAO: '#f44336'
    };
    return cores[status] || '#999';
  };

  const getCorTipo = (tipo) => {
    return tipo === 'UTI' ? '#e91e63' : '#2196f3';
  };

  const ambulanciasFiltradas = ambulancias.filter(a => {
    const matchStatus = !filtros.status || a.status === filtros.status;
    const matchTipo = !filtros.tipo || a.tipo === filtros.tipo;
    const matchBusca = !filtros.busca || 
      a.placa?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      a.base?.toLowerCase().includes(filtros.busca.toLowerCase());
    
    return matchStatus && matchTipo && matchBusca;
  });

  if (mostrarForm) {
    return (
      <div className="page-container">
        <AmbulanciaForm
          ambulancia={ambulanciaEdit}
          onSalvar={handleSalvar}
          onCancelar={handleCancelar}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Ambulâncias</h1>
          <p>Gerenciamento da frota de ambulâncias</p>
        </div>
        <button className="btn btn-primary" onClick={handleNovo}>
          + Nova Ambulância
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="filtros-container">
            <input
              type="text"
              placeholder="Buscar por placa ou base..."
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              className="filtro-busca"
            />
            
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="filtro-select"
            >
              <option value="">Todos os Tipos</option>
              <option value="BASICA">Básica</option>
              <option value="UTI">UTI</option>
            </select>

            <select
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              className="filtro-select"
            >
              <option value="">Todos os Status</option>
              <option value="DISPONIVEL">Disponível</option>
              <option value="EM_ATENDIMENTO">Em Atendimento</option>
              <option value="EM_MANUTENCAO">Em Manutenção</option>
            </select>
          </div>
        </div>
      </div>

      {carregando ? (
        <LoadingSpinner message="Carregando ambulâncias..." />
      ) : (
        <div className="ambulancias-grid">
          {ambulanciasFiltradas.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <p>Nenhuma ambulância encontrada</p>
              </div>
            </div>
          ) : (
            ambulanciasFiltradas.map((ambulancia) => (
              <div key={ambulancia.id} className="ambulancia-card">
                <div className="ambulancia-header">
                  <h3>🚑 {ambulancia.placa}</h3>
                  <span
                    className="badge"
                    style={{ backgroundColor: getCorTipo(ambulancia.tipo) }}
                  >
                    {ambulancia.tipo}
                  </span>
                </div>
                
                <div className="ambulancia-info">
                  <div className="info-item">
                    <span className="info-label">Base:</span>
                    <span className="info-value">{ambulancia.base || 'Não definida'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span
                      className="badge"
                      style={{ backgroundColor: getCorStatus(ambulancia.status) }}
                    >
                      {ambulancia.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {ambulancia.equipe && (
                    <div className="info-item">
                      <span className="info-label">Equipe:</span>
                      <span className="info-value">{ambulancia.equipe}</span>
                    </div>
                  )}
                </div>

                <div className="ambulancia-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEditar(ambulancia)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Ambulancias;