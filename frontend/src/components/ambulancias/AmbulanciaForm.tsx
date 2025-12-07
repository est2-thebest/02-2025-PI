import React, { useState, useEffect } from 'react';
import { Ambulancia } from '../../services/ambulancia';
import bairroService, { Bairro } from '../../services/bairro';
import Modal from '../common/Modal';
import { FormValidator } from '../../utils/FormValidator';

interface AmbulanciaFormProps {
  isOpen: boolean;
  ambulancia?: Ambulancia | null;
  onSalvar: (dados: Ambulancia) => Promise<void>;
  onCancelar: () => void;
}

/**
 * Formulário para cadastro e edição de ambulâncias.
 */
const AmbulanciaForm: React.FC<AmbulanciaFormProps> = ({
  isOpen,
  ambulancia,
  onSalvar,
  onCancelar,
}) => {
  const [formData, setFormData] = useState<Partial<Ambulancia>>({
    placa: '',
    tipo: 'USB',
    status: 'DISPONIVEL',
    bairro: undefined
  });
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      carregarBairros();
      if (ambulancia) {
        setFormData({ ...ambulancia });
      } else {
        setFormData({
          placa: '',
          tipo: 'USB',
          status: 'DISPONIVEL',
          bairro: undefined
        });
      }
      setErro('');
      setValidationErrors({});
    }
  }, [isOpen, ambulancia]);

  const carregarBairros = async () => {
    try {
      const dados = await bairroService.listar();
      setBairros(dados);
    } catch (error) {
      console.error('Erro ao carregar bairros:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'bairroId') {
      const selectedBairro = bairros.find(b => b.id === Number(value));
      setFormData(prev => ({ ...prev, bairro: selectedBairro }));
    } else if (name === 'placa') {
      // Máscara para Placa
      let maskedValue = value.toUpperCase();

      // Remove caracteres inválidos
      maskedValue = maskedValue.replace(/[^A-Z0-9]/g, '');

      // Limita tamanho
      if (maskedValue.length > 7) {
        maskedValue = maskedValue.substring(0, 7);
      }

      setFormData(prev => ({ ...prev, [name]: maskedValue }));

      if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Limpar erro de validação ao digitar
      if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validar Placa
    if (!formData.placa) {
      errors.placa = 'Placa é obrigatória';
    } else {
      const placaValidation = FormValidator.validatePlaca(formData.placa);
      if (!placaValidation.valid) {
        errors.placa = placaValidation.message;
      }
    }

    // Validar Bairro
    if (!formData.bairro) {
      errors.bairroId = 'Bairro é obrigatório';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await onSalvar(formData as Ambulancia);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao salvar ambulância. Verifique os dados.';
      setErro(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={ambulancia ? 'Editar Ambulância' : 'Nova Ambulância'}
      onClose={onCancelar}
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            form="ambulancia-form"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </div>
      }
    >
      <form id="ambulancia-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Placa</label>
          <input
            type="text"
            name="placa"
            value={formData.placa || ''}
            onChange={handleChange}
            className={`form-control ${validationErrors.placa ? 'is-invalid' : ''}`}
            placeholder="ABC-1234"
          />
          {validationErrors.placa && <span className="error-text">{validationErrors.placa}</span>}
        </div>

        <div className="form-group">
          <label>Tipo</label>
          <select
            name="tipo"
            value={formData.tipo || 'USB'}
            onChange={handleChange}
            className="form-control"
            disabled={!!ambulancia}
          >
            <option value="USB">USB - Unidade de Saúde Básica</option>
            <option value="USA">USA - Unidade de Saúde Avançada</option>
          </select>
        </div>

        {ambulancia && (
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status || 'DISPONIVEL'}
              onChange={handleChange}
              className="form-control"
            >
              {/* <option value="DISPONIVEL">Disponível</option> */}
              <option value="INATIVA">Inativa</option>
              <option value="MANUTENCAO">Manutenção</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Bairro (Localização)</label>
          <select
            name="bairroId"
            value={formData.bairro?.id || ''}
            onChange={handleChange}
            className={`form-control ${validationErrors.bairroId ? 'is-invalid' : ''}`}
            disabled={!!ambulancia}
          >
            <option value="">Selecione um bairro...</option>
            {bairros.map(bairro => (
              <option key={bairro.id} value={bairro.id}>
                {bairro.nome}
              </option>
            ))}
          </select>
          {validationErrors.bairroId && <span className="error-text">{validationErrors.bairroId}</span>}
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
      </form>
    </Modal>
  );
};

export default AmbulanciaForm;
