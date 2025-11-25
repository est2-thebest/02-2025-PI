import api from './api';

const ambulanciaService = {
  async listarTodas() {
    const response = await api.get('/ambulancias');
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/ambulancias/${id}`);
    return response.data;
  },

  async criar(ambulancia) {
    const response = await api.post('/ambulancias', ambulancia);
    return response.data;
  },

  async atualizar(id, ambulancia) {
    const response = await api.put(`/ambulancias/${id}`, ambulancia);
    return response.data;
  },

  async excluir(id) {
    const response = await api.delete(`/ambulancias/${id}`);
    return response.data;
  },

  async listarDisponiveis() {
    const response = await api.get('/ambulancias/disponiveis');
    return response.data;
  },

  async listarPorTipo(tipo) {
    const response = await api.get(`/ambulancias/tipo/${tipo}`);
    return response.data;
  },

  async listarPorBase(baseId) {
    const response = await api.get(`/ambulancias/base/${baseId}`);
    return response.data;
  }
};

export default ambulanciaService;