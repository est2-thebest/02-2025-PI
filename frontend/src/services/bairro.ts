import api from './api';
import { AxiosResponse } from 'axios';

export interface Bairro {
  id: number;
  nome: string;
}

/**
 * Serviço de consulta de bairros (mapa).
 */
const bairroService = {
  // Listagem de localidades atendidas
  listar: async (): Promise<Bairro[]> => {
    const resp: AxiosResponse<Bairro[]> = await api.get('/bairros');
    return resp.data;
  },
};

export default bairroService;
