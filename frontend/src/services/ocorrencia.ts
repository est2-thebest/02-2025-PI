import api from './api';
import { AxiosResponse } from 'axios';

import { Bairro } from './bairro';

export interface Ocorrencia {
	id?: number;
	bairro?: Bairro | null;
	tipo: string;
	gravidade: 'ALTA' | 'MEDIA' | 'BAIXA';
	status: 'ABERTA' | 'DESPACHADA' | 'ATENDENDO' | 'CONCLUIDA' | 'CANCELADA';
	observacao: string;
}

const ocorrenciaService = {
	async listarAbertas(): Promise<Ocorrencia[]> {
		const response: AxiosResponse<Ocorrencia[]> = await api.get('/ocorrencias?status=ABERTA');
		return response.data;
	},

	async listarTodas(): Promise<Ocorrencia[]> {
		const response: AxiosResponse<Ocorrencia[]> = await api.get('/ocorrencias');
		return response.data;
	},

	async buscarPorId(id: number): Promise<Ocorrencia> {
		const response: AxiosResponse<Ocorrencia> = await api.get(`/ocorrencias/${id}`);
		return response.data;
	},

	async criar(payload: Ocorrencia): Promise<Ocorrencia> {
		const response: AxiosResponse<Ocorrencia> = await api.post('/ocorrencias', payload);
		return response.data;
	},

	async atualizar(id: number, payload: Ocorrencia): Promise<Ocorrencia> {
		const response: AxiosResponse<Ocorrencia> = await api.put(`/ocorrencias/${id}`, payload);
		return response.data;
	}
};

export default ocorrenciaService;
