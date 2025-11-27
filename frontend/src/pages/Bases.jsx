import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Plus, MapPin, Building2, Pencil, Trash } from 'lucide-react';
import baseService from '../services/base';
import './Bases.css';

const Bases = () => {
  const [bases, setBases] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoBase, setEditandoBase] = useState(null);

  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    responsavel: '',
  });

  useEffect(() => {
    carregarBases();
  }, []);

  const carregarBases = async () => {
    try {
      setCarregando(true);
      const dados = await baseService.listar();
      setBases(dados);
    } catch (erro) {
      console.error('Erro ao carregar bases:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalCriar = () => {
    setEditandoBase(null);
    setForm({
      nome: '',
      endereco: '',
      cidade: '',
      responsavel: '',
    });
    setModalAberto(true);
  };

  const abrirModalEditar = (base) => {
    setEditandoBase(base.id);
    setForm({
      nome: base.nome,
      endereco: base.endereco,
      cidade: base.cidade,
      responsavel: base.responsavel,
    });
    setModalAberto(true);
  };

  const salvarBase = async () => {
    try {
      if (editandoBase) {
        await baseService.atualizar(editandoBase, form);
      } else {
        await baseService.criar(form);
      }
      setModalAberto(false);
      carregarBases();
    } catch (erro) {
      console.error('Erro ao salvar base:', erro);
    }
  };

  const excluirBase = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta base?')) return;

    try {
      await baseService.excluir(id);
      carregarBases();
    } catch (erro) {
      console.error('Erro ao excluir base:', erro);
    }
  };

  if (carregando) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando bases..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Bases de Atendimento</h1>
          <p>Gerenciamento de bases e localizações</p>
        </div>

        <button className="btn btn-primary" onClick={abrirModalCriar}>
          <Plus size={20} />
          Nova Base
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {bases.length === 0 ? (
            <p className="empty-message">Nenhuma base cadastrada</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>Cidade</th>
                    <th>Responsável</th>
                    <th style={{ width: '120px' }}>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {bases.map((base) => (
                    <tr key={base.id}>
                      <td>
                        <strong>{base.nome}</strong>
                      </td>
                      <td>{base.endereco}</td>
                      <td>{base.cidade}</td>
                      <td>{base.responsavel || '—'}</td>

                      <td className="action-buttons">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => abrirModalEditar(base)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => excluirBase(base.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editandoBase ? 'Editar Base' : 'Nova Base'}</h2>

            <div className="form-group">
              <label>Nome da base</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Endereço</label>
              <input
                type="text"
                value={form.endereco}
                onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                value={form.cidade}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Responsável</label>
              <input
                type="text"
                value={form.responsavel}
                onChange={(e) =>
                  setForm({ ...form, responsavel: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={salvarBase}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bases;
