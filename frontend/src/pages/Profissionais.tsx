import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfissionalForm from '../components/profissionais/ProfissionalForm';
import './Profissionais.css';

interface Profissional {
  id: number;
  nome: string;
  funcao: 'MEDICO' | 'ENFERMEIRO' | 'CONDUTOR';
  cref?: string;
  contato?: string;
  ativo: boolean;
}

const Profissionais: React.FC = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [profissionalEdit, setProfissionalEdit] = useState<Profissional | null>(null);
  const [filtroFuncao, setFiltroFuncao] = useState<string>('');

  useEffect(() => {
    carregarProfissionais();
  }, []);

  const carregarProfissionais = async (): Promise<void> => {
    try {
      setCarregando(true);
      const response = await api.get<Profissional[]>('/profissionais');
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleNovo = (): void => {
    setProfissionalEdit(null);
    setMostrarForm(true);
  };

  const handleEditar = (profissional: Profissional): void => {
    setProfissionalEdit(profissional);
    setMostrarForm(true);
  };

  const handleSalvar = async (): Promise<void> => {
    setMostrarForm(false);
    await carregarProfissionais();
  };

  const handleCancelar = (): void => {
    setMostrarForm(false);
    setProfissionalEdit(null);
  };

  const getIconeFuncao = (funcao: string): string => {
    const icones: Record<string, string> = {
      MEDICO: '👨‍⚕️',
      ENFERMEIRO: '👩‍⚕️',
      CONDUTOR: '👨‍✈️',
    };
    return icones[funcao] || '👤';
  };

  const getCorFuncao = (funcao: string): string => {
    const cores: Record<string, string> = {
      MEDICO: '#e91e63',
      ENFERMEIRO: '#2196f3',
      CONDUTOR: '#ff9800',
    };
    return cores[funcao] || '#757575';
  };

  const profissionaisFiltrados = profissionais.filter((p) => {
    return !filtroFuncao || p.funcao === filtroFuncao;
  });

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Profissionais</h1>
          <p>Gerenciamento de equipe médica</p>
        </div>
        <button className="btn btn-primary" onClick={handleNovo}>
          + Novo Profissional
        </button>
      </div>

      <ProfissionalForm
        isOpen={mostrarForm}
        profissional={profissionalEdit}
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />

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
      ) : (
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
                  <span style={{ fontSize: '3rem' }}>
                    {getIconeFuncao(profissional.funcao)}
                  </span>
                </div>

                <div className="profissional-info">
                  <h3>{profissional.nome}</h3>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getCorFuncao(profissional.funcao),
                    }}
                  >
                    {profissional.funcao}
                  </span>
                </div>

                <div className="profissional-detalhes">
                  <div className="detalhe-item">
                    <span className="detalhe-label">📞 Contato:</span>
                    <span className="detalhe-valor">
                      {profissional.contato || 'Não informado'}
                    </span>
                  </div>

                  <div className="detalhe-item">
                    <span className="detalhe-label">Status:</span>
                    <span
                      className={`status-badge ${
                        profissional.ativo ? 'ativo' : 'inativo'
                      }`}
                    >
                      {profissional.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => handleEditar(profissional)}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profissionais;
