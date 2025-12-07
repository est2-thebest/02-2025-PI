import api from './api';
import { AxiosResponse } from 'axios';

export interface Profissional {
  id?: number;
  nome: string;
  funcao: 'MEDICO' | 'ENFERMEIRO' | 'MOTORISTA';
  cref?: string;
  contato?: string;
  ativo: boolean;
  turno?: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';
}

/**
 * Serviço de gerenciamento de profissionais.
 */
const profissionalService = {
  // Listagem de profissionais cadastrados
  listar: async (): Promise<Profissional[]> => {
    const resp: AxiosResponse<Profissional[]> = await api.get('/profissionais');
    return resp.data;
  },

  // Cadastro de novo profissional
  criar: async (dados: Profissional): Promise<Profissional> => {
    const resp: AxiosResponse<Profissional> = await api.post('/profissionais', dados);
    return resp.data;
  },

  atualizar: async (id: number, dados: Profissional): Promise<Profissional> => {
    const resp: AxiosResponse<Profissional> = await api.put(`/profissionais/${id}`, dados);
    return resp.data;
  },

  // Exclusão de profissional
  excluir: async (id: number): Promise<void> => {
    await api.delete(`/profissionais/${id}`);
  },
};

export default profissionalService;
