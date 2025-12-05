import api from './api';
import { AxiosResponse } from 'axios';

export interface Profissional {
  id?: number;
  nome: string;
  funcao: 'MEDICO' | 'ENFERMEIRO' | 'CONDUTOR';
  cref?: string;
  contato?: string;
  ativo: boolean;
}

const profissionalService = {
  listar: async (): Promise<Profissional[]> => {
    const resp: AxiosResponse<Profissional[]> = await api.get('/profissionais');
    return resp.data;
  },

  criar: async (dados: Profissional): Promise<Profissional> => {
    const resp: AxiosResponse<Profissional> = await api.post('/profissionais', dados);
    return resp.data;
  },

  atualizar: async (id: number, dados: Profissional): Promise<Profissional> => {
    const resp: AxiosResponse<Profissional> = await api.put(`/profissionais/${id}`, dados);
    return resp.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/profissionais/${id}`);
  },
};

export default profissionalService;
