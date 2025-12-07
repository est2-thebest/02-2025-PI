import api from './api';
import { AxiosResponse } from 'axios';

import { Bairro } from './bairro';

export interface Ocorrencia {
	id?: number;
	bairro?: Bairro | null;
	tipo: string;
	gravidade: 'ALTA' | 'MEDIA' | 'BAIXA';
	status: 'ABERTA' | 'DESPACHADA' | 'EM_ATENDIMENTO' | 'CONCLUIDA' | 'CANCELADA';
	dataHoraAbertura: string;
	dataHoraFechamento?: string;
	observacao: string;
}

export interface OcorrenciaHistorico {
	id: number;
	statusAnterior: string | null;
	statusNovo: string;
	dataHora: string;
	observacao: string;
}

export interface OcorrenciaDetalhes {
	ocorrencia: Ocorrencia;
	atendimento?: {
		id: number;
		dataHoraDespacho: string;
		dataHoraChegada?: string;
		distanciaKm?: number;
		tempoEstimado?: number;
		ambulancia?: {
			id: number;
			placa: string;
			tipo: string;
			bairro?: {
				nome: string;
			};
		};
		rota?: string;
	};
	equipe?: {
		descricao: string;
		profissionais: Array<{
			nome: string;
			funcao: string;
		}>;
	};
	historico: OcorrenciaHistorico[];
}

const ocorrenciaService = {
	// [Requisitos Especificos - RF01] Listar ocorrencias abertas para monitoramento
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

	// [Requisitos Especificos - RF01] Cadastro de nova ocorrencia
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

	async concluirAtendimento(id: number): Promise<void> {
		await api.post(`/ocorrencias/${id}/concluir`);
	},

	async cancelar(id: number, justificativa?: string): Promise<void> {
		await api.post(`/ocorrencias/${id}/cancelar`, { justificativa });
	},

	// [Requisitos Especificos - RF07] Consulta detalhada com historico
	async buscarDetalhes(id: number): Promise<OcorrenciaDetalhes> {
		const response: AxiosResponse<OcorrenciaDetalhes> = await api.get(`/ocorrencias/${id}/detalhes`);
		return response.data;
	},

	async buscarHistorico(id: number): Promise<OcorrenciaHistorico[]> {
		const response: AxiosResponse<OcorrenciaHistorico[]> = await api.get(`/ocorrencias/${id}/historico`);
		return response.data;
	}
};

export default ocorrenciaService;
