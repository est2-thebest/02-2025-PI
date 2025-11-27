import { useState, useEffect } from 'react';
import ocorrenciaService from '../../services/ocorrencia';
import './OcorrenciaForm.css';

const OcorrenciaForm = ({ ocorrencia, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState({
    local: '',
    tipo: '',
    gravidade: 'MEDIA',
    status: 'ABERTA',
    observacao: '',
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (ocorrencia) {
      setFormData({
        local: ocorrencia.local || '',
        tipo: ocorrencia.tipo || '',
        gravidade: ocorrencia.gravidade || 'MEDIA',
        status: ocorrencia.status || 'ABERTA',
        observacao: ocorrencia.observacao || '',
      });
    }
  }, [ocorrencia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!formData.local || !formData.tipo) {
      setErro('Local e Tipo são obrigatórios');
      return;
    }

    setSalvando(true);
    try {
      if (ocorrencia?.id) {
        await ocorrenciaService.atualizar(ocorrencia.id, formData);
      } else {
        await ocorrenciaService.criar(formData);
      }
      onSalvar();
    } catch (error) {
      console.error('Erro ao salvar ocorrência:', error);
      setErro(error.response?.data?.message || 'Erro ao salvar ocorrência');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{ocorrencia ? 'Editar Ocorrência' : 'Nova Ocorrência'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="local">Local / Bairro *</label>
            <input
              id="local"
              name="local"
              type="text"
              value={formData.local}
              onChange={handleChange}
              placeholder="Ex: Jardim América"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Ocorrência *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="ACIDENTE_TRANSITO">Acidente de Trânsito</option>
              <option value="MAL_SUBITO">Mal Súbito</option>
              <option value="TRAUMA">Trauma</option>
              <option value="QUEDA">Queda</option>
              <option value="INTOXICACAO">Intoxicação</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gravidade">Gravidade *</label>
            <select
              id="gravidade"
              name="gravidade"
              value={formData.gravidade}
              onChange={handleChange}
              required
            >
              <option value="ALTA">Alta (SLA: 8 min - UTI)</option>
              <option value="MEDIA">Média (SLA: 15 min - Básica)</option>
              <option value="BAIXA">Baixa (SLA: 30 min - Básica)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ABERTA">Aberta</option>
              <option value="DESPACHADA">Despachada</option>
              <option value="EM_ATENDIMENTO">Em Atendimento</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="observacao">Observações</label>
          <textarea
            id="observacao"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            placeholder="Informações adicionais sobre a ocorrência..."
            rows="4"
          />
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
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OcorrenciaForm;
