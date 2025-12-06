import React, { useState } from 'react';
import { Ambulancia } from '../../services/ambulancia';
import ambulanciaService from '../../services/ambulancia';
import { Ambulance, MapPin, Activity, Edit, Trash2 } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

interface AmbulanciaListProps {
  ambulancias: Ambulancia[];
  onEdit: (ambulancia: Ambulancia) => void;
  viewMode: 'grid' | 'list';
}

const AmbulanciaList: React.FC<AmbulanciaListProps> = ({ ambulancias, onEdit, viewMode }) => {
  const [ambulanciaParaExcluir, setAmbulanciaParaExcluir] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL': return 'var(--success)';
      case 'OCUPADA': return 'var(--warning)';
      case 'MANUTENCAO': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  };

  const confirmarExclusao = (id: number) => {
    setAmbulanciaParaExcluir(id);
  };

  const handleExcluir = async () => {
    if (ambulanciaParaExcluir) {
      try {
        await ambulanciaService.excluir(ambulanciaParaExcluir);
        setAmbulanciaParaExcluir(null);
        // Recarregar a página para atualizar a lista (idealmente seria via prop de refresh)
        window.location.reload();
      } catch (error) {
        console.error('Erro ao excluir ambulância:', error);
        alert('Erro ao excluir ambulância. Verifique se ela não está vinculada a uma equipe.');
      }
    }
  };

  return (
    <>
      {viewMode === 'list' ? (
        <div className="card">
          <div className="card-body" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Placa</th>
                  <th style={{ padding: '12px' }}>Tipo</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Localização</th>
                  <th style={{ padding: '12px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ambulancias.map((ambulancia) => (
                  <tr key={ambulancia.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{ambulancia.placa}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge badge-${ambulancia.tipo.toLowerCase()}`}>
                        {ambulancia.tipo}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(ambulancia.status),
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}
                      >
                        {ambulancia.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{ambulancia.bairro?.nome || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-icon"
                          onClick={() => onEdit(ambulancia)}
                          title="Editar"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (ambulancia.id) confirmarExclusao(ambulancia.id);
                          }}
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
      ) : (
        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {ambulancias.map((ambulancia) => (
            <div key={ambulancia.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.75rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Ambulance size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{ambulancia.placa}</h3>
                    <span className={`badge badge-${ambulancia.tipo.toLowerCase()}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>
                      {ambulancia.tipo}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Activity size={16} />
                  <span
                    style={{
                      color: getStatusColor(ambulancia.status),
                      fontWeight: 500
                    }}
                  >
                    {ambulancia.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} />
                  <span>Localização: {ambulancia.bairro?.nome || 'Sem localização definida'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => onEdit(ambulancia)}
                >
                  <Edit size={16} /> Editar
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => ambulancia.id && confirmarExclusao(ambulancia.id)}
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!ambulanciaParaExcluir}
        title="Excluir Ambulância"
        message="Tem certeza que deseja excluir esta ambulância? Esta ação não pode ser desfeita."
        onConfirm={handleExcluir}
        onCancel={() => setAmbulanciaParaExcluir(null)}
        isDangerous
        type="warning"
      />
    </>
  );
};

export default AmbulanciaList;
