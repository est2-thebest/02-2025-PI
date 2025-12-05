import React, { useState, useEffect } from 'react';
import equipeService, { Equipe } from '../../services/equipe';
import LoadingSpinner from '../common/LoadingSpinner';
import { Users, Ambulance as AmbulanceIcon } from 'lucide-react';

interface EquipeListProps {
  onEdit: (equipe: Equipe) => void;
}

const EquipeList: React.FC<EquipeListProps> = ({ onEdit }) => {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    carregarEquipes();
  }, []);

  const carregarEquipes = async (): Promise<void> => {
    try {
      setCarregando(true);
      const dados = await equipeService.listar();
      setEquipes(dados);
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return <LoadingSpinner message="Carregando equipes..." />;
  }

  return (
    <div className="profissionais-grid">
      {equipes.length === 0 ? (
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-body text-center">
            <p>Nenhuma equipe encontrada</p>
          </div>
        </div>
      ) : (
        equipes.map((equipe) => (
          <div key={equipe.id} className="profissional-card">
            <div className="profissional-avatar" style={{ background: 'var(--bg-secondary)' }}>
              <Users size={40} color="var(--primary)" />
            </div>

            <div className="profissional-info">
              <h3>{equipe.descricao}</h3>
              {equipe.ambulancia ? (
                <span className="badge badge-condutor" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  <AmbulanceIcon size={14} /> {equipe.ambulancia.placa}
                </span>
              ) : (
                <span className="badge badge-secondary">Sem Ambulância</span>
              )}
            </div>

            <div className="profissional-detalhes">
              <div className="detalhe-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <span className="detalhe-label">Profissionais:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {equipe.profissionais.map((p) => (
                    <span key={p.id} className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                      {p.nome.split(' ')[0]} ({p.funcao[0]})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-block"
              onClick={() => onEdit(equipe)}
            >
              Editar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default EquipeList;
