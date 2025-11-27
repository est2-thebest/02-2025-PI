import React, { useState, useEffect } from 'react';
import ambulanciaService, { Ambulancia } from '../../services/ambulancia';
import '../ocorrencias/OcorrenciaForm.css';

interface AmbulanciaFormProps {
  ambulancia?: Ambulancia;
  onSalvar: () => void;
  onCancelar: () => void;
}

const AmbulanciaForm: React.FC<AmbulanciaFormProps> = ({ ambulancia, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState<Ambulancia>({
    placa: '',
    tipo: 'BASICA',
    status: 'DISPONIVEL',
    base: ''
  });
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    if (ambulancia) {
      setFormData({
        placa: ambulancia.placa || '',
        tipo: ambulancia.tipo || 'BASICA',
        status: ambulancia.status || 'DISPONIVEL',
        base: ambulancia.base || ''
      });
    }
  }, [ambulancia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarPlaca = (placa: string): boolean => {
    // Formato: ABC-1234 ou ABC1D234 (Mercosul)
    const regex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{3}$/;
    return regex.test(placa);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErro('');

    if (!validarPlaca(formData.placa)) {
      setErro('Placa inválida. Use o formato ABC-1234 ou ABC1D234');
      return;
    }

    if (!formData.base) {
      setErro('Base é obrigatória');
      return;
    }

    setSalvando(true);
    try {
      if (ambulancia?.id) {
        await ambulanciaService.atualizar(ambulancia.id, formData);
      } else {
        await ambulanciaService.criar(formData);
      }
      onSalvar();
    } catch (error: any) {
      console.error('Erro ao salvar ambulância:', error);
      setErro(error.response?.data?.message || 'Erro ao salvar ambulância');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{ambulancia ? 'Editar Ambulância' : 'Nova Ambulância'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {erro && (
          <div className="alert alert-error">
            {erro}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="placa">Placa *</label>
            <input
              id="placa"
              name="placa"
              type="text"
              value={formData.placa}
              onChange={handleChange}
              placeholder="ABC-1234"
              maxLength={8}
              style={{ textTransform: 'uppercase' }}
              required
            />
            <small>Formato: ABC-1234 ou ABC1D234</small>
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="BASICA">Básica</option>
              <option value="UTI">UTI</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="DISPONIVEL">Disponível</option>
              <option value="EM_ATENDIMENTO">Em Atendimento</option>
              <option value="EM_MANUTENCAO">Em Manutenção</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="base">Base *</label>
            <input
              id="base"
              name="base"
              type="text"
              value={formData.base}
              onChange={handleChange}
              placeholder="Nome da base"
              required
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

export default AmbulanciaForm;
