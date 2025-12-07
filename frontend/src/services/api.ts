// frontend/src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE: string = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';

/**
 * Configuração central do cliente HTTP (Axios).
 * Gerencia a comunicação com o backend e interceptação de requisições.
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token automaticamente em todas as requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isAuthRequest = config.url?.includes('/auth/login');

    if (!isAuthRequest) {
      const token = localStorage.getItem('sosrota_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
