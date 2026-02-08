import React, { useEffect, useState } from "react";
import { useEnvios } from "../../../hooks/useEnvios";
import "./EnvioPendiente.css";

function EnviosRecientes() {
  const { envios, loading, error, cargarEnvios, crearEnvio, actualizarEnvio, eliminarEnvio } = useEnvios();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [envioEditando, setEnvioEditando] = useState(null);
  const [formData, setFormData] = useState({
    direccion: "",
    codigo_postal: "",
  });

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const abrirModalEditar = (envio) => {
    setEnvioEditando(envio.id_envio);
    setFormData({
      direccion: envio.direccion,
      estado: envio.estado,
      ciudad: envio.ciudad,
      codigo_postal: envio.codigo_postal,
    });
    setMostrarModal(true);
  };

  const abrirModalAgregar = () => {
    setEnvioEditando(null);
    setFormData({ direccion: "", estado: "", ciudad: "", codigo_postal: "" });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEnvioEditando(null);
  };

  const enviarFormulario = (e) => {
    e.preventDefault();

    if (envioEditando) {
      actualizarEnvio(envioEditando, formData)
        .then((resultado) => {
          alert(resultado.message);
          if (resultado.success) {
            cerrarModal();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      crearEnvio(formData)
        .then((resultado) => {
          alert(resultado.message);
          if (resultado.success) {
            cerrarModal();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const handleEliminarEnvio = (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este envío?")) return;

    eliminarEnvio(id)
      .then((resultado) => {
        alert(resultado.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="envios-recientes-container">
      <h2>Envíos recientes</h2>

      <button className="btn-agregar-envios" onClick={abrirModalAgregar}>
        + Agregar Envío
      </button>

      {loading ? (
        <p className="cargando">Cargando envíos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : envios.length === 0 ? (
        <p className="no-envios">No hay envíos registrados.</p>
      ) : (
        <table className="tabla-envios">
          <thead>
            <tr>
              <th>ID Envío</th>
              <th>ID Usuario</th>
              <th>Dirección</th>
              <th>Código Postal</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {envios.map((e) => (
              <tr key={e.id_envio}>
                <td>{e.id_envio}</td>
                <td>{e.id_usuario}</td>
                <td>{e.direccion}</td>
                <td>{e.codigo_postal}</td>
                <td>{e.fecha}</td>
                <td>
                  <button onClick={() => abrirModalEditar(e)}>Editar</button>
                  <button onClick={() => handleEliminarEnvio(e.id_envio)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarModal && (
        <div className="overlay-formulario">
          <div className="modal-formulario">
            <h3>{envioEditando ? "Editar Envío" : "Nuevo Envío"}</h3>

            <form onSubmit={enviarFormulario}>
              <div className="input-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={manejarCambio}
                  required
                />
              </div>
              <div className="input-group">
                <label>Código Postal:</label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={manejarCambio}
                />
              </div>

              <div className="botones-formulario">
                <button type="submit" className="btn-confirmar">
                  {envioEditando ? "Actualizar" : "Agregar"}
                </button>

                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnviosRecientes;