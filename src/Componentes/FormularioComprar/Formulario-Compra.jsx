import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Formulario-Compra.css';

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

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 1;
    setUsuarioId(userId);
  }, []);

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
    axios.post('http://localhost:5000/api/carritos', { id_usuario: usuarioId })
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
        
        alert('Pago exitoso\nLa compra ha sido registrada.');
        
        localStorage.removeItem('carrito');
        
        onClose();
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
        setProcesando(false);
      })
      .catch((error) => {
        console.error('Error en compra:', error);
        
        let mensajeError = 'Error en el pago';
        if (error.response && error.response.data && error.response.data.error) {
          mensajeError += ': ' + error.response.data.error;
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
            <input
              className="input"
              type="text"
              placeholder="Lugar del envío"
              value={lugarEnvio}
              onChange={(e) => setLugarEnvio(e.target.value)}
              required
              disabled={procesando}
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