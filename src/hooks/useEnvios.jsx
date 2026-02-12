import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthConfig } from './useProductos';

axios.defaults.baseURL = 'http://localhost:5000';

export function useEnvios() {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = () => {
    setLoading(true);
    axios.get('/api/envios', getAuthConfig())
      .then((response) => {
        setEnvios(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar envíos:', error);
        setError('Error al cargar los envíos');
        setLoading(false);
      });
  };

  const crearEnvio = (datos) => {
    return axios.post('/api/envios', datos, getAuthConfig())
      .then((response) => {
        cargarEnvios();
        return { success: true, message: 'Envío creado correctamente', data: response.data };
      })
      .catch((error) => {
        console.error('Error al crear envío:', error);
        return { success: false, message: 'Error al crear el envío' };
      });
  };

  const actualizarEnvio = (id, datos) => {
    return axios.put(`/api/envios/${id}`, datos, getAuthConfig())
      .then(() => {
        cargarEnvios();
        return { success: true, message: 'Envío actualizado correctamente' };
      })
      .catch((error) => {
        console.error('Error al actualizar envío:', error);
        return { success: false, message: 'Error al actualizar el envío' };
      });
  };

  const eliminarEnvio = (id) => {
    return axios.delete(`/api/envios/${id}`, getAuthConfig())
      .then(() => {
        cargarEnvios();
        return { success: true, message: 'Envío eliminado correctamente' };
      })
      .catch((error) => {
        console.error('Error al eliminar envío:', error);
        return { success: false, message: 'Error al eliminar el envío' };
      });
  };

  return {
    envios,
    loading,
    error,
    cargarEnvios,
    crearEnvio,
    actualizarEnvio,
    eliminarEnvio
  };
}