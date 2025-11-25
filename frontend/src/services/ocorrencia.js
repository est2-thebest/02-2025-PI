import api from './api';

const ocorrenciaService = {
	async listarAbertas() {
		const response = await api.get('/ocorrencias?status=ABERTA');
		return response.data;
	},

	async listarTodas() {
		const response = await api.get('/ocorrencias');
		return response.data;
	},

	async buscarPorId(id) {
		const response = await api.get(`/ocorrencias/${id}`);
		return response.data;
	},

	async criar(payload) {
		const response = await api.post('/ocorrencias', payload);
		return response.data;
	},

	async atualizar(id, payload) {
		const response = await api.put(`/ocorrencias/${id}`, payload);
		return response.data;
	}
};

export default ocorrenciaService;
