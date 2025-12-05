import React, { useState, useEffect } from 'react';
import { Ambulancia } from '../../services/ambulancia';
import bairroService, { Bairro } from '../../services/bairro';
import { X, Save } from 'lucide-react';

interface AmbulanciaFormProps {
  isOpen: boolean;
  ambulancia?: Ambulancia | null;
  onSalvar: (dados: Ambulancia) => Promise<void>;
  onCancelar: () => void;
}

const AmbulanciaForm: React.FC<AmbulanciaFormProps> = ({
  isOpen,
  ambulancia,
  onSalvar,
  onCancelar,
}) => {
  const [formData, setFormData] = useState<Partial<Ambulancia>>({
    placa: '',
    tipo: 'BASICA',
    status: 'DISPONIVEL',
    base: undefined
  });
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isOpen) {
      carregarBairros();
      if (ambulancia) {
        setFormData({ ...ambulancia });
      } else {
        setFormData({
          placa: '',
          tipo: 'BASICA',
          status: 'DISPONIVEL',
          base: undefined
        });
      }
      setErro('');
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

    if (name === 'baseId') {
      const selectedBairro = bairros.find(b => b.id === Number(value));
      setFormData(prev => ({ ...prev, base: selectedBairro }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      await onSalvar(formData as Ambulancia);
    } catch (error) {
      setErro('Erro ao salvar ambulância. Verifique os dados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{ambulancia ? 'Editar Ambulância' : 'Nova Ambulância'}</h2>
          <button className="btn-close" onClick={onCancelar}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Placa</label>
            <input
              type="text"
              name="placa"
              value={formData.placa || ''}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="ABC-1234"
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select
              name="tipo"
              value={formData.tipo || 'BASICA'}
              onChange={handleChange}
              className="form-control"
            >
              <option value="BASICA">Básica (Suporte Básico)</option>
              <option value="UTI">UTI (Suporte Avançado)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status || 'DISPONIVEL'}
              onChange={handleChange}
              className="form-control"
            >
              <option value="DISPONIVEL">Disponível</option>
              <option value="OCUPADA">Ocupada</option>
              <option value="MANUTENCAO">Manutenção</option>
            </select>
          </div>

          <div className="form-group">
            <label>Base (Localização)</label>
            <select
              name="baseId"
              value={formData.base?.id || ''}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Selecione uma base...</option>
              {bairros.map(bairro => (
                <option key={bairro.id} value={bairro.id}>
                  {bairro.nome}
                </option>
              ))}
            </select>
          </div>

          {erro && <div className="alert alert-error">{erro}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} style={{ marginRight: '8px' }} />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmbulanciaForm;
