import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import equipeService, { Equipe } from '../../services/equipe';
import { Ambulancia } from '../../services/ambulancia';
import { Profissional } from '../../services/profissional';
import ambulanciaService from '../../services/ambulancia';
import profissionalService from '../../services/profissional';
import { Search, Check } from 'lucide-react';

interface EquipeFormProps {
  isOpen: boolean;
  equipe?: Equipe | null;
  onSalvar: (dados: Equipe) => Promise<void>;
  onCancelar: () => void;
}

/**
 * Formulário para montagem de equipes.
 */
const EquipeForm: React.FC<EquipeFormProps> = ({ isOpen, equipe, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState<Equipe>({
    descricao: '',
    profissionais: [],
    ambulancia: null,
    turno: 'MATUTINO'
  });

  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [todasEquipes, setTodasEquipes] = useState<Equipe[]>([]);
  const [filtroProfissional, setFiltroProfissional] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isOpen) {
      carregarDados();
      setFiltroProfissional('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (equipe) {
      setFormData(equipe);
    } else {
      setFormData({
        descricao: '',
        profissionais: [],
        ambulancia: null,
        turno: 'MATUTINO'
      });
    }
  }, [equipe, isOpen]);

  const carregarDados = async () => {
    try {
      // Carregar tudo para filtrar no front
      const [ambs, profs, equipes] = await Promise.all([
        ambulanciaService.listarTodas(),
        profissionalService.listar(),
        equipeService.listar()
      ]);

      setAmbulancias(ambs);
      setProfissionais(profs.filter(p => p.ativo));
      setTodasEquipes(equipes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados iniciais');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'turno') {
      // Se mudar o turno, limpa os profissionais selecionados
      setFormData(prev => ({
        ...prev,
        [name]: value as 'MATUTINO' | 'VESPERTINO' | 'NOTURNO',
        profissionais: []
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmbulanciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ambId = Number(e.target.value);
    const amb = ambulancias.find(a => a.id === ambId) || null;
    setFormData(prev => ({ ...prev, ambulancia: amb }));
  };

  const handleProfissionalToggle = (profissional: Profissional) => {
    setFormData(prev => {
      const exists = prev.profissionais.find(p => p.id === profissional.id);
      let newProfs;
      if (exists) {
        newProfs = prev.profissionais.filter(p => p.id !== profissional.id);
      } else {
        newProfs = [...prev.profissionais, profissional];
      }
      return { ...prev, profissionais: newProfs };
    });
  };

  const validateTeam = (): string | null => {
    if (!formData.ambulancia) return 'Selecione uma ambulância';

    const medicos = formData.profissionais.filter(p => p.funcao === 'MEDICO').length;
    const enfermeiros = formData.profissionais.filter(p => p.funcao === 'ENFERMEIRO').length;
    const condutores = formData.profissionais.filter(p => p.funcao === 'MOTORISTA').length;

    if (formData.ambulancia.tipo === 'USA') {
      // USA: Exatamente 1 Medico, 1 Enfermeiro, 1 Motorista
      if (medicos !== 1) return 'USA requer 1 Médico';
      if (enfermeiros !== 1) return 'USA requer 1 Enfermeiro';
      if (condutores !== 1) return 'USA requer 1 Motorista';
    } else {
      // USB: Exatamente 1 Enfermeiro, 1 Motorista (Sem médico)
      if (medicos > 0) return 'USB não deve ter Médico';
      if (enfermeiros !== 1) return 'USB requer 1 Enfermeiro';
      if (condutores !== 1) return 'USB requer 1 Motorista';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!formData.descricao) {
      setErro('Descrição é obrigatória');
      return;
    }

    const validationError = validateTeam();
    if (validationError) {
      setErro(validationError);
      return;
    }

    setSalvando(true);
    try {
      await onSalvar(formData);
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao salvar equipe');
    } finally {
      setSalvando(false);
    }
  };

  // Lógica de Filtragem
  const getAmbulanciasDisponiveis = () => {
    return ambulancias.filter(amb => {
      // Se for a ambulância selecionada atualmente (edição), mantém
      if (formData.ambulancia?.id === amb.id) return true;

      // Filtra inativas, mas permite SEM_EQUIPE e DISPONIVEL
      if (amb.status === 'INATIVA') return false;

      // Verifica se a ambulância está em outra equipe NO MESMO TURNO
      const emUso = todasEquipes.some(eq =>
        eq.id !== formData.id && // Não é a equipe atual
        eq.turno === formData.turno && // Mesmo turno
        eq.ambulancia?.id === amb.id // Mesma ambulância
      );

      return !emUso;
    });
  };

  const getProfissionaisDisponiveis = () => {
    return profissionais.filter(prof => {
      // Primeiro, verifica se o profissional pertence ao turno selecionado
      if (prof.turno !== formData.turno) return false;

      // Se já estiver na lista de selecionados desta equipe, mostra
      if (formData.profissionais.some(p => p.id === prof.id)) return true;

      // Verifica se está em uso por OUTRA equipe no MESMO turno
      const emUso = todasEquipes.some(eq =>
        eq.id !== formData.id &&
        eq.turno === formData.turno &&
        eq.profissionais.some(p => p.id === prof.id)
      );

      return !emUso;
    });
  };

  const profissionaisFiltrados = getProfissionaisDisponiveis().filter(p =>
    p.nome.toLowerCase().includes(filtroProfissional.toLowerCase()) ||
    p.funcao.toLowerCase().includes(filtroProfissional.toLowerCase())
  );

  const ambulanciasDisponiveis = getAmbulanciasDisponiveis();

  return (
    <Modal
      isOpen={isOpen}
      title={equipe ? 'Editar Equipe' : 'Nova Equipe'}
      onClose={onCancelar}
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" form="equipe-form" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      }
    >
      <form id="equipe-form" onSubmit={handleSubmit}>
        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="form-group">
          <label htmlFor="descricao">Descrição / Nome da Equipe *</label>
          <input
            id="descricao"
            name="descricao"
            type="text"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Ex: Equipe Alpha"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="turno">Turno *</label>
          <select
            id="turno"
            name="turno"
            value={formData.turno}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="MATUTINO">Matutino</option>
            <option value="VESPERTINO">Vespertino</option>
            <option value="NOTURNO">Noturno</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ambulancia">Ambulância</label>
          <select
            id="ambulancia"
            value={formData.ambulancia?.id || ''}
            onChange={handleAmbulanciaChange}
            className="form-control"
          >
            <option value="">Selecione uma ambulância</option>
            {ambulanciasDisponiveis.map(amb => (
              <option key={amb.id} value={amb.id}>
                {amb.placa} - {amb.tipo} ({amb.status})
              </option>
            ))}
          </select>
          <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
            Selecione a ambulância que esta equipe irá operar.
          </small>
        </div>

        <div className="form-group">
          <label>Profissionais</label>

          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="Buscar profissional..."
              value={filtroProfissional}
              onChange={(e) => setFiltroProfissional(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '32px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          </div>

          <div className="profissionais-list-container" style={{
            maxHeight: '250px',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            {profissionaisFiltrados.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Nenhum profissional disponível encontrado.
              </div>
            ) : (
              profissionaisFiltrados.map(prof => {
                const isSelected = !!formData.profissionais.find(p => p.id === prof.id);
                return (
                  <div
                    key={prof.id}
                    onClick={() => handleProfissionalToggle(prof)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    className="profissional-item"
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: isSelected ? 'none' : '2px solid var(--text-secondary)',
                      backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0
                    }}>
                      {isSelected && <Check size={14} color="white" />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{prof.nome}</div>
                      <span className={`badge badge-${prof.funcao.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px' }}>
                        {(prof.funcao as string) === 'CONDUTOR' ? 'MOTORISTA' : prof.funcao}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
            Apenas profissionais disponíveis neste turno são exibidos.
          </small>
        </div>
      </form>
    </Modal>
  );
};

export default EquipeForm;
