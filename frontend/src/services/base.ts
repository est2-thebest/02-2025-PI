// import api from './api';
// import { AxiosResponse } from 'axios';

// interface BaseService {
// 	id?: number;
// 	nome: string;
// 	endereco: string;
// 	cidade: string;
// 	responsavel: string;
// }

// const baseService = {
//   listar: async (): Promise<BaseService[]> => {
//     const resp: AxiosResponse<BaseService[]> = await api.get('/bases');
//     return resp.data;
//   },

//   criar: async (dados: BaseService): Promise<BaseService> => {
//     const resp: AxiosResponse<BaseService> = await api.post('/bases', dados);
//     return resp.data;
//   },

//   atualizar: async (id: number, dados: BaseService): Promise<BaseService> => {
//     const resp: AxiosResponse<BaseService> = await api.put(`/bases/${id}`, dados);
//     return resp.data;
//   },

//   excluir: async (id: number): Promise<void> => {
//     await api.delete(`/bases/${id}`);
//   },
// };

// export default baseService;
