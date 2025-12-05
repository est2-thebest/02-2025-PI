import React, { useState, useEffect } from 'react';
import profissionalService, { Profissional } from '../services/profissional';
import equipeService, { Equipe } from '../services/equipe';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import ProfissionalForm from '../components/profissionais/ProfissionalForm';
import EquipeForm from '../components/equipes/EquipeForm';
import EquipeList from '../components/equipes/EquipeList';
import { Stethoscope, Syringe, Ambulance, User, Phone, LayoutGrid, List as ListIcon } from 'lucide-react';
import './Profissionais.css';

const Profissionais: React.FC = () => {
  // Estado Geral
  const [activeTab, setActiveTab] = useState<'profissionais' | 'equipes'>('profissionais');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estado Profissionais
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [mostrarFormProfissional, setMostrarFormProfissional] = useState<boolean>(false);
  const [profissionalEdit, setProfissionalEdit] = useState<Profissional | null>(null);
  const [filtroFuncao, setFiltroFuncao] = useState<string>('');

  // Estado Equipes
  const [mostrarFormEquipe, setMostrarFormEquipe] = useState<boolean>(false);
  const [equipeEdit, setEquipeEdit] = useState<Equipe | null>(null);

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const carregarDados = async (): Promise<void> => {
    setCarregando(true);
    try {
      if (activeTab === 'profissionais') {
        const dados = await profissionalService.listar();
        setProfissionais(dados);
      }
      // Equipes são carregadas pelo componente EquipeList, mas poderíamos carregar aqui se quiséssemos centralizar
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Handlers Profissionais
  const handleNovoProfissional = (): void => {
    setProfissionalEdit(null);
    setMostrarFormProfissional(true);
  };

  const handleEditarProfissional = (profissional: Profissional): void => {
    setProfissionalEdit(profissional);
    setMostrarFormProfissional(true);
  };

  const handleSalvarProfissional = async (dados: Profissional): Promise<void> => {
    try {
      if (profissionalEdit && profissionalEdit.id) {
        await profissionalService.atualizar(profissionalEdit.id, dados);
      } else {
        await profissionalService.criar(dados);
      }
      setMostrarFormProfissional(false);
      await carregarDados();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      throw error;
    }
  };

  // Handlers Equipes
  const handleNovaEquipe = (): void => {
    setEquipeEdit(null);
    setMostrarFormEquipe(true);
  };

  const handleEditarEquipe = (equipe: Equipe): void => {
    setEquipeEdit(equipe);
    setMostrarFormEquipe(true);
  };

  const handleSalvarEquipe = async (dados: Equipe): Promise<void> => {
    try {
      if (equipeEdit && equipeEdit.id) {
        await equipeService.atualizar(equipeEdit.id, dados);
      } else {
        await equipeService.criar(dados);
      }
      setMostrarFormEquipe(false);
      // Recarregar equipes (será feito pelo EquipeList se passarmos uma prop de refresh ou key)
      // Por simplicidade, forçamos um reload de página ou usamos um key no componente
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar equipe:', error);
      throw error;
    }
  };

  // Helpers UI
  const getIconeFuncao = (funcao: string): React.ReactNode => {
    const icones: Record<string, React.ReactNode> = {
      MEDICO: <Stethoscope size={40} color="var(--primary)" />,
      ENFERMEIRO: <Syringe size={40} color="var(--secondary)" />,
      CONDUTOR: <Ambulance size={40} color="var(--warning)" />,
    };
    return icones[funcao] || <User size={40} color="var(--text-secondary)" />;
  };

  const getBadgeClass = (funcao: string): string => {
    const classes: Record<string, string> = {
      MEDICO: 'badge-medico',
      ENFERMEIRO: 'badge-enfermeiro',
      CONDUTOR: 'badge-condutor',
    };
    return classes[funcao] || 'badge-secondary';
  };

  const profissionaisFiltrados = profissionais.filter((p) => {
    return !filtroFuncao || p.funcao === filtroFuncao;
  });

  return (
    <div className="page-container">
      <Banner
        title="Recursos Humanos"
        subtitle="Gerenciamento de Profissionais e Equipes"
      />

      {/* Tabs e Ações */}
      <div className="flex-between" style={{ marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className={`btn ${activeTab === 'profissionais' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('profissionais')}
          >
            Profissionais
          </button>
          <button
            className={`btn ${activeTab === 'equipes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('equipes')}
          >
            Equipes
          </button>
        </div>

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

          <button className="btn btn-primary" onClick={activeTab === 'profissionais' ? handleNovoProfissional : handleNovaEquipe}>
            + Novo {activeTab === 'profissionais' ? 'Profissional' : 'Equipe'}
          </button>
        </div>
      </div>

      {/* Forms */}
      <ProfissionalForm
        isOpen={mostrarFormProfissional}
        profissional={profissionalEdit}
        onSalvar={handleSalvarProfissional}
        onCancelar={() => setMostrarFormProfissional(false)}
      />

      <EquipeForm
        isOpen={mostrarFormEquipe}
        equipe={equipeEdit}
        onSalvar={handleSalvarEquipe}
        onCancelar={() => setMostrarFormEquipe(false)}
      />

      {/* Conteúdo */}
      {activeTab === 'profissionais' && (
        <>
          <div className="card">
            <div className="card-body">
              <div className="filtro-funcao">
                <label>Filtrar por função:</label>
                <select
                  value={filtroFuncao}
                  onChange={(e) => setFiltroFuncao(e.target.value)}
                  className="filtro-select"
                >
                  <option value="">Todas as Funções</option>
                  <option value="MEDICO">Médico</option>
                  <option value="ENFERMEIRO">Enfermeiro</option>
                  <option value="CONDUTOR">Condutor</option>
                </select>
              </div>
            </div>
          </div>

          {carregando ? (
            <LoadingSpinner message="Carregando profissionais..." />
          ) : viewMode === 'grid' ? (
            <div className="profissionais-grid">
              {profissionaisFiltrados.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center">
                    <p>Nenhum profissional encontrado</p>
                  </div>
                </div>
              ) : (
                profissionaisFiltrados.map((profissional) => (
                  <div key={profissional.id} className="profissional-card">
                    <div className="profissional-avatar">
                      {getIconeFuncao(profissional.funcao)}
                    </div>

                    <div className="profissional-info">
                      <h3>{profissional.nome}</h3>
                      <span className={`badge ${getBadgeClass(profissional.funcao)}`}>
                        {profissional.funcao}
                      </span>
                    </div>

                    <div className="profissional-detalhes">
                      <div className="detalhe-item">
                        <span className="detalhe-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={14} /> Contato:
                        </span>
                        <span className="detalhe-valor">
                          {profissional.contato || 'Não informado'}
                        </span>
                      </div>

                      <div className="detalhe-item">
                        <span className="detalhe-label">Status:</span>
                        <span className={`status-badge ${profissional.ativo ? 'ativo' : 'inativo'}`}>
                          {profissional.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary btn-block"
                      onClick={() => handleEditarProfissional(profissional)}
                    >
                      Editar
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            // LIST VIEW (TABLE)
            <div className="card">
              <div className="card-body" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Nome</th>
                      <th style={{ padding: '12px' }}>Função</th>
                      <th style={{ padding: '12px' }}>Contato</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profissionaisFiltrados.map((profissional) => (
                      <tr key={profissional.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px' }}>{profissional.nome}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge ${getBadgeClass(profissional.funcao)}`}>
                            {profissional.funcao}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{profissional.contato || '-'}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`status-badge ${profissional.ativo ? 'ativo' : 'inativo'}`}>
                            {profissional.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            onClick={() => handleEditarProfissional(profissional)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'equipes' && (
        <EquipeList onEdit={handleEditarEquipe} />
      )}
    </div>
  );
};

export default Profissionais;
