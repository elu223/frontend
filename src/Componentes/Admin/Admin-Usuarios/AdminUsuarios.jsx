import React, { useEffect, useState } from "react";
import "./AdminUsuarios.css";
import axios from "axios";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const handleBusqueda = (e) => setBusqueda(e.target.value);

  // OBTENER USUARIOS
  useEffect(() => {
    axios
      .get("http://localhost:5000/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.log("Error obteniendo usuarios:", err));
  }, []);

  // BLOQUEAR
  const handleBloquear = () => {
    if (!usuarioSeleccionado) return;

    axios
      .put(
        `http://localhost:5000/usuarios/bloquear/${usuarioSeleccionado.id_usuario}`
      )
      .then(() => {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id_usuario === usuarioSeleccionado.id_usuario
              ? { ...u, estado: u.estado === "Bloqueado" ? "Activo" : "Bloqueado" }
              : u
          )
        );
        setUsuarioSeleccionado(null);
      })
      .catch((err) => console.log("Error al bloquear:", err));
  };

  // ELIMINAR
  const handleEliminar = () => {
    if (!usuarioSeleccionado) return;

    axios
      .delete(
        `http://localhost:5000/usuarios/${usuarioSeleccionado.id_usuario}`
      )
      .then(() => {
        setUsuarios((prev) =>
          prev.filter((u) => u.id_usuario !== usuarioSeleccionado.id_usuario)
        );
        setUsuarioSeleccionado(null);
      })
      .catch((err) => console.log("Error al eliminar:", err));
  };

  const usuariosFiltrados = usuarios.filter(
    (user) =>
      `${user.nombre} ${user.apellido}`
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      user.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="admin-usuarios-container">
      <h2 className="titulo-h2">
        <img className="logo-admin" src="./img/logo.png" alt="logo" /> Usuarios
      </h2>

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={busqueda}
        onChange={handleBusqueda}
        className="input-busqueda"
      />

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Registro</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((user) => (
              <tr
                key={user.id_usuario}
                className="clickable-item"
                onClick={() => setUsuarioSeleccionado(user)}
              >
                <td>{user.id_usuario}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.direccion}</td>
                <td>{user.fecha_registro}</td>
                <td>{user.id_rol}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-usuarios">
                No hay usuarios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
