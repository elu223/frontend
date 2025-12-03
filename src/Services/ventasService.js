import axios from 'axios';

const API_URL = "http://localhost:5000";

export const getVentas = () => {
  return axios.get(`${API_URL}/api/ventas`);
};

export const getVentasHoy = () => {
  return axios.get(`${API_URL}/api/ventas/hoy`);
};

export const getVentasMes = () => {
  return axios.get(`${API_URL}/api/ventas/mes`);
};

export const getVentasPendientes = () => {
  return axios.get(`${API_URL}/api/ventas/pendientes`);
};

export const getEstadisticas = () => {
  return axios.get(`${API_URL}/api/ventas/estadisticas`);
};