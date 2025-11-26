import React, { useEffect, useState } from "react";
import "./AdminUsuarios.css";
import axios from "axios";
import { getUsuarios } from "../services/usuariosService.js";
import AccionesUsuarioModal from "./AccionesUsuarioModal";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const handleBusqueda = (e) => setBusqueda(e.target.value);

  // ================================
  // 🔌 OBTENER USUARIOS DEL BACKEND
  // ================================
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const data = await getUsuarios(); // 👉 usando tu SERVICE
        setUsuarios(data);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    obtenerUsuarios();
  }, []);

  // ================================
  // 🟡 BLOQUEAR / DESBLOQUEAR
  // ================================
  const handleBloquear = async () => {
    if (!usuarioSeleccionado) return;

    try {
      await axios.put(
        `http://localhost:3000/usuarios/bloquear/${usuarioSeleccionado.id_usuario}`
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === usuarioSeleccionado.id_usuario
            ? { ...u, estado: u.estado === "Bloqueado" ? "Activo" : "Bloqueado" }
            : u
        )
      );

      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error("Error al bloquear:", error);
    }
  };

  // ================================
  // 🔴 ELIMINAR USUARIO
  // ================================
  const handleEliminar = async () => {
    if (!usuarioSeleccionado) return;

    try {
      await axios.delete(
        `http://localhost:3000/usuarios/${usuarioSeleccionado.id_usuario}`
      );

      setUsuarios((prev) =>
        prev.filter((u) => u.id_usuario !== usuarioSeleccionado.id_usuario)
      );

      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // ================================
  // 🔍 BUSCADOR
  // ================================
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

      {/* ========================== */}
      {/* 🔎 BUSCADOR                */}
      {/* ========================== */}
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={busqueda}
        onChange={handleBusqueda}
        className="input-busqueda"
      />

      {/* ========================== */}
      {/* 🧾 TABLA DE USUARIOS       */}
      {/* ========================== */}
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

      {/* ========================== */}
      {/* 🪟 MODAL DE ACCIONES        */}
      {/* ========================== */}
      {usuarioSeleccionado && (
        <AccionesUsuarioModal
          usuario={usuarioSeleccionado}
          onClose={() => setUsuarioSeleccionado(null)}
          onBlock={handleBloquear}
          onDelete={handleEliminar}
        />
      )}
    </div>
  );
}

export default AdminUsuarios;
