import React, { useState, useEffect } from 'react';
import { Equipe } from '../../services/equipe';
import { Users, Ambulance as AmbulanceIcon, Edit, Trash2 } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

interface EquipeListProps {
  equipes: Equipe[];
  onEdit: (equipe: Equipe) => void;
  onDelete: (id: number) => void;
  viewMode: 'grid' | 'list';
}

const EquipeList: React.FC<EquipeListProps> = ({ equipes, onEdit, onDelete, viewMode }) => {
  const [equipeParaExcluir, setEquipeParaExcluir] = useState<number | null>(null);

  const confirmarExclusao = (id: number) => {
    setEquipeParaExcluir(id);
  };

  const handleExcluir = () => {
    if (equipeParaExcluir) {
      onDelete(equipeParaExcluir);
      setEquipeParaExcluir(null);
    }
  };

  if (equipes.length === 0) {
    return (
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-body text-center">
          <p>Nenhuma equipe encontrada</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="card">
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Descrição</th>
                <th style={{ padding: '12px' }}>Turno</th>
                <th style={{ padding: '12px' }}>Ambulância</th>
                <th style={{ padding: '12px' }}>Profissionais</th>
                <th style={{ padding: '12px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipes.map((equipe) => (
                <tr key={equipe.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px' }}>{equipe.descricao}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>{equipe.turno}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {equipe.ambulancia ? (
                      <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--warning)', color: 'black' }}>
                        <AmbulanceIcon size={14} /> {equipe.ambulancia.placa}
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: 'var(--text-secondary)', color: 'white' }}>Sem Ambulância</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {equipe.profissionais.map((p) => (
                        <span key={p.id} className="badge" style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                          {p.nome.split(' ')[0]} ({p.funcao[0]})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        onClick={() => onEdit(equipe)}
                        title="Editar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => equipe.id && confirmarExclusao(equipe.id)}
                        title="Excluir"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="profissionais-grid">
      {equipes.map((equipe) => (
        <div key={equipe.id} className="profissional-card">
          <div className="profissional-avatar" style={{ background: 'var(--bg-secondary)' }}>
            <Users size={40} color="var(--primary)" />
          </div>

          <div className="profissional-info">
            <h3>{equipe.descricao}</h3>
            <span className="badge badge-secondary" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{equipe.turno}</span>
            {equipe.ambulancia ? (
              <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '8px', backgroundColor: 'var(--warning)', color: 'black' }}>
                <AmbulanceIcon size={14} /> {equipe.ambulancia.placa}
              </span>
            ) : (
              <span className="badge" style={{ marginTop: '8px', backgroundColor: 'var(--text-secondary)', color: 'white' }}>Sem Ambulância</span>
            )}
          </div>

          <div className="profissional-detalhes">
            <div className="detalhe-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <span className="detalhe-label">Profissionais:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {equipe.profissionais.map((p) => (
                  <span key={p.id} className="badge" style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                    {p.nome.split(' ')[0]} ({p.funcao[0]})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => onEdit(equipe)}
            >
              <Edit size={16} /> Editar
            </button>
            <button
              className="btn btn-danger"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              onClick={() => equipe.id && confirmarExclusao(equipe.id)}
            >
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={!!equipeParaExcluir}
        title="Excluir Equipe"
        message="Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita."
        onConfirm={handleExcluir}
        onCancel={() => setEquipeParaExcluir(null)}
        isDangerous
        type="warning"
      />
    </div>
  );
};

export default EquipeList;
