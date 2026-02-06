// hooks/useProductos.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración base de axios
axios.defaults.baseURL = 'http://localhost:5000';

// Función reutilizable para obtener configuración de autenticación
export const getAuthConfig = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    if (user && user.token) {
      return {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
    }
  }
  return {};
};

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setLoading(true);
    axios.get('/api/productos', getAuthConfig())
      .then((response) => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
        setError('Error al cargar los productos');
        setLoading(false);
      });
  };

  return {
    productos,
    loading,
    error,
    cargarProductos,
    setProductos
  };
}