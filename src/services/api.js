import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Tu backend en puerto 5000
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente a las peticiones
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
      window.location.href = '/iniciar-sesion';
    }
    return Promise.reject(error);
  }
);

export default api;