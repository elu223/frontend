import React from "react";
import "./AdminUsuarios.css";

function AccionesUsuarioModal({ usuario, onClose, onBlock, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <h2>Acciones para {usuario.username}</h2>

        <p>Email: {usuario.email}</p>
        <p>Estado actual: {usuario.estado}</p>

        <div className="modal-botones">
          <button className="btn-bloquear" onClick={onBlock}>
            Bloquear usuario
          </button>

          <button className="btn-eliminar" onClick={onDelete}>
            Eliminar usuario
          </button>

          <button className="btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccionesUsuarioModal;
