import { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración base de axios
axios.defaults.baseURL = 'http://localhost:5000';

// Función para obtener configuración de autenticación
const getAuthConfig = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    if (user?.token) {
      return {
        headers: { 'Authorization': `Bearer ${user.token}` }
      };
    }
  }
  return {};
};

// Hook principal
export function useComprasAdmin() {
  // Estados principales
  const [pagos, setPagos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de estadísticas
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);
  const [totalPagos, setTotalPagos] = useState(0);
  
  // Cargar todos los datos
  const cargarDatos = () => {
    setLoading(true);
    
    // Cargar pagos
    axios.get('/api/pagos', getAuthConfig())
      .then(res => {
        const datosPagos = res.data || [];
        setPagos(datosPagos);
        setTotalPagos(datosPagos.length);
      })
      .catch(() => {
        setPagos([]);
        setTotalPagos(0);
      });
    
    // Cargar ventas
    axios.get('/api/ventas', getAuthConfig())
      .then(res => setVentas(res.data || []))
      .catch(() => setVentas([]));
    
    // Cargar estadísticas
    cargarEstadisticas();
  };
  
  // Cargar estadísticas
  const cargarEstadisticas = () => {
    // Ventas de hoy
    axios.get('/api/ventas/hoy', getAuthConfig())
      .then(res => setVentasHoy(res.data?.total_ventas || 0))
      .catch(() => setVentasHoy(0));
    
    // Ventas del mes
    axios.get('/api/ventas/mes', getAuthConfig())
      .then(res => setVentasMes(res.data?.total_ventas || 0))
      .catch(() => setVentasMes(0));
    
    setLoading(false);
  };
  
  // Inicializar
  useEffect(() => {
    cargarDatos();
  }, []);
  
  // Operaciones CRUD
  
  // Eliminar pago
  const eliminarPago = (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este pago?")) return;
    
    axios.delete(`/api/pagos/${id}`, getAuthConfig())
      .then(() => {
        setPagos(prev => prev.filter(pago => pago.id_pago !== id));
        setTotalPagos(prev => prev - 1);
        alert('Pago eliminado correctamente');
      })
      .catch(() => alert('Error al eliminar el pago'));
  };
  
  // Eliminar venta
  const eliminarVenta = (id) => {
    if (!window.confirm("¿Seguro quieres eliminar esta venta?")) return;
    
    axios.delete(`/api/ventas/${id}`, getAuthConfig())
      .then(() => {
        cargarDatos(); // Recargar todo para mantener consistencia
        alert('Venta eliminada correctamente');
      })
      .catch(() => alert('Error al eliminar la venta'));
  };
  
  // Actualizar estado del pago
  const actualizarEstadoPago = (id, nuevoEstado) => {
    return axios.put(`/api/pagos/${id}`, { estado: nuevoEstado }, getAuthConfig())
      .then(response => {
        // Si se aprobó el pago, recargamos todos los datos para actualizar ventas
        if (nuevoEstado === 'aprobado') {
          cargarDatos();
        } else {
          // Solo actualizamos el estado del pago localmente
          setPagos(prev => prev.map(pago => 
            pago.id_pago === id ? { ...pago, estado: nuevoEstado } : pago
          ));
        }
        return response;
      });
  };
  
  // Filtrar ventas por "hoy"
  const filtrarVentasHoy = (ventasList) => {
    const hoy = new Date();
    const hoyFormato = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
    
    return ventasList.filter(venta => 
      venta.fecha_venta && venta.fecha_venta.includes(hoyFormato)
    );
  };
  
  // Retornar todas las funciones y estados
  return {
    // Estados
    pagos,
    ventas,
    loading,
    ventasHoy,
    ventasMes,
    totalPagos,
    
    // Funciones
    cargarDatos,
    eliminarPago,
    eliminarVenta,
    actualizarEstadoPago,
    filtrarVentasHoy,
    
    // Setters
    setPagos,
    setVentas
  };
}