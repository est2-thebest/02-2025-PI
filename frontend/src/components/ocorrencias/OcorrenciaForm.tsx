import React, { useState, useEffect } from 'react';
import ocorrenciaService, { Ocorrencia } from '../../services/ocorrencia';
import bairroService, { Bairro } from '../../services/bairro';
import Modal from '../common/Modal';
import './OcorrenciaForm.css';

interface OcorrenciaFormProps {
  isOpen: boolean;
  ocorrencia?: Ocorrencia;
  onSalvar: () => void;
  onCancelar: () => void;
}

const OcorrenciaForm: React.FC<OcorrenciaFormProps> = ({ isOpen, ocorrencia, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState<Ocorrencia>({
    bairro: null,
    tipo: '',
    gravidade: 'MEDIA',
    status: 'ABERTA',
    observacao: '',
  });
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    carregarBairros();
  }, []);

  useEffect(() => {
    if (ocorrencia) {
      setFormData({
        bairro: ocorrencia.bairro || null,
        tipo: ocorrencia.tipo || '',
        gravidade: ocorrencia.gravidade || 'MEDIA',
        status: ocorrencia.status || 'ABERTA',
        observacao: ocorrencia.observacao || '',
      });
    } else {
      setFormData({
        bairro: null,
        tipo: '',
        gravidade: 'MEDIA',
        status: 'ABERTA',
        observacao: '',
      });
    }
  }, [ocorrencia, isOpen]);

  const carregarBairros = async () => {
    try {
      const dados = await bairroService.listar();
      setBairros(dados);
    } catch (error) {
      console.error('Erro ao carregar bairros:', error);
      setErro('Erro ao carregar lista de bairros');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBairroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bairroId = Number(e.target.value);
    const bairro = bairros.find(b => b.id === bairroId) || null;
    setFormData(prev => ({ ...prev, bairro }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErro('');

    if (!formData.bairro || !formData.tipo) {
      setErro('Bairro e Tipo são obrigatórios');
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
    } catch (error: any) {
      console.error('Erro ao salvar ocorrência:', error);
      setErro(error.response?.data?.message || 'Erro ao salvar ocorrência');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={ocorrencia ? 'Editar Ocorrência' : 'Nova Ocorrência'}
      onClose={onCancelar}
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" form="ocorrencia-form" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      }
    >
      <form id="ocorrencia-form" onSubmit={handleSubmit}>
        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bairro">Bairro *</label>
            <select
              id="bairro"
              value={formData.bairro?.id || ''}
              onChange={handleBairroChange}
              required
            >
              <option value="">Selecione um bairro</option>
              {bairros.map(bairro => (
                <option key={bairro.id} value={bairro.id}>
                  {bairro.nome}
                </option>
              ))}
            </select>
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
              <option value="">Selecione o tipo</option>
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
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Média</option>
              <option value="BAIXA">Baixa</option>
            </select>
          </div>

          {ocorrencia && (
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="ABERTA">Aberta</option>
                <option value="DESPACHADA">Despachada</option>
                <option value="ATENDENDO">Atendendo</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="observacao">Observações</label>
            <textarea
              id="observacao"
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Digite observações relevantes..."
              rows={4}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default OcorrenciaForm;
