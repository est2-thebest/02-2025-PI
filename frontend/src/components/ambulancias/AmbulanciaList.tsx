import React from 'react';
import { Ambulancia } from '../../services/ambulancia';
import { Ambulance, MapPin, Activity } from 'lucide-react';

interface AmbulanciaListProps {
  ambulancias: Ambulancia[];
  onEdit: (ambulancia: Ambulancia) => void;
  viewMode: 'grid' | 'list';
}

const AmbulanciaList: React.FC<AmbulanciaListProps> = ({ ambulancias, onEdit, viewMode }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL': return 'var(--success)';
      case 'OCUPADA': return 'var(--warning)';
      case 'MANUTENCAO': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="card">
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Placa</th>
                <th style={{ padding: '12px' }}>Tipo</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Base</th>
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
                  <td style={{ padding: '12px' }}>{ambulancia.base?.nome || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => onEdit(ambulancia)}
                    >
                      Editar
                    </button>
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
              <span>Base: {ambulancia.base?.nome || 'Sem base definida'}</span>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => onEdit(ambulancia)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
};

export default AmbulanciaList;
