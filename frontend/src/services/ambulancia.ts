import api from './api';
import { AxiosResponse } from 'axios';

import { Bairro } from './bairro';

export interface Ambulancia {
  id?: number;
  placa: string;
  tipo: 'USA' | 'USB';
  status: 'DISPONIVEL' | 'EM_ATENDIMENTO' | 'EM_MANUTENCAO' | 'INATIVA' | 'SEM_EQUIPE';
  bairro?: Bairro;
}

/**
 * Serviço de gerenciamento de ambulâncias.
 */
const ambulanciaService = {
  // Listar todas as ambulâncias
  async listar(): Promise<Ambulancia[]> {
    const response: AxiosResponse<Ambulancia[]> = await api.get('/ambulancias');
    return response.data;
  },

  async listarTodas(): Promise<Ambulancia[]> {
    const response: AxiosResponse<Ambulancia[]> = await api.get('/ambulancias');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Ambulancia> {
    const response: AxiosResponse<Ambulancia> = await api.get(`/ambulancias/${id}`);
    return response.data;
  },

  // Cadastrar nova ambulância
  async criar(ambulancia: Ambulancia): Promise<Ambulancia> {
    const response: AxiosResponse<Ambulancia> = await api.post('/ambulancias', ambulancia);
    return response.data;
  },

  // Atualizar dados da ambulância
  async atualizar(id: number, ambulancia: Ambulancia): Promise<Ambulancia> {
    const response: AxiosResponse<Ambulancia> = await api.put(`/ambulancias/${id}`, ambulancia);
    return response.data;
  },

  // Exclusão 
  async excluir(id: number): Promise<void> {
    await api.delete(`/ambulancias/${id}`);
  },

  async listarDisponiveis(): Promise<Ambulancia[]> {
    const response: AxiosResponse<Ambulancia[]> = await api.get('/ambulancias/disponiveis');
    return response.data;
  },

  async listarPorTipo(tipo: string): Promise<Ambulancia[]> {
    const response: AxiosResponse<Ambulancia[]> = await api.get(`/ambulancias/tipo/${tipo}`);
    return response.data;
  },

  async listarPorBase(baseId: number): Promise<Ambulancia[]> {
    const response: AxiosResponse<Ambulancia[]> = await api.get(`/ambulancias/base/${baseId}`);
    return response.data;
  }
};

export default ambulanciaService;
