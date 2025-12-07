import api from './api';

export interface AtendimentoPorBairro {
  bairro: string;
  quantidade: number;
}

export interface TempoMedioPorTipo {
  tipoAmbulancia: string;
  tempoMedioMinutos: number;
}

/**
 * Serviço de relatórios e estatísticas.
 */
const relatorioService = {
  // Relatório de atendimentos por região
  getAtendimentosPorBairro: async (): Promise<AtendimentoPorBairro[]> => {
    const response = await api.get<any[]>('/relatorios/atendimentos-por-bairro');
    // Backend returns List<Object[]>: [String nome, Long count]
    return response.data.map(item => ({
      bairro: item[0],
      quantidade: item[1]
    }));
  },

  // Relatório de performance (tempo médio)
  getTempoMedioPorTipo: async (): Promise<TempoMedioPorTipo[]> => {
    const response = await api.get<any[]>('/relatorios/tempo-medio');
    // Backend returns List<Object[]>: [String tipo, Double avg_distance]
    // Assuming 1 km = 1 min as per rules
    return response.data.map(item => ({
      tipoAmbulancia: item[0],
      tempoMedioMinutos: item[1]
    }));
  }
};

export default relatorioService;
