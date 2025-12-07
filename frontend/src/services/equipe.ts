import api from './api';
import { AxiosResponse } from 'axios';
import { Profissional } from './profissional';

import { Ambulancia } from './ambulancia';

export interface Equipe {
  id?: number;
  descricao: string;
  ambulancia?: Ambulancia | null;
  profissionais: Profissional[];
  turno: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';
}

/**
 * Serviço de gerenciamento de equipes.
 */
const equipeService = {
  // Listar equipes e suas composições
  listar: async (): Promise<Equipe[]> => {
    const resp: AxiosResponse<Equipe[]> = await api.get('/equipes');
    return resp.data;
  },

  // Montagem de nova equipe
  criar: async (dados: Equipe): Promise<Equipe> => {
    const resp: AxiosResponse<Equipe> = await api.post('/equipes', dados);
    return resp.data;
  },

  atualizar: async (id: number, dados: Equipe): Promise<Equipe> => {
    const resp: AxiosResponse<Equipe> = await api.put(`/equipes/${id}`, dados);
    return resp.data;
  },

  // Desfaz equipe (libera profissionais)
  excluir: async (id: number): Promise<void> => {
    await api.delete(`/equipes/${id}`);
  },
};

export default equipeService;
