import axios, { AxiosInstance } from 'axios';

const API_BASE: string = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
