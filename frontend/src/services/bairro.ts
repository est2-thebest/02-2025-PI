import api from './api';
import { AxiosResponse } from 'axios';

export interface Bairro {
  id: number;
  nome: string;
}

const bairroService = {
  listar: async (): Promise<Bairro[]> => {
    const resp: AxiosResponse<Bairro[]> = await api.get('/bairros');
    return resp.data;
  },
};

export default bairroService;
