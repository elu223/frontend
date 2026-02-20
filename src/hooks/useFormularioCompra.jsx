// hooks/useFormularioCompra.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import { useCarrito } from '../CarritoContext'; 

axios.defaults.baseURL = 'http://localhost:5000';

export function useFormularioCompra(carrito, total, onClose) {
  const { user } = useAuth();
  const { limpiarCarrito } = useCarrito();
  
  const [formData, setFormData] = useState({
    voucher: '',
    direccion: '',
    cardNombre: '',
    cardNumero: '',
    cardFecha: '',
    cardCVV: '',
    metodoPago: ''
  });
  
  const [procesando, setProcesando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  
  const mediosPago = [
    { id: 'VISA', nombre: 'VISA' },
    { id: 'MCD', nombre: 'MasterCard' },
    { id: 'BBVA', nombre: 'BBVA' },
    { id: 'NX', nombre: 'NX' },
  ];

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

  const manejarCambio = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const aplicarVoucher = () => {
    if (formData.voucher) console.log('Voucher aplicado:', formData.voucher);
  };

  const procesarCompra = () => {
    if (!formData.metodoPago) return alert('Seleccione método de pago');
    if (carrito.length === 0) return alert('Carrito vacío');
    if (!formData.direccion.trim()) return alert('Ingrese dirección');
    if (!usuarioId) return alert('No se identificó usuario');

    setProcesando(true);
    let carritoIdUsado;

    // solo crear carrito, pago y productos. no crear venta ni envío todavía
    axios.post('/api/carritos', { id_usuario: usuarioId })
      .then((responseCarrito) => {
        carritoIdUsado = responseCarrito.data.id_carrito;
        console.log('Carrito ID:', carritoIdUsado);
        
        // Guardar dirección con el pago
        const datosPago = {
          id_carrito: carritoIdUsado,
          monto: parseFloat(total).toFixed(2),
          metodo: formData.metodoPago,
          direccion: formData.direccion
        };
        
        console.log('Pago creado con dirección:', formData.direccion); 
        
        return axios.post('/api/pagos', datosPago);
      })
      .then((responsePago) => {
        console.log('Pago creado ID:', responsePago.data.id_pago);
        
        // Registrar productos en compra_productos
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
        console.log('Compra registrada. Productos:', resultados.length);
        
        // limpiar carrito después de la compra
        limpiarCarrito(); 
        
        // mostrar mensaje de éxito
        alert('Compra registrada. El pago está pendiente de aprobación.');
        
        onClose();
        setProcesando(false);
      })
      .catch((error) => {
        console.error('Error en compra:', error);
        alert(error.response?.data?.error || 'Error en la compra');
        setProcesando(false);
      });
  };

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