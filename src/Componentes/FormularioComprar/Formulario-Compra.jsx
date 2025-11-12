import React, { useState } from 'react';
import './Formulario-Compra.css';

function FormularioCompra({ carrito, total }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [lugarEnvio, setLugarEnvio] = useState('');
  const [cardNombre, setCardNombre] = useState('');
  const [cardNumero, setCardNumero] = useState('');
  const [cardFecha, setCardFecha] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [metodoPago, setMetodoPago] = useState('');

  const mediosPago = [
    { id: 'VISA', nombre: 'VISA' },
    { id: 'MCD', nombre: 'MasterCard' },
    { id: 'BBVA', nombre: 'BBVA' },
    { id: 'NX', nombre: 'NX' },
  ];

  const aplicarVoucher = () => {
    console.log('Voucher aplicado:', voucher);
    // aquí iría la lógica para aplicar el descuento
  };

  const manejarPago = (e) => {
    e.preventDefault();
    if (!metodoPago) {
      alert('Por favor seleccione un método de pago');
      return;
    }

    const pago = {
      items: carrito,
      total,
      voucher,
      lugarEnvio,
      tarjeta: { cardNombre, cardNumero, cardFecha, cardCVV },
      metodoPago,
    };

    console.log('Procesar pago:', pago);
    alert('Pago procesado con éxito ✅');
    setMostrarFormulario(false);
  };

  if (!mostrarFormulario) {
    return (
      <button
        className="btn-abrir-formulario"
        onClick={() => setMostrarFormulario(true)}
      >
        Iniciar pago
      </button>
    );
  }

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
            />
            <button
              type="button"
              className="btn-aplicar"
              onClick={aplicarVoucher}
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
          />

          <label className="label">Número de tarjeta</label>
          <input
            className="input"
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardNumero}
            onChange={(e) => setCardNumero(e.target.value)}
            required
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
              />
            </div>
          </div>

          <div className="resumen-pago">
            <button type="submit" className="btn-confirmar-pago">
              <span>${total}</span>
              <span>Pagar</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-cancelar"
            onClick={() => setMostrarFormulario(false)}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioCompra;
