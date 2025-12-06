import React, { useState, useEffect } from 'react';
import ambulanciaService, { Ambulancia } from '../services/ambulancia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import AmbulanciaList from '../components/ambulancias/AmbulanciaList';
import AmbulanciaForm from '../components/ambulancias/AmbulanciaForm';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';

const Ambulancias: React.FC = () => {
  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [ambulanciaEdit, setAmbulanciaEdit] = useState<Ambulancia | null>(null);
  const [ambulanciaParaInativar, setAmbulanciaParaInativar] = useState<Ambulancia | null>(null);

  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    tipo: ''
  });

  useEffect(() => {
    carregarAmbulancias();
  }, []);

  const carregarAmbulancias = async () => {
    try {
      setCarregando(true);
      const dados = await ambulanciaService.listar();
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

  const handleEditar = (ambulancia: Ambulancia) => {
    setAmbulanciaEdit(ambulancia);
    setMostrarForm(true);
  };

  const handleSalvar = async (dados: Ambulancia) => {
    try {
      if (ambulanciaEdit && ambulanciaEdit.id) {
        await ambulanciaService.atualizar(ambulanciaEdit.id, dados);
      } else {
        await ambulanciaService.criar(dados);
      }
      setMostrarForm(false);
      await carregarAmbulancias();
    } catch (error) {
      console.error('Erro ao salvar ambulância:', error);
      throw error;
    }
  };

  const handleInativar = (ambulancia: Ambulancia) => {
    setAmbulanciaParaInativar(ambulancia);
  };

  const confirmarInativacao = async () => {
    if (ambulanciaParaInativar && ambulanciaParaInativar.id) {
      try {
        await ambulanciaService.atualizar(ambulanciaParaInativar.id, { ...ambulanciaParaInativar, status: 'INATIVA' });
        await carregarAmbulancias();
      } catch (error: any) {
        console.error('Erro ao inativar ambulância:', error);
        const errorMessage = error.response?.data?.message || 'Erro ao inativar ambulância.';
        alert(errorMessage);
      } finally {
        setAmbulanciaParaInativar(null);
      }
    }
  };

  const ambulanciasFiltradas = ambulancias.filter(amb => {
    const matchStatus = !filtros.status || amb.status === filtros.status;
    const matchTipo = !filtros.tipo || amb.tipo === filtros.tipo;
    const matchBusca = !filtros.busca ||
      amb.placa.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      amb.tipo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      (amb.bairro?.nome || '').toLowerCase().includes(filtros.busca.toLowerCase());
    return matchStatus && matchTipo && matchBusca;
  });

  return (
    <div className="page-container">
      <Banner
        title="Frota de Ambulâncias"
        subtitle="Gerenciamento de veículos e status"
      />

      <div className="flex-between" style={{ marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '4px' }}>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              title={viewMode === 'grid' ? 'Mudar para Lista' : 'Mudar para Grade'}
              style={{
                background: 'white',
                border: 'none',
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {viewMode === 'grid' ? (
                <ListIcon size={20} color="var(--primary)" />
              ) : (
                <LayoutGrid size={20} color="var(--primary)" />
              )}
            </button>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleNovo}>
          + Nova Ambulância
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
                placeholder="Buscar por placa, bairro..."
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
                <option value="DISPONIVEL">Disponível</option>
                <option value="EM_ATENDIMENTO">Em Atendimento</option>
                <option value="INATIVA">Inativa</option>
                <option value="MANUTENCAO">Manutenção</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select
                className="filtro-select"
                value={filtros.tipo}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="USB">USB</option>
                <option value="USA">USA</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <AmbulanciaForm
        isOpen={mostrarForm}
        ambulancia={ambulanciaEdit}
        onSalvar={handleSalvar}
        onCancelar={() => setMostrarForm(false)}
      />

      {carregando ? (
        <LoadingSpinner message="Carregando frota..." />
      ) : (
        <AmbulanciaList
          ambulancias={ambulanciasFiltradas}
          onEdit={handleEditar}
          onInativar={handleInativar}
          viewMode={viewMode}
        />
      )}

      <ConfirmDialog
        isOpen={!!ambulanciaParaInativar}
        title="Inativar Ambulância"
        message={`Deseja realmente inativar a ambulância ${ambulanciaParaInativar?.placa}?`}
        onConfirm={confirmarInativacao}
        onCancel={() => setAmbulanciaParaInativar(null)}
        isDangerous
        type="warning"
      />
    </div>
  );
};

export default Ambulancias;
