import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Formulario-Compra.css';
import { useAuth } from '../../auth/AuthProvider';
import { useLocation } from 'wouter';

function FormularioCompra({ carrito, total, onClose }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Estados combinados
  const [form, setForm] = useState({
    voucher: '',
    direccion: '',
    estado: '',
    ciudad: '',
    codigoPostal: '',
    cardNombre: '',
    cardNumero: '',
    cardFecha: '',
    cardCVV: '',
    metodoPago: ''
  });
  
  const [procesando, setProcesando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    if (!user) {
      setLocation('/iniciar-sesion');
      return;
    }
    setUsuarioId(user.id || user.id_usuario || localStorage.getItem('userId'));
    if (user.direccion) setForm(prev => ({ ...prev, direccion: user.direccion }));
  }, []);

  const mediosPago = [
    { id: 'VISA', nombre: 'VISA' },
    { id: 'MCD', nombre: 'MasterCard' },
    { id: 'BBVA', nombre: 'BBVA' },
    { id: 'NX', nombre: 'NX' },
  ];

  const aplicarVoucher = () => {
    console.log('Voucher aplicado:', form.voucher);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarPago = (e) => {
    e.preventDefault();
    
    if (!form.metodoPago || carrito.length === 0 || !form.direccion || !form.estado) {
      alert(!form.metodoPago ? 'Seleccione método de pago' : 
            carrito.length === 0 ? 'Carrito vacío' : 'Complete dirección y estado');
      return;
    }

    setProcesando(true);

    let carritoIdUsado;

    axios.post('http://localhost:5000/api/carritos', { id_usuario: usuarioId })
      .then((responseCarrito) => {
        carritoIdUsado = responseCarrito.data.id_carrito;
        return axios.post('http://localhost:5000/api/pagos', {
          id_carrito: carritoIdUsado,
          monto: parseFloat(total).toFixed(2),
          metodo: form.metodoPago
        });
      })
      .then((responsePago) => {
        const promesasProductos = carrito.map((producto) =>
          axios.post('http://localhost:5000/api/compras', {
            id_carrito: carritoIdUsado,
            id_producto: producto.id,
            cantidad: producto.cantidad || 1,
            precio_unitario: parseFloat(producto.precio).toFixed(2)
          })
        );
        return Promise.all(promesasProductos);
      })
      .then((resultados) => {
        return axios.post('http://localhost:5000/api/ventas', {
          id_compra_productos: resultados[0].data.id_compra_productos,
          id_usuario: usuarioId
        });
      })
      .then(() => {
        return axios.post('http://localhost:5000/api/envios', {
          id_usuario: usuarioId,
          direccion: form.direccion,
          estado: form.estado,
          ciudad: form.ciudad,
          codigo_postal: form.codigoPostal
        });
      })
      .then(() => {
        alert('Pago exitoso\nCompra y envío registrados.');
        onClose();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((error) => {
        alert(error.response?.data?.error || 'Error en el pago');
        console.error('Error:', error);
      })
      .finally(() => {
        setProcesando(false);
      });
  };

  // Renderizar campo de entrada reutilizable
  const renderInput = (name, placeholder, required = false, type = 'text') => (
    <input
      className="input"
      type={type}
      name={name}
      placeholder={placeholder}
      value={form[name]}
      onChange={handleChange}
      required={required}
      disabled={procesando}
    />
  );

  return (
    <div className="formulario-overlay">
      <div className="formulario-container pago-form">
        <form onSubmit={manejarPago}>
          <div className="fila-voucher">
            {renderInput('voucher', 'Código del vale')}
            <button type="button" className="btn-aplicar" onClick={aplicarVoucher} disabled={procesando}>
              Aplicar
            </button>
          </div>

          {renderInput('direccion', 'Dirección completa', true)}
          {renderInput('estado', 'Estado o provincia', true)}

          <div className="fila-pequena">
            <div className="col-pequena">{renderInput('ciudad', 'Ciudad')}</div>
            <div className="col-pequena">{renderInput('codigoPostal', 'Código Postal')}</div>
          </div>

          <div className="medios-pago">
            {mediosPago.map((medio) => (
              <label key={medio.id} className="pago-option">
                <input
                  type="radio"
                  name="metodoPago"
                  value={medio.id}
                  checked={form.metodoPago === medio.id}
                  onChange={handleChange}
                  disabled={procesando}
                />
                <span className="pago-icon">{medio.nombre}</span>
              </label>
            ))}
          </div>

          <label className="label">Nombre de la tarjeta</label>
          {renderInput('cardNombre', 'Titular de la tarjeta', true)}

          <label className="label">Número de tarjeta</label>
          {renderInput('cardNumero', '0000 0000 0000 0000', true)}

          <div className="fila-pequena">
            <div className="col-pequena">
              <label>Fecha</label>
              {renderInput('cardFecha', 'MM/AA', true)}
            </div>
            <div className="col-pequena">
              <label>CVV</label>
              {renderInput('cardCVV', 'CVV', true)}
            </div>
          </div>

          <div className="resumen-pago">
            <button type="submit" className="btn-confirmar-pago" disabled={procesando}>
              {procesando ? 'Procesando...' : (
                <>
                  <span>${total}</span>
                  <span>Pagar</span>
                </>
              )}
            </button>
          </div>

          <button type="button" className="btn-cancelar" onClick={onClose} disabled={procesando}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioCompra;