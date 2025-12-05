import React, { useState, useEffect } from 'react';
import ambulanciaService, { Ambulancia } from '../services/ambulancia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import AmbulanciaList from '../components/ambulancias/AmbulanciaList';
import AmbulanciaForm from '../components/ambulancias/AmbulanciaForm';
import { LayoutGrid, List as ListIcon } from 'lucide-react';

const Ambulancias: React.FC = () => {
  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [ambulanciaEdit, setAmbulanciaEdit] = useState<Ambulancia | null>(null);

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
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'white' : 'transparent',
                border: 'none',
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <LayoutGrid size={20} color={viewMode === 'grid' ? 'var(--primary)' : 'var(--text-secondary)'} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'white' : 'transparent',
                border: 'none',
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <ListIcon size={20} color={viewMode === 'list' ? 'var(--primary)' : 'var(--text-secondary)'} />
            </button>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleNovo}>
          + Nova Ambulância
        </button>
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
          ambulancias={ambulancias}
          onEdit={handleEditar}
          viewMode={viewMode}
        />
      )}
    </div>
  );
};

export default Ambulancias;
