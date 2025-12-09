import axios from 'axios';

const api = axios.create({
  // CORREÇÃO: Adicionamos o prefixo '/api' aqui.
  // Isso faz com que api.post('/auth/login') vire '/api/auth/login'
  // O Proxy do Vite vê o '/api', intercepta e manda pro Python.
  baseURL: '/api', 
  
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;