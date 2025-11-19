import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Switch } from 'wouter';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Configuración global de axios
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.timeout = 10000;

// Interceptor para agregar token automáticamente
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = user.token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');//para guardar los datos del usuario en localStorage
      window.dispatchEvent(new Event('storage'));
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Switch>
      <Route path="/" component={App} />
      <Route path="/carrito" component={App} />
      <Route path="/producto/:id" component={App} />
      <Route path="/miperfil" component={App} />
      <Route path="/iniciar-sesion" component={App} />
      <Route path="/registrarse" component={App} />
      <Route path="/admin" component={App} />
      <Route path="/compras" component={App} />
    </Switch>
  </React.StrictMode>,
);