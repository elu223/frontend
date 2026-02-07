import React from 'react';
import './Formulario-Compra.css';
import { useFormularioCompra } from '../../hooks/useFormularioCompra';

function FormularioCompra({ carrito, total, onClose }) {
  const {
    formData,
    procesando,
    mediosPago,
    manejarCambio,
    manejarSubmit,
    aplicarVoucher
  } = useFormularioCompra(carrito, total, onClose);

  return (
    <div className="formulario-overlay">
      <div className="formulario-container pago-form">
        <form onSubmit={manejarSubmit}>
          {/* Campo voucher */}
          <div className="fila-voucher">
            <input
              className="input"
              type="text"
              placeholder="Código del vale"
              value={formData.voucher}
              onChange={(e) => manejarCambio('voucher', e.target.value)}
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

          {/* Campo dirección (simple) */}
          <div className="campo-envio">
            <input
              className="input"
              type="text"
              placeholder="Dirección de envío"
              value={formData.direccion}
              onChange={(e) => manejarCambio('direccion', e.target.value)}
              required
              disabled={procesando}
            />
          </div>

          {/* Métodos de pago */}
          <div className="medios-pago">
            {mediosPago.map((medio) => (
              <label key={medio.id} className="pago-option">
                <input
                  type="radio"
                  name="metodoPago"
                  value={medio.id}
                  checked={formData.metodoPago === medio.id}
                  onChange={(e) => manejarCambio('metodoPago', e.target.value)}
                  disabled={procesando}
                />
                <span className="pago-icon">{medio.nombre}</span>
              </label>
            ))}
          </div>

          {/* Datos de tarjeta */}
          <label className="label">Nombre de la tarjeta</label>
          <input
            className="input"
            type="text"
            placeholder="Titular de la tarjeta"
            value={formData.cardNombre}
            onChange={(e) => manejarCambio('cardNombre', e.target.value)}
            required
            disabled={procesando}
          />

          <label className="label">Número de tarjeta</label>
          <input
            className="input"
            type="text"
            placeholder="0000 0000 0000 0000"
            value={formData.cardNumero}
            onChange={(e) => manejarCambio('cardNumero', e.target.value)}
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
                value={formData.cardFecha}
                onChange={(e) => manejarCambio('cardFecha', e.target.value)}
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
                value={formData.cardCVV}
                onChange={(e) => manejarCambio('cardCVV', e.target.value)}
                required
                disabled={procesando}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="resumen-pago">
            <button type="submit" className="btn-confirmar-pago" disabled={procesando}>
              {procesando ? 'Procesando...' : `$${total} Pagar`}
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