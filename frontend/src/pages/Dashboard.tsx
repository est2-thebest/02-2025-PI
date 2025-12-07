import React, { useState, useEffect } from 'react';
import ocorrenciaService, { Ocorrencia } from '../services/ocorrencia';
import dashboardService, { DashboardStats } from '../services/dashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import { Ambulance, CheckCircle, Users, UserCheck } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    ocorrenciasAbertas: 0,
    ambulanciasDisponiveis: 0,
    ambulanciasTotal: 0,
    atendimentosHoje: 0,
    equipesAtivas: 0,
    profissionaisCadastrados: 0,
  });

  const [historicoOcorrencias, setHistoricoOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async (): Promise<void> => {
    try {
      const [statsData, ocorrenciasData] = await Promise.all([
        dashboardService.getStats(),
        ocorrenciaService.listarTodas(), // Fetch all for history
      ]);

      setStats(statsData);
      // Sort by ID descending for history
      setHistoricoOcorrencias(ocorrenciasData.sort((a, b) => (b.id || 0) - (a.id || 0)));
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

  // Calculate percentage for progress bar
  const frotaPercent = stats.ambulanciasTotal > 0
    ? (stats.ambulanciasDisponiveis / stats.ambulanciasTotal) * 100
    : 0;

  return (
    <div className="page-container">
      <Banner
        title="Dashboard"
        subtitle="Visão geral do sistema de emergências"
      />

      <div className="stats-grid">
        {/* [Requisitos Especificos - RF07] Exibicao de consultas de histórico de atendimentos */}
        {/* Profissionais Cadastrados – primário */}
        <div className="stat-card stat-primary">
          <UserCheck size={48} className="stat-icon stat-icon-primary" />
          <div>
            <h3>{stats.profissionaisCadastrados}</h3>
            <p>Profissionais Cadastrados</p>
          </div>
        </div>

        {/* Atendimentos Hoje – secundário */}
        <div className="stat-card stat-secondary">
          <CheckCircle size={48} className="stat-icon stat-icon-secondary" />
          <div>
            <h3>{stats.atendimentosHoje}</h3>
            <p>Atendimentos Hoje</p>
          </div>
        </div>

        {/* Ambulâncias Disponíveis – com barra de progresso */}
        <div className="stat-card stat-primary" style={{ display: 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Ambulance size={48} className="stat-icon stat-icon-primary" />
            <div>
              <h3>{stats.ambulanciasDisponiveis} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ {stats.ambulanciasTotal}</span></h3>
              <p>Ambulâncias Disponíveis</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${frotaPercent}%`,
                height: '100%',
                background: frotaPercent < 20 ? 'var(--danger)' : 'var(--success)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Equipes Ativas */}
        <div className="stat-card stat-secondary">
          <Users size={48} className="stat-icon stat-icon-secondary" />
          <div>
            <h3>{stats.equipesAtivas}</h3>
            <p>Equipes Cadastradas</p>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h2>Ocorrências Recentes</h2>
        </div>
        <div className="card-body">
          {historicoOcorrencias.length === 0 ? (
            <p className="text-center">Nenhuma ocorrência registrada</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Bairro</th>
                    <th>Gravidade</th>
                    <th>Status</th>
                    <th>Data Abertura</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoOcorrencias.slice(0, 10).map((oc) => (
                    <tr key={oc.id}>
                      <td>#{oc.id}</td>
                      <td>{oc.bairro?.nome || 'N/A'}</td>
                      <td>
                        <span className={`badge ${oc.gravidade}`}>
                          {oc.gravidade}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${oc.status}`}>
                          {oc.status}
                        </span>
                      </td>
                      <td>{new Date(oc.dataHoraAbertura).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {historicoOcorrencias.length > 10 && (
                <div className="text-center mt-2">
                  <small>Exibindo as 10 mais recentes...</small>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
