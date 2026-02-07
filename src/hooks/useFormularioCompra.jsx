import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';

axios.defaults.baseURL = 'http://localhost:5000';

export function useFormularioCompra(carrito, total, onClose) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    voucher: '',
    direccion: '', // Cambiado a "direccion" (sin "Envio")
    cardNombre: '',
    cardNumero: '',
    cardFecha: '',
    cardCVV: '',
    metodoPago: ''
  });
  
  const [procesando, setProcesando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  
  // Medios de pago fijos
  const mediosPago = [
    { id: 'VISA', nombre: 'VISA' },
    { id: 'MCD', nombre: 'MasterCard' },
    { id: 'BBVA', nombre: 'BBVA' },
    { id: 'NX', nombre: 'NX' },
  ];

  // Obtener ID del usuario
  useEffect(() => {
    if (user?.id_usuario) {
      setUsuarioId(user.id_usuario);
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUsuarioId(parsedUser.id_usuario || parsedUser.id);
      }
    }
  }, [user]);

  // Manejar cambio en inputs
  const manejarCambio = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  // Aplicar voucher (función simple)
  const aplicarVoucher = () => {
    if (formData.voucher) console.log('Voucher aplicado:', formData.voucher);
  };

  // Función principal de compra con then/catch (como pediste)
  const procesarCompra = () => {
    if (!formData.metodoPago) return alert('Seleccione método de pago');
    if (carrito.length === 0) return alert('Carrito vacío');
    if (!formData.direccion.trim()) return alert('Ingrese dirección');
    if (!usuarioId) return alert('No se identificó usuario');

    setProcesando(true);
    let carritoIdUsado;

    // 1. Crear carrito
    axios.post('/api/carritos', { id_usuario: usuarioId })
      .then((responseCarrito) => {
        carritoIdUsado = responseCarrito.data.id_carrito;
        console.log('Carrito ID:', carritoIdUsado);
        
        // 2. Crear pago
        const datosPago = {
          id_carrito: carritoIdUsado,
          monto: parseFloat(total).toFixed(2),
          metodo: formData.metodoPago
        };
        return axios.post('/api/pagos', datosPago);
      })
      .then((responsePago) => {
        console.log('Pago ID:', responsePago.data.id_pago);
        
        // 3. Registrar productos
        const promesasProductos = carrito.map(producto => 
          axios.post('/api/compras', {
            id_carrito: carritoIdUsado,
            id_producto: producto.id,
            cantidad: producto.cantidad || 1,
            precio_unitario: parseFloat(producto.precio).toFixed(2)
          })
        );
        return Promise.all(promesasProductos);
      })
      .then((resultados) => {
        console.log('Productos registrados:', resultados.length);
        
        // 4. Registrar venta (actualiza stock)
        const primeraCompraId = resultados[0].data.id_compra_productos;
        return axios.post('/api/ventas', {
          id_compra_productos: primeraCompraId,
          id_usuario: usuarioId
        });
      })
      .then(() => {
        // 5. Crear envío automático
        return axios.post('/api/envios', {
          id_usuario: usuarioId,
          direccion: formData.direccion,
          estado: "Pendiente"
        });
      })
      .then(() => {
        alert('Pago exitoso\nCompra registrada\nEnvío creado (Pendiente)');
        onClose();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(error.response?.data?.error || 'Error en la compra');
      })
      .finally(() => {
        setProcesando(false);
      });
  };

  // Manejar submit
  const manejarSubmit = (e) => {
    e.preventDefault();
    procesarCompra();
  };

  return {
    formData,
    procesando,
    mediosPago,
    manejarCambio,
    manejarSubmit,
    aplicarVoucher
  };
}