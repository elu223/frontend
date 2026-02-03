import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Formulario-Compra.css';
import { useAuth } from '../../auth/AuthProvider';
import { useLocation } from 'wouter';

function FormularioCompra({ carrito, total, onClose }) {
  const [voucher, setVoucher] = useState('');
  const [lugarEnvio, setLugarEnvio] = useState('');
  const [cardNombre, setCardNombre] = useState('');
  const [cardNumero, setCardNumero] = useState('');
  const [cardFecha, setCardFecha] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      // si no está autenticado redirigir al login
      setLocation('/iniciar-sesion');
      return;
    }

    const userId = user.id ?? user.id_usuario ?? localStorage.getItem('userId');
    setUsuarioId(userId);

    // Cargar dirección del usuario
    axios.get(`http://localhost:5000/usuarios/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      const userData = response.data;
      setDireccion(userData.direccion || '');
      setCiudad(userData.ciudad || '');
      setEstado(userData.estado || '');
      setCodigoPostal(userData.codigo_postal || '');
    })
    .catch((error) => {
      console.error('Error al cargar dirección:', error);
    });
  }, [user]);

  const mediosPago = [
    { id: 'VISA', nombre: 'VISA' },
    { id: 'MCD', nombre: 'MasterCard' },
    { id: 'BBVA', nombre: 'BBVA' },
    { id: 'NX', nombre: 'NX' },
  ];

  const aplicarVoucher = () => {
    console.log('Voucher aplicado:', voucher);
  };

  const manejarPago = (e) => {
    e.preventDefault();
    
    if (!metodoPago) {
      alert('Por favor seleccione un método de pago');
      return;
    }

    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setProcesando(true);

    // Variable para guardar el ID del carrito
    let carritoIdUsado;

    // 1. Crear carrito
    axios.post('http://localhost:5000/api/carritos', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((responseCarrito) => {
        carritoIdUsado = responseCarrito.data.id_carrito;
        console.log('Carrito creado ID:', carritoIdUsado);
        
        // 2. Crear pago
        const datosPago = {
          id_carrito: carritoIdUsado,
          monto: parseFloat(total).toFixed(2),
          metodo: metodoPago
        };

        return axios.post('http://localhost:5000/api/pagos', datosPago);
      })
      .then((responsePago) => {
        console.log('Pago creado ID:', responsePago.data.id_pago);
        
        // 3. Registrar productos
        const promesasProductos = carrito.map((producto) => {
          const datosProducto = {
            id_carrito: carritoIdUsado,
            id_producto: producto.id,
            cantidad: producto.cantidad || 1,
            precio_unitario: parseFloat(producto.precio).toFixed(2)
          };
          
          return axios.post('http://localhost:5000/api/compras', datosProducto);
        });

        return Promise.all(promesasProductos);
      })
      .then((resultados) => {
        console.log('Compra completada. Productos:', resultados.length);
        
        // IMPORTANTE: Ahora registrar la venta para actualizar stock
        // Tomar el primer ID de compra_productos para la venta
        const primeraCompraId = resultados[0].data.id_compra_productos;
        
        const datosVenta = {
          id_compra_productos: primeraCompraId,
          id_usuario: usuarioId
        };
        
        // Llamar a /api/ventas que actualiza el stock
        return axios.post('http://localhost:5000/api/ventas', datosVenta);
      })
      .then((responseVenta) => {
        console.log('Venta registrada:', responseVenta.data);
        
        // 5. Actualizar dirección del usuario si cambió
        const datosUsuarioActualizado = {
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          telefono: user.telefono,
          direccion: direccion,
          ciudad: ciudad,
          estado: estado,
          codigo_postal: codigoPostal
        };
        
        return axios.put(`http://localhost:5000/usuarios/${usuarioId}`, datosUsuarioActualizado, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      })
      .then((responseUsuario) => {
        console.log('Usuario actualizado:', responseUsuario.data);
        
        // 6. Crear envío
        const datosEnvio = {
          id_usuario: usuarioId,
          id_carrito: carritoIdUsado,
          direccion: direccion,
          ciudad: ciudad,
          estado: estado,
          codigo_postal: codigoPostal
        };
        
        return axios.post('http://localhost:5000/api/envios', datosEnvio);
      })
      .then((responseEnvio) => {
        console.log('Envío creado:', responseEnvio.data);
        
        alert('Pago exitoso\nLa compra ha sido registrada y el envío creado.');
        
        // Cerrar formulario
        onClose();
        
        // Recargar la página después de 1 segundo para ver cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        setProcesando(false);
      })
      .catch((error) => {
        console.error('Error en compra:', error);
        
        let mensajeError = 'Error en el pago';
        if (error.response && error.response.data && error.response.data.error) {
          mensajeError = error.response.data.error;
        }
        
        alert(mensajeError);
        setProcesando(false);
      });
  };

  return (
    <div className="formulario-overlay">
      <div className="formulario-container pago-form">
        <form onSubmit={manejarPago}>
          <div className="fila-voucher">
            <input
              className="input"
              type="text"
              placeholder="Código del vale"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              disabled={procesando}
            />
            <button
              type="button"
              className="btn-aplicar"
              onClick={aplicarVoucher}
              disabled={procesando}
            >
              Aplicar
            </button>
          </div>

          <div className="campo-envio">
            <h3>Dirección de Envío</h3>
            <input
              className="input"
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              disabled={procesando}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input
                className="input"
                type="text"
                placeholder="Ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required
                disabled={procesando}
                style={{ flex: 1 }}
              />
              <input
                className="input"
                type="text"
                placeholder="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
                disabled={procesando}
                style={{ flex: 1 }}
              />
            </div>
            <input
              className="input"
              type="text"
              placeholder="Código Postal"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              required
              disabled={procesando}
              style={{ marginTop: '10px' }}
            />
          </div>

          <div className="medios-pago">
            {mediosPago.map((medio) => (
              <label key={medio.id} className="pago-option">
                <input
                  type="radio"
                  name="metodoPago"
                  value={medio.id}
                  checked={metodoPago === medio.id}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  disabled={procesando}
                />
                <span className="pago-icon">{medio.nombre}</span>
              </label>
            ))}
          </div>

          <label className="label">Nombre de la tarjeta</label>
          <input
            className="input"
            type="text"
            placeholder="Titular de la tarjeta"
            value={cardNombre}
            onChange={(e) => setCardNombre(e.target.value)}
            required
            disabled={procesando}
          />

          <label className="label">Número de tarjeta</label>
          <input
            className="input"
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardNumero}
            onChange={(e) => setCardNumero(e.target.value)}
            required
            disabled={procesando}
          />

          <div className="fila-pequena">
            <div className="col-pequena">
              <label>Fecha</label>
              <input
                className="input"
                type="text"
                placeholder="MM/AA"
                value={cardFecha}
                onChange={(e) => setCardFecha(e.target.value)}
                required
                disabled={procesando}
              />
            </div>

            <div className="col-pequena">
              <label>CVV</label>
              <input
                className="input"
                type="text"
                placeholder="CVV"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
                required
                disabled={procesando}
              />
            </div>
          </div>

          <div className="resumen-pago">
            <button 
              type="submit" 
              className="btn-confirmar-pago"
              disabled={procesando}
            >
              {procesando ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <span>${total}</span>
                  <span>Pagar</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            className="btn-cancelar"
            onClick={onClose}
            disabled={procesando}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioCompra;