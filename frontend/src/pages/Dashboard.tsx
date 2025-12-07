import React, { useState, useEffect } from 'react';
import ocorrenciaService, { Ocorrencia } from '../services/ocorrencia';
import ambulanciaService from '../services/ambulancia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import { getCorGravidade, getCorStatus } from '../utils/helpers';

import { Siren, Ambulance, CheckCircle, Timer } from 'lucide-react';

import './Dashboard.css';

interface Stats {
  ocorrenciasAbertas: number;
  ambulanciasDisponiveis: number;
  atendimentosHoje: number;
  tempoMedioResposta: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    ocorrenciasAbertas: 0,
    ambulanciasDisponiveis: 0,
    atendimentosHoje: 0,
    tempoMedioResposta: 0,
  });

  const [ocorrenciasRecentes, setOcorrenciasRecentes] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async (): Promise<void> => {
    try {
      // Don't set loading to true on subsequent polls to avoid flickering
      // setCarregando(true); 

      const [ocorrencias, ambulancias] = await Promise.all([
        ocorrenciaService.listarAbertas(),
        ambulanciaService.listarDisponiveis(),
      ]);

      setStats({
        ocorrenciasAbertas: ocorrencias.length,
        ambulanciasDisponiveis: ambulancias.length,
        atendimentosHoje: 0, // Backend doesn't provide this yet, keeping 0 or could fetch from history
        tempoMedioResposta: 0, // Backend doesn't provide this yet
      });

      setOcorrenciasRecentes(ocorrencias.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Banner
        title="Dashboard"
        subtitle="Visão geral do sistema de emergências"
      />

      <div className="stats-grid">
        {/* Ocorrências Abertas – vermelho */}
        <div className="stat-card stat-primary">
          <Siren size={48} className="stat-icon stat-icon-primary" />
          <div>
            <h3>{stats.ocorrenciasAbertas}</h3>
            <p>Ocorrências Abertas</p>
          </div>
        </div>

        {/* Atendimentos Hoje – azul */}
        <div className="stat-card stat-secondary">
          <CheckCircle size={48} className="stat-icon stat-icon-secondary" />
          <div>
            <h3>{stats.atendimentosHoje}</h3>
            <p>Atendimentos Hoje</p>
          </div>
        </div>

        {/* Ambulâncias Disponíveis – vermelho */}
        <div className="stat-card stat-primary">
          <Ambulance size={48} className="stat-icon stat-icon-primary" />
          <div>
            <h3>{stats.ambulanciasDisponiveis}</h3>
            <p>Ambulâncias Disponíveis</p>
          </div>
        </div>

        {/* Tempo Médio – azul */}
        <div className="stat-card stat-secondary">
          <Timer size={48} className="stat-icon stat-icon-secondary" />
          <div>
            <h3>{stats.tempoMedioResposta} min</h3>
            <p>Tempo Médio de Resposta</p>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h2>Ocorrências Recentes</h2>
        </div>
        <div className="card-body">
          {ocorrenciasRecentes.length === 0 ? (
            <p className="text-center">Nenhuma ocorrência aberta</p>
          ) : (
            <div className="ocorrencias-table">
              {ocorrenciasRecentes.map((oc) => (
                <div key={oc.id} className="ocorrencia-row">
                  <span className="col-id">#{oc.id}</span>
                  <span className="col-local">{oc.bairro?.nome || 'Local não informado'}</span>
                  <span
                    className="col-gravidade"
                    style={{ color: getCorGravidade(oc.gravidade) }}
                  >
                    {oc.gravidade}
                  </span>
                  <span
                    className="col-status"
                    style={{ color: getCorStatus(oc.status) }}
                  >
                    {oc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
