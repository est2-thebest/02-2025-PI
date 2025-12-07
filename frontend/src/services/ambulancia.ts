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

const ambulanciaService = {
  // [Requisitos Especificos - RF02] Listar todas as ambulancias
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

  // [Requisitos Especificos - RF02] Cadastrar nova ambulancia
  async criar(ambulancia: Ambulancia): Promise<Ambulancia> {
    const response: AxiosResponse<Ambulancia> = await api.post('/ambulancias', ambulancia);
    return response.data;
  },

  async atualizar(id: number, ambulancia: Ambulancia): Promise<Ambulancia> {
    const response: AxiosResponse<Ambulancia> = await api.put(`/ambulancias/${id}`, ambulancia);
    return response.data;
  },

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
