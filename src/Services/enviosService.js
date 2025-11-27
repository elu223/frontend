import axios from 'axios';

const API_URL = 'http://localhost:5000/enviospendientes'; // tu backend

// Obtener todos los envíos pendientes
export const obtenerEnviosPendientes = async () => {
  const res = await axios.get(API_URL);
  return res.data; // devuelve el array de envíos
};

// Crear un nuevo envío pendiente
export const crearEnvioPendiente = async (descripcion) => {
  const res = await axios.post(API_URL, { descripcion });
  return res.data; // devuelve el envío creado
};

