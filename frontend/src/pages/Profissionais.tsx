import React, { useState, useEffect } from 'react';
import profissionalService, { Profissional } from '../services/profissional';
import equipeService, { Equipe } from '../services/equipe';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import ProfissionalForm from '../components/profissionais/ProfissionalForm';
import EquipeForm from '../components/equipes/EquipeForm';
import EquipeList from '../components/equipes/EquipeList';
import { Stethoscope, Syringe, Ambulance, User, Phone, LayoutGrid, List as ListIcon, Edit, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AlertDialog from '../components/common/AlertDialog';
import './Profissionais.css';

/**
 * Tela de gestão de recursos humanos (Profissionais e Equipes).
 * Permite o cadastro e organização das equipes de atendimento.
 * [RF03] Gestão de Recursos.
 */
const Profissionais: React.FC = () => {
  // Estado Geral
  const [activeTab, setActiveTab] = useState<'profissionais' | 'equipes'>(() => {
    return (localStorage.getItem('activeTab') as 'profissionais' | 'equipes') || 'profissionais';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [carregando, setCarregando] = useState<boolean>(true);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [mostrarFormProfissional, setMostrarFormProfissional] = useState<boolean>(false);
  const [profissionalEdit, setProfissionalEdit] = useState<Profissional | null>(null);
  const [mostrarFormEquipe, setMostrarFormEquipe] = useState<boolean>(false);
  const [equipeEdit, setEquipeEdit] = useState<Equipe | null>(null);
  const [profissionalParaExcluir, setProfissionalParaExcluir] = useState<number | null>(null);
  const [equipeParaExcluir, setEquipeParaExcluir] = useState<number | null>(null);
  const [filtros, setFiltros] = useState({
    busca: '',
    funcao: '',
    status: '',
    turno: '',
    tipoAmbulancia: ''
  });
  const [alertInfo, setAlertInfo] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  // Helpers UI
  const getIconeFuncao = (funcao: string): React.ReactNode => {
    const icones: Record<string, React.ReactNode> = {
      MEDICO: <Stethoscope size={40} color="var(--primary)" />,
      ENFERMEIRO: <Syringe size={40} color="var(--secondary)" />,
      CONDUTOR: <Ambulance size={40} color="var(--warning)" />,
      MOTORISTA: <Ambulance size={40} color="var(--warning)" />,
    };
    return icones[funcao] || <User size={40} color="var(--text-secondary)" />;
  };

  const getBadgeClass = (funcao: string): string => {
    return funcao;
  };

  // Funções de Carregamento
  const carregarProfissionais = async () => {
    setCarregando(true);
    try {
      const data = await profissionalService.listar();
      setProfissionais(data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Erro',
        message: 'Não foi possível carregar os profissionais.',
        type: 'error',
      });
    } finally {
      setCarregando(false);
    }
  };

  const carregarEquipes = async () => {
    setCarregando(true);
    try {
      const data = await equipeService.listar();
      setEquipes(data);
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Erro',
        message: 'Não foi possível carregar as equipes.',
        type: 'error',
      });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'profissionais') {
      carregarProfissionais();
    } else {
      carregarEquipes();
    }
  }, [activeTab]);

  // Funções de Profissional
  const handleNovoProfissional = () => {
    setProfissionalEdit(null);
    setMostrarFormProfissional(true);
  };

  const handleEditarProfissional = (profissional: Profissional) => {
    setProfissionalEdit(profissional);
    setMostrarFormProfissional(true);
  };

  // Salva profissional (criação ou edição)
  // [RF03] Validação de dados do profissional
  const handleSalvarProfissional = async (profissional: Profissional) => {
    try {
      if (profissional.id) {
        await profissionalService.atualizar(profissional.id, profissional);
        setAlertInfo({
          isOpen: true,
          title: 'Sucesso',
          message: 'Profissional atualizado com sucesso!',
          type: 'success',
        });
      } else {
        await profissionalService.criar(profissional);
        setAlertInfo({
          isOpen: true,
          title: 'Sucesso',
          message: 'Profissional criado com sucesso!',
          type: 'success',
        });
      }
      setMostrarFormProfissional(false);
      carregarProfissionais();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Erro',
        message: 'Não foi possível salvar o profissional.',
        type: 'error',
      });
    }
  };

  const confirmarExclusaoProfissional = (id: number) => {
    setProfissionalParaExcluir(id);
  };

  // Exclusão de profissional
  // [Regra de Negócio] Impede exclusão se vinculado a equipe ativa
  const handleExcluirProfissional = async () => {
    if (profissionalParaExcluir) {
      try {
        await profissionalService.excluir(profissionalParaExcluir);
        setAlertInfo({
          isOpen: true,
          title: 'Sucesso',
          message: 'Profissional excluído com sucesso!',
          type: 'success',
        });
        carregarProfissionais();
      } catch (error) {
        console.error('Erro ao excluir profissional:', error);
        setAlertInfo({
          isOpen: true,
          title: 'Erro',
          message: 'Não foi possível excluir o profissional.',
          type: 'error',
        });
      } finally {
        setProfissionalParaExcluir(null);
      }
    }
  };

  // Funções de Equipe
  const handleNovaEquipe = () => {
    setEquipeEdit(null);
    setMostrarFormEquipe(true);
  };

  const handleEditarEquipe = (equipe: Equipe) => {
    setEquipeEdit(equipe);
    setMostrarFormEquipe(true);
  };

  // Salva equipe (montagem)
  // [RF03] Associação de profissionais e ambulância
  const handleSalvarEquipe = async (equipe: Equipe) => {
    try {
      if (equipe.id) {
        await equipeService.atualizar(equipe.id, equipe);
        setAlertInfo({
          isOpen: true,
          title: 'Sucesso',
          message: 'Equipe atualizada com sucesso!',
          type: 'success',
        });
      } else {
        await equipeService.criar(equipe);
        setAlertInfo({
          isOpen: true,
          title: 'Sucesso',
          message: 'Equipe criada com sucesso!',
          type: 'success',
        });
      }
      setMostrarFormEquipe(false);
      carregarEquipes();
    } catch (error) {
      console.error('Erro ao salvar equipe:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Erro',
        message: 'Não foi possível salvar a equipe.',
        type: 'error',
      });
    }
  };

  const confirmarExclusaoEquipe = (id: number) => {
    setEquipeParaExcluir(id);
  };

  // Desmontagem de equipe
  // [RF03] Libera profissionais e ambulância
  const handleExcluirEquipe = async () => {
    if (equipeParaExcluir) {
      try {
        await equipeService.excluir(equipeParaExcluir);
        setAlertInfo({
          isOpen: true,
          title: 'Sucesso',
          message: 'Equipe excluída com sucesso!',
          type: 'success',
        });
        carregarEquipes();
      } catch (error: any) {
        console.error('Erro ao excluir equipe:', error);
        const errorMessage = error.response?.data?.message || 'Não foi possível excluir a equipe. Verifique se existem dependências.';
        setAlertInfo({
          isOpen: true,
          title: 'Erro',
          message: errorMessage,
          type: 'error',
        });
      } finally {
        setEquipeParaExcluir(null);
      }
    }
  };



  const profissionaisFiltrados = profissionais.filter((p) => {
    const matchFuncao = !filtros.funcao || p.funcao === filtros.funcao || (filtros.funcao === 'CONDUTOR' && p.funcao === 'MOTORISTA');
    const matchStatus = !filtros.status || (filtros.status === 'ATIVO' ? p.ativo : !p.ativo);
    const matchBusca = !filtros.busca ||
      p.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      (p.contato || '').toLowerCase().includes(filtros.busca.toLowerCase()) ||
      (p.turno || '').toLowerCase().includes(filtros.busca.toLowerCase());
    return matchFuncao && matchStatus && matchBusca;
  });

  const equipesFiltradas = equipes.filter((e) => {
    const matchTurno = !filtros.turno || e.turno === filtros.turno;
    const matchTipoAmbulancia = !filtros.tipoAmbulancia || e.ambulancia?.tipo === filtros.tipoAmbulancia;

    if (!filtros.busca) return matchTurno && matchTipoAmbulancia;

    const term = filtros.busca.toLowerCase();
    const matchBusca =
      (e.descricao || '').toLowerCase().includes(term) ||
      e.profissionais.some(p => p.nome.toLowerCase().includes(term));

    return matchTurno && matchTipoAmbulancia && matchBusca;
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

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div
            className="filtros-container"
          >
            <div className="form-group">
              <label>Buscar</label>
              <input
                type="text"
                className="filtro-busca"
                placeholder={activeTab === 'profissionais' ? "Buscar por nome, contato, turno..." : "Buscar por profissionais, descrição..."}
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              />
            </div>

            {activeTab === 'profissionais' ? (
              <>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={filtros.status}
                    onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                    className="filtro-select"
                  >
                    <option value="">Todos</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Função</label>
                  <select
                    value={filtros.funcao}
                    onChange={(e) => setFiltros({ ...filtros, funcao: e.target.value })}
                    className="filtro-select"
                  >
                    <option value="">Todas as Funções</option>
                    <option value="MEDICO">Médico</option>
                    <option value="ENFERMEIRO">Enfermeiro</option>
                    <option value="CONDUTOR">Motorista</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Turno</label>
                  <select
                    value={filtros.turno}
                    onChange={(e) => setFiltros({ ...filtros, turno: e.target.value })}
                    className="filtro-select"
                  >
                    <option value="">Todos</option>
                    <option value="MATUTINO">Matutino</option>
                    <option value="VESPERTINO">Vespertino</option>
                    <option value="NOTURNO">Noturno</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo Amb.</label>
                  <select
                    value={filtros.tipoAmbulancia}
                    onChange={(e) => setFiltros({ ...filtros, tipoAmbulancia: e.target.value })}
                    className="filtro-select"
                  >
                    <option value="">Todos</option>
                    <option value="USB">USB</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {activeTab === 'profissionais' && (
        <>
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

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={() => handleEditarProfissional(profissional)}
                      >
                        <Edit size={16} /> Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => profissional.id && confirmarExclusaoProfissional(profissional.id)}
                      >
                        <Trash2 size={16} /> Excluir
                      </button>
                    </div>
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
                      <th style={{ padding: '12px' }}>Turno</th>
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
                        <td style={{ padding: '12px' }}>
                          <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>{profissional.turno || '-'}</span>
                        </td>
                        <td style={{ padding: '12px' }}>{profissional.contato || '-'}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`status-badge ${profissional.ativo ? 'ativo' : 'inativo'}`}>
                            {profissional.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-icon"
                              onClick={() => handleEditarProfissional(profissional)}
                              title="Editar"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => profissional.id && confirmarExclusaoProfissional(profissional.id)}
                              title="Excluir"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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
        <EquipeList
          equipes={equipesFiltradas}
          onEdit={handleEditarEquipe}
          onDelete={confirmarExclusaoEquipe}
          viewMode={viewMode}
        />
      )}

      <ConfirmDialog
        isOpen={!!profissionalParaExcluir}
        title="Excluir Profissional"
        message="Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita."
        onConfirm={handleExcluirProfissional}
        onCancel={() => setProfissionalParaExcluir(null)}
        isDangerous
        type="warning"
      />

      <ConfirmDialog
        isOpen={!!equipeParaExcluir}
        title="Excluir Equipe"
        message="Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita."
        onConfirm={handleExcluirEquipe}
        onCancel={() => setEquipeParaExcluir(null)}
        isDangerous
        type="warning"
      />

      <AlertDialog
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
        onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
      />
    </div >
  );
};

export default Profissionais;
