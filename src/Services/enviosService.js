import axios from "axios";

const API_URL = "http://localhost:5000/api/envios";

// Obtener todos los envíos
export const obtenerEnvios = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Crear envío
export const crearEnvio = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

// Editar envío
export const actualizarEnvio = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

// Eliminar envío
export const eliminarEnvioPorId = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

// Marcar enviado (solo si lo usás)
export const marcarEnvioComoEnviado = async (id) => {
  const res = await axios.put(`${API_URL}/${id}/marcar-enviado`);
  return res.data;
};

