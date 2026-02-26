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
            type="tel"
            placeholder="0000 0000 0000 0000"
            value={formData.cardNumero}
            onChange={(e) => {
              // variable temporal para limpiar el texto antes de guardarlo
              let v = e.target.value.replace(/\D/g, '');
              v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
              //finalmente le pasamos el valor limpio a la función de manejo de cambios
              manejarCambio('cardNumero', v);
            }}
            required
            maxLength="19"
            disabled={procesando}
          />

          <div className="fila-pequena">
            <div className="col-pequena">
              <label>Fecha de vencimiento</label>
              <input
                className="input"
                type="text"
                placeholder="MM/AA"
                value={formData.cardFecha}
                onChange={(e) => {
                  // variable temporal para limpiar el texto antes de guardarlo
                  let v = e.target.value.replace(/\D/g, '');
                  //guardamos el valor limpio en la variable temporal y luego le agregamos la barra después de los primeros dos dígitos
                  if (v.length > 2){
                    v = v.slice(0, 2) + '/' + v.slice(2, 4);
                  }
                  manejarCambio('cardFecha', v);
                }}
                required
                maxLength={5}
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
                maxLength="3"
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