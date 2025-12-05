import React from 'react';
import Modal from '../common/Modal';
import { Profissional } from '../../services/profissional';
import { FormValidator } from '../../utils/FormValidator';

interface ProfissionalFormProps {
  isOpen: boolean;
  profissional?: Profissional | null;
  onSalvar: (dados: Profissional) => Promise<void>;
  onCancelar: () => void;
}

const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ isOpen, profissional, onSalvar, onCancelar }) => {
  const [formData, setFormData] = React.useState<Profissional>({
    nome: '',
    funcao: 'MEDICO',
    contato: '',
    ativo: true,
  });

  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState('');

  // Atualiza o form quando abrir o modal para edição
  React.useEffect(() => {
    if (profissional) {
      setFormData(profissional);
    } else {
      setFormData({
        nome: '',
        funcao: 'MEDICO',
        contato: '',
        ativo: true,
      });
    }
  }, [profissional, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.currentTarget;
    let newValue: any = type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value;

    // Máscara de telefone
    if (name === 'contato') {
      newValue = newValue.replace(/\D/g, '');
      if (newValue.length > 11) newValue = newValue.slice(0, 11);

      if (newValue.length > 6) {
        newValue = `(${newValue.slice(0, 2)}) ${newValue.slice(2, 7)}-${newValue.slice(7)}`;
      } else if (newValue.length > 2) {
        newValue = `(${newValue.slice(0, 2)}) ${newValue.slice(2)}`;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErro('');

    if (!formData.nome || !formData.funcao) {
      setErro('Nome e Função são obrigatórios');
      return;
    }

    // Validação de telefone
    const phoneValidation = FormValidator.validatePhone(formData.contato || '');
    if (!phoneValidation.valid) {
      setErro(phoneValidation.message);
      return;
    }

    setSalvando(true);
    try {
      await onSalvar(formData);
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

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
              />
              Ativo
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProfissionalForm;
