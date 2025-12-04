import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUsuarios.css";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    id_rol: ""
  });

  // cargar usuarios
 const obtenerUsuarios =() =>{
  axios.get("http://localhost:5000/usuarios")
  .then((res)=>{
    setUsuarios (res.data);
 })
  .catch((error)=>{
    console.log("Error obteniendo usuarios:", error)
  })
}

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // abrir modal nuevo
  const abrirModalNuevo = () => {
    setUsuarioEditando(null);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      telefono: "",
      direccion: "",
      id_rol: 1,
    });
    setMostrarModal(true);
  };

  // ABRIR MODAL EDITAR
  const abrirModalEditar = (usuario) => {
    setUsuarioEditando(usuario.id_usuario);
    setFormData(usuario);
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

  // ENVIAR FORMULARIO
  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (usuarioEditando){
      axios.put(`http://localhost:5000/usuarios/${usuarioEditando}`, formData)
      .then(() =>{
        obtenerUsuarios();
        cerrarModal();
      })
      .catch((error)=>{
        console.log("Error guardando usuarios:", error);
      })
    } else{
      axios.post("http://localhost:5000/usuarios", formData)
      .then(() =>{
        obtenerUsuarios();
        cerrarModal();
      })
      .catch((error)=>{
        console.log("Error guardando usuarios:", error)
      })
    }
  };

  // eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este usuario?")) return;
    axios.delete(`http://localhost:5000/usuarios/${id}`)
      .then(() => {
        obtenerUsuarios();
      })
      .catch((error) => {
        console.log("Error eliminando usuario:", error);
      });
  }

  // filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter((u) =>
    (u.nombre + " " + u.apellido).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="admin-usuarios-container">
    <div className="header-productos">
        <h1 className="titulo-principal">Usuarios</h1>
      </div>

      <div className="acciones-superiores">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />

        <button className="btn-agregar" onClick={abrirModalNuevo}>
          + Agregar Usuario
        </button>
      </div>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre completo</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.nombre} {u.apellido}</td>
              <td>{u.email}</td>
              <td>{u.telefono}</td>
              <td>{u.direccion}</td>
              <td>{u.id_rol}</td>
              <td className="acciones-td">
                <button className="btn-editar" onClick={() => abrirModalEditar(u)}>
                  <img src="/img/lapiz.png" alt="Editar" />
                </button>

                <button className="btn-eliminar" onClick={() => eliminarUsuario(u.id_usuario)}>
                  <img src="/img/basura.png" alt="Eliminar" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* modal */}
      {mostrarModal && (
        <div className="overlay-formulario">
          <div className="modal-formulario">
            <h3>{usuarioEditando ? "Editar Usuario" : "Agregar Usuario"}</h3>

            <form onSubmit={enviarFormulario}>
              <div className="input-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="input-group">
                <label>Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={manejarCambio}
                  required
                />
              </div>

              {!usuarioEditando && (
                <div className="input-group">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label>Teléfono:</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={manejarCambio}
                />
              </div>

              <div className="input-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={manejarCambio}
                />
              </div>

              <div className="input-group">
                <label>Rol (ID):</label>
                <input
                  type="number"
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={manejarCambio}
                  min="1"
                />
              </div>

              <div className="botones-formulario">
                <button type="submit" className="btn-confirmar">
                  {usuarioEditando ? "Actualizar" : "Agregar"}
                </button>

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
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

export default AdminUsuarios;
