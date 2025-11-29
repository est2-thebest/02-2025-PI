import React from 'react';
import Modal from '../common/Modal';

interface ProfissionalFormProps {
  isOpen: boolean;
  profissional?: any;
  onSalvar: () => void;
  onCancelar: () => void;
}

const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ isOpen, profissional, onSalvar, onCancelar }) => {
  const [formData, setFormData] = React.useState({
    nome: profissional?.nome || '',
    funcao: profissional?.funcao || 'MEDICO',
    contato: profissional?.contato || '',
    ativo: profissional?.ativo ?? true,
  });

  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState('');

  // Atualiza o form quando abrir o modal para edição
  React.useEffect(() => {
    setFormData({
      nome: profissional?.nome || '',
      funcao: profissional?.funcao || 'MEDICO',
      contato: profissional?.contato || '',
      ativo: profissional?.ativo ?? true,
    });
  }, [profissional, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErro('');

    if (!formData.nome || !formData.funcao) {
      setErro('Nome e Função são obrigatórios');
      return;
    }

    setSalvando(true);
    try {
      onSalvar();
    } catch (error: any) {
      console.error('Erro ao salvar profissional:', error);
      setErro(error.response?.data?.message || 'Erro ao salvar profissional');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={profissional ? 'Editar Profissional' : 'Novo Profissional'}
      onClose={onCancelar}
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" form="profissional-form" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      }
    >
      <form id="profissional-form" onSubmit={handleSubmit}>
        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="funcao">Função *</label>
            <select
              id="funcao"
              name="funcao"
              value={formData.funcao}
              onChange={handleChange}
              required
            >
              <option value="MEDICO">Médico</option>
              <option value="ENFERMEIRO">Enfermeiro</option>
              <option value="CONDUTOR">Condutor</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contato">Contato *</label>
            <input
              id="contato"
              name="contato"
              type="tel"
              value={formData.contato}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProfissionalForm;
