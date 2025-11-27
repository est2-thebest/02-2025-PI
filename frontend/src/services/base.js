import api from './api';

const baseService = {
  listar: async () => {
    const resp = await api.get('/bases');
    return resp.data;
  },

  criar: async (dados) => {
    const resp = await api.post('/bases', dados);
    return resp.data;
  },

  atualizar: async (id, dados) => {
    const resp = await api.put(`/bases/${id}`, dados);
    return resp.data;
  },

  excluir: async (id) => {
    const resp = await api.delete(`/bases/${id}`);
    return resp.data;
  },
};

export default baseService;
