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
    id_rol: "1"
  });

  // Cargar usuarios
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    axios.get("http://localhost:5000/usuarios")
      .then(res => setUsuarios(res.data))
      .catch(err => console.log("Error:", err));
  };

  // Funciones modal
  const abrirNuevo = () => {
    setUsuarioEditando(null);
    setFormData({ 
      nombre: "", 
      apellido: "", 
      email: "", 
      password: "", 
      telefono: "", 
      direccion: "", 
      id_rol: "1" 
    });
    setMostrarModal(true);
  };

  const abrirEditar = (u) => {
    setUsuarioEditando(u.id_usuario);
    setFormData({
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      password: "",
      telefono: u.telefono || "",
      direccion: u.direccion || "",
      id_rol: u.id_rol.toString()
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioEditando(null);
  };

  // Guardar usuario
  const guardarUsuario = (e) => {
    e.preventDefault();
    
    if (usuarioEditando) {
      // Editar
      axios.put(`http://localhost:5000/usuarios/${usuarioEditando}`, formData)
        .then(() => {
          cargarUsuarios();
          cerrarModal();
          alert("Usuario actualizado");
        })
        .catch(error => {
          console.log("Error:", error);
          alert("Error: " + (error.response?.data?.error || "No se pudo actualizar"));
        });
    } else {
      // Nuevo usuario
      axios.post("http://localhost:5000/usuarios", formData)
        .then(() => {
          cargarUsuarios();
          cerrarModal();
          alert("Usuario agregado");
        })
        .catch(error => {
          console.log("Error:", error);
          alert("Error: " + error.response?.data);
        });
    }
  };

  // Eliminar
  const eliminarUsuario = (id) => {
    if (!confirm("¿Eliminar usuario?")) return;
    
    axios.delete(`http://localhost:5000/usuarios/${id}`)
      .then(() => {
        cargarUsuarios();
        alert("Usuario eliminado");
      })
      .catch(error => {
        console.log("Error:", error);
        alert("Error: " + error.response?.data?.error);
      });
  };

  // Filtrar
  const filtrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenido-admin">
      <div className="header-productos">
        <h1 className="titulo-principal">Usuarios</h1>
      </div>

      <div className="acciones-superiores">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
        <button className="btn-agregar" onClick={abrirNuevo}>
          + Agregar Usuario
        </button>
      </div>

      <div className="tabla-container">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(u => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.email}</td>
                <td>{u.telefono || "-"}</td>
                <td>{u.direccion || "-"}</td>
                <td>
                  <span className={u.id_rol === 1 ? 'rol-admin' : 'rol-cliente'}>
                    {u.id_rol === 1 ? 'Admin' : 'Cliente'}
                  </span>
                </td>
                <td className="acciones-td">
                  <button className="btn-editar" onClick={() => abrirEditar(u)}>
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
      </div>

      {mostrarModal && (
        <div className="overlay-formulario">
          <div className="modal-formulario">
            <h3>{usuarioEditando ? "Editar Usuario" : "Agregar Usuario"}</h3>
            <form onSubmit={guardarUsuario}>
              <div className="input-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={formData.nombre} 
                  onChange={e => setFormData({...formData, nombre: e.target.value})} required />
              </div>
              
              <div className="input-group">
                <label>Apellido:</label>
                <input type="text" name="apellido" value={formData.apellido}
                  onChange={e => setFormData({...formData, apellido: e.target.value})} required />
              </div>
              
              <div className="input-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              
              {!usuarioEditando && (
                <div className="input-group">
                  <label>Contraseña:</label>
                  <input type="password" name="password" value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
              )}
              
              <div className="input-group">
                <label>Teléfono:</label>
                <input type="text" name="telefono" value={formData.telefono}
                  onChange={e => setFormData({...formData, telefono: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Dirección:</label>
                <input type="text" name="direccion" value={formData.direccion}
                  onChange={e => setFormData({...formData, direccion: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Rol:</label>
                <select name="id_rol" value={formData.id_rol}
                  onChange={e => setFormData({...formData, id_rol: e.target.value})}>
                  <option value="1">Administrador</option>
                  <option value="2">Cliente</option>
                </select>
              </div>
              
              <div className="botones-formulario">
                <button type="submit" className="btn-confirmar">
                  {usuarioEditando ? "Actualizar" : "Agregar"}
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

export default AdminUsuarios;