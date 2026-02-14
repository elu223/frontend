import React from 'react';

function ModalEstadoPago({ 
  pagoEditando, 
  nuevoEstado, 
  setNuevoEstado, 
  guardarEstado, 
  cerrarModal 
}) {
  return (
    <div className="overlay-formulario">
      <div className="modal-formulario">
        <h3>Cambiar estado del pago #{pagoEditando.id_pago}</h3>
        <div className="input-group">
          <label>Nuevo Estado:</label>
          <select 
            value={nuevoEstado} 
            onChange={(e) => setNuevoEstado(e.target.value)} 
            className="select-estado"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <div className="botones-formulario">
          <button className="btn-confirmar" onClick={guardarEstado}>
            Guardar
          </button>
          <button className="btn-cancelar" onClick={cerrarModal}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEstadoPago;