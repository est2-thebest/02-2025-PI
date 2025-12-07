import api from './api';

export interface DashboardStats {
  ocorrenciasAbertas: number;
  atendimentosHoje: number;
  ambulanciasDisponiveis: number;
  ambulanciasTotal: number;
  equipesAtivas: number;
  profissionaisCadastrados: number;
}

const getStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/dashboard');
  return response.data;
};

export default {
  getStats,
};
