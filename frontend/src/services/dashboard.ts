import api from './api';

export interface DashboardStats {
  ocorrenciasAbertas: number;
  atendimentosHoje: number;
  ambulanciasDisponiveis: number;
  ambulanciasTotal: number;
  equipesAtivas: number;
  profissionaisCadastrados: number;
}

/**
 * Serviço de dados do Dashboard.
 * Visualização de Indicadores.
 */
const getStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

export default {
  getStats,
};
