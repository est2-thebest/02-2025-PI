import React from 'react';

interface ProfissionalFormProps {
  profissional?: any;
  onSalvar: () => void;
  onCancelar: () => void;
}

const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ profissional, onSalvar, onCancelar }) => {
  const [formData, setFormData] = React.useState({
    nome: profissional?.nome || '',
    funcao: profissional?.funcao || 'MEDICO',
    cref: profissional?.cref || '',
    ativo: profissional?.ativo ?? true,
  });
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState('');

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
    <div className="form-container">
      <div className="form-header">
        <h2>{profissional ? 'Editar Profissional' : 'Novo Profissional'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
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
            <label htmlFor="cref">CREF/Registro</label>
            <input
              id="cref"
              name="cref"
              type="text"
              value={formData.cref}
              onChange={handleChange}
              placeholder="Número de registro profissional"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfissionalForm;
