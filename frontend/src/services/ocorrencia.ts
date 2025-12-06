import api from './api';
import { AxiosResponse } from 'axios';

import { Bairro } from './bairro';

export interface Ocorrencia {
	id?: number;
	bairro?: Bairro | null;
	tipo: string;
	gravidade: 'ALTA' | 'MEDIA' | 'BAIXA';
	status: 'ABERTA' | 'DESPACHADA' | 'EM_ATENDIMENTO' | 'CONCLUIDA' | 'CANCELADA';
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
	},

	async excluir(id: number): Promise<void> {
		await api.delete(`/ocorrencias/${id}`);
	},

	async confirmarSaida(id: number): Promise<void> {
		await api.post(`/ocorrencias/${id}/confirmar-saida`);
	},

	async concluir(id: number): Promise<void> {
		await api.post(`/ocorrencias/${id}/concluir`);
	},

	async cancelar(id: number): Promise<void> {
		await api.post(`/ocorrencias/${id}/cancelar`);
	}
};

export default ocorrenciaService;
