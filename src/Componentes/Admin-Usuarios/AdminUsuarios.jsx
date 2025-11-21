import React, { useEffect, useState } from "react";
import "./AdminUsuarios.css";
// Importamos el nuevo componente Modal


function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  // Nuevo estado: Almacena el usuario seleccionado para el modal
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); 

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  // --- Lógica de la API o Simulación ---
  useEffect(() => {
    // Datos simulados (con tus rutas de imagen)
    setUsuarios([
      {
        id: 1,
        avatar: "./img/1.png",
        username: "MAmyBorrALASftos",
        email: "jeloumoto@gmail.com",
        estado: "Activo",
        ultimoLogin: "2025-02-04 14:32"
      },
      {
        id: 2,
        avatar: "./img/8.png",
        username: "juanito124_owo",
        email: "kkck2@gmail.com",
        estado: "Inactivo",
        ultimoLogin: "2025-02-01 10:05"
      },
      {
        id: 3,
        avatar: "./img/8.png",
        username: "TuChacalitaUwU",
        email: "example3@gmail.com",
        estado: "Bloqueado",
        ultimoLogin: "2025-01-18 19:10"
      }
    ]);
  }, []);

  // --- Funciones para el Modal ---
  const abrirModal = (user) => {
    setUsuarioSeleccionado(user);
  };

  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
  };
  
  // Implementar acciones (Bloquear/Eliminar)
  const handleBloquear = () => {
    if (usuarioSeleccionado) {
      console.log(`Bloqueando usuario con ID: ${usuarioSeleccionado.id}`);
      // *Aquí va la llamada a la API de Bloqueo*
      cerrarModal();
    }
  };

  const handleEliminar = () => {
    if (usuarioSeleccionado) {
      console.log(`Eliminando usuario con ID: ${usuarioSeleccionado.id}`);
      // *Aquí va la llamada a la API de Eliminación*
      cerrarModal();
    }
  };

  // Función para determinar la clase de estilo basada en el estado
  const getEstadoClass = (estado) => {
    if (estado === "Activo") return "estado-activo";
    if (estado === "Inactivo") return "estado-inactivo";
    if (estado === "Bloqueado") return "estado-bloqueado";
    return "";
  };
  
  // Filtrado
  const usuariosFiltrados = usuarios.filter(user =>
    user.username.toLowerCase().includes(busqueda.toLowerCase()) ||
    user.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="admin-usuarios-container">
      
      <h2 className="titulo-h2"><img className="logo-admin" src="./img/logo.png" alt="logo" /> Usuarios</h2>
    
      <input
        type="text"
        placeholder="Buscar usuarios por nombre o email..."
        value={busqueda}
        onChange={handleBusqueda}
        className="input-busqueda"
      />

      {/* --- ESTRUCTURA DE LA TABLA --- */}
      <div className="tabla-encabezado">
        <div className="columna-select"></div> 
        <span>User_Name</span>
        <span>Correo Electrónico</span>
        <span>Estado</span>
        <span>Último inicio de sesión</span>
      </div>

      <div className="usuarios-lista">
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((user) => (
            // AÑADIMOS EL EVENTO onClick y la clase 'clickable-item'
            <div 
                className="usuario-item clickable-item" 
                key={user.id}
                onClick={() => abrirModal(user)} // Al hacer clic en la fila, abre el modal
            >
              <div className="columna-select">
                {/* Agregamos e.stopPropagation() para que al chequear NO se abra el modal */}
                <input type="checkbox" className="check" onClick={(e) => e.stopPropagation()} />
                <img src={user.avatar} alt={`Avatar de ${user.username}`} className="avatar" />
              </div>

              <span className="user-name">{user.username}</span>
              <span className="email">{user.email}</span>
              
              <span className={`estado ${getEstadoClass(user.estado)}`}>
                {user.estado}
              </span>
              
              <span className="ultimo-login">{user.ultimoLogin}</span>
            </div>
          ))
        ) : (
          <p className="no-usuarios">No se encontraron usuarios.</p>
        )}
      </div>

      {/* 3. Renderizamos el Modal si hay un usuario seleccionado */}
      {usuarioSeleccionado && (
        <AccionesUsuarioModal
          usuario={usuarioSeleccionado}
          onClose={cerrarModal}
          onBlock={handleBloquear}
          onDelete={handleEliminar}
        />
      )}
    </div>
  );
}

export default AdminUsuarios;