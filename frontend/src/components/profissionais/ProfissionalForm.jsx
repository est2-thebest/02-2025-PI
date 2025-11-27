import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../ocorrencias/OcorrenciaForm.css';

const ProfissionalForm = ({ profissional, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    funcao: 'ENFERMEIRO',
    contato: '',
    ativo: true
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (profissional) {
      setFormData({
        nome: profissional.nome || '',
        funcao: profissional.funcao || 'ENFERMEIRO',
        contato: profissional.contato || '',
        ativo: profissional.ativo !== undefined ? profissional.ativo : true
      });
    }
  }, [profissional]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatarTelefone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatarTelefone(e.target.value);
    setFormData(prev => ({ ...prev, contato: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!formData.nome || !formData.funcao) {
      setErro('Nome e Função são obrigatórios');
      return;
    }

    setSalvando(true);
    try {
      if (profissional?.id) {
        await api.put(`/profissionais/${profissional.id}`, formData);
      } else {
        await api.post('/profissionais', formData);
      }
      onSalvar();
    } catch (error) {
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
        {erro && (
          <div className="alert alert-error">
            {erro}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Dr. João Silva"
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
            <label htmlFor="contato">Contato / Telefone</label>
            <input
              id="contato"
              name="contato"
              type="text"
              value={formData.contato}
              onChange={handleTelefoneChange}
              placeholder="(XX) XXXXX-XXXX"
              maxLength="15"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ativo">
              <input
                id="ativo"
                name="ativo"
                type="checkbox"
                checked={formData.ativo}
                onChange={handleChange}
                style={{ width: 'auto', marginRight: '0.5rem' }}
              />
              Profissional Ativo
            </label>
          </div>
        </div>

        <div className="alert alert-info">
          <strong>Informações sobre Funções:</strong><br />
          <strong>Médico:</strong> Obrigatório em ambulâncias UTI<br />
          <strong>Enfermeiro:</strong> Obrigatório em ambulâncias UTI e Básica<br />
          <strong>Condutor:</strong> Obrigatório em todas as ambulâncias
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={salvando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfissionalForm;