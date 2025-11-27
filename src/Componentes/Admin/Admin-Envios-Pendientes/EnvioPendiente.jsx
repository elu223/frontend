import React, { useEffect, useState } from "react";
import {
  obtenerEnvios,
  crearEnvio,
  actualizarEnvio,
  eliminarEnvioPorId
} from "../../../services/enviosService";

import "./EnvioPendiente.css";

function EnviosRecientes() {
  const [envios, setEnvios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [envioEditando, setEnvioEditando] = useState(null);

  const [formData, setFormData] = useState({
    direccion: "",
    estado: "",
    ciudad: "",
    codigo_postal: "",
  });

  // Cargar envíos
  const cargarEnvios = async () => {
    try {
      const data = await obtenerEnvios();
      setEnvios(data);
    } catch (error) {
      console.log("Error cargando envíos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEnvios();
  }, []);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const abrirModalEditar = (envio) => {
    setEnvioEditando(envio.id_envio);
    setFormData(envio);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEnvioEditando(null);
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();

    try {
      if (envioEditando) {
        await actualizarEnvio(envioEditando, formData);
      } else {
        await crearEnvio(formData);
      }

      cargarEnvios();
      cerrarModal();
    } catch (error) {
      console.log("Error guardando envío:", error);
    }
  };

  const eliminarEnvio = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este envío?")) return;

    try {
      await eliminarEnvioPorId(id);
      cargarEnvios();
    } catch (error) {
      console.log("Error eliminando envío:", error);
    }
  };

  return (
    <div className="envios-recientes-container">
      <h2>Envíos recientes</h2>

      {cargando ? (
        <p className="cargando">Cargando envíos...</p>
      ) : envios.length === 0 ? (
        <p className="no-envios">No hay envíos registrados.</p>
      ) : (
        <table className="tabla-envios">
          <thead>
            <tr>
              <th>ID Envío</th>
              <th>ID Usuario</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Ciudad</th>
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
                <td>{e.estado}</td>
                <td>{e.ciudad}</td>
                <td>{e.codigo_postal}</td>
                <td>{e.fecha}</td>

                <td>
                  <button className="btn-editar" onClick={() => abrirModalEditar(e)}>
                     <img src='/img/lapiz.png' alt="Editar" />
                  </button>
                  <button className="btn-eliminar" onClick={() => eliminarEnvio(e.id_envio)}>
                    <img src='/img/basura.png' alt="Eliminar" />
                  </button>
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
                <label>Estado:</label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="input-group">
                <label>Ciudad:</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={manejarCambio}
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
