import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Equipe } from '../../services/equipe';
import { Ambulancia } from '../../services/ambulancia';
import { Profissional } from '../../services/profissional';
import ambulanciaService from '../../services/ambulancia';
import profissionalService from '../../services/profissional';

interface EquipeFormProps {
  isOpen: boolean;
  equipe?: Equipe | null;
  onSalvar: (dados: Equipe) => Promise<void>;
  onCancelar: () => void;
}

const EquipeForm: React.FC<EquipeFormProps> = ({ isOpen, equipe, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState<Equipe>({
    descricao: '',
    profissionais: [],
    ambulancia: null
  });

  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isOpen) {
      carregarDados();
    }
  }, [isOpen]);

  useEffect(() => {
    if (equipe) {
      setFormData(equipe);
    } else {
      setFormData({
        descricao: '',
        profissionais: [],
        ambulancia: null
      });
    }
  }, [equipe, isOpen]);

  const carregarDados = async () => {
    // Carregar Ambulâncias
    try {
      const ambs = await ambulanciaService.listarDisponiveis();

      // Se estiver editando, precisa incluir a ambulância atual na lista se ela não estiver disponível
      if (equipe && equipe.ambulancia) {
        const currentAmb = equipe.ambulancia;
        if (!ambs.find(a => a.id === currentAmb.id)) {
          ambs.push(currentAmb);
        }
      }
      setAmbulancias(ambs);
    } catch (error) {
      console.error('Erro ao carregar ambulâncias:', error);
      // Não define erro global para não bloquear o formulário
    }

    // Carregar Profissionais
    try {
      const profs = await profissionalService.listar();
      setProfissionais(profs.filter(p => p.ativo));
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      setErro('Erro ao carregar lista de profissionais');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!formData.descricao) {
      setErro('Descrição é obrigatória');
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="ambulancia">Ambulância</label>
          <select
            id="ambulancia"
            value={formData.ambulancia?.id || ''}
            onChange={handleAmbulanciaChange}
          >
            <option value="">Selecione uma ambulância</option>
            {ambulancias.map(amb => (
              <option key={amb.id} value={amb.id}>
                {amb.placa} - {amb.tipo} ({amb.status})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Profissionais</label>
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px' }}>
            {profissionais.map(prof => (
              <div key={prof.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id={`prof-${prof.id}`}
                  checked={!!formData.profissionais.find(p => p.id === prof.id)}
                  onChange={() => handleProfissionalToggle(prof)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={`prof-${prof.id}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {prof.nome}
                  <span className={`badge badge-${prof.funcao.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    {prof.funcao}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EquipeForm;
