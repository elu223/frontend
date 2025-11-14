
import { useState } from "react";
import HeaderMenu from "../Header/Header-Menu.jsx";
import './Mi-Perfil.css';

function MiPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: 'Milagros',
    email: '',
    direccion: '',
  });

  const colores = [
  'black', 'blue', 'purple', 'red',
  'green', 'orange', 'pink', 'gray'
  ];
  const [nombre, setNombre] = useState('');
  const [correo] = useState('CorreoUs@gmail.com');
  const [avatar, setAvatar] = useState('green');
    const manejarCambio = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Información del usuario:', usuario);
  };



}
return (
  <div className="mi-perfil">
    <HeaderMenu />
      <div className="perfil-titulo"> 
        <h2 className="perfil-h2">Mi Perfil</h2>
      </div>
        <div className="container-perfil">
        <div className="perfil-usuario">
          <img
            src={usuario.avatar}
            alt="Avatar del usuario"
            className="avatar-imagen"
          />
          <h3>{usuario.nombre}</h3>
          <p>{usuario.email}</p>
          <p>{usuario.direccion}</p>

          <button
            className="editar-perfil-btn"
            onClick={() => setModoEdicion(!modoEdicion)}
          >
            {modoEdicion ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        {modoEdicion && (
          <form className="perfil-formulario" onSubmit={manejarSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={manejarCambio}
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={usuario.email}
                onChange={manejarCambio}
              />
            </label>

            <label>
              Dirección:
              <input
                type="text"
                name="direccion"
                value={usuario.direccion}
                onChange={manejarCambio}
              />
            </label>

            <div className="seleccion-avatar">
              <p>Seleccioná tu avatar:</p>
              <div className="opciones-avatar">
                {[
                  "./img/1.png",
                  "./img/2.png",
                  "./img/3.png",
                  "./img/4.png",
                  "./img/5.png",
                  "./img/6.png",
                  "./img/7.png",
                  "./img/8.png",
                ].map((ruta) => (
                  <img
                    key={ruta}
                    src={ruta}
                    alt="Avatar"
                    className={`avatar-opcion ${
                      usuario.avatar === ruta ? "seleccionado" : ""
                    }`}
                    onClick={() => manejarAvatar(ruta)}
                  />
                ))}
              </div>
            </div>
            <div className="mis-comentarios">
              <h3>Mis Comentarios</h3>
              <ul>
                <li>Comentario 1: Me encanta este sitio web!</li>
                <li>Comentario 2: Los productos son de excelente calidad.</li>
                <li>Comentario 3: El servicio al cliente es muy amable.</li>
              </ul>
            </div>
          </form>
        )}
        
        {/* COMENTARIOS */}
        <div className="mis-comentarios">
          <h3>Mis Comentarios</h3>
          <ul>
            {comentariosPorUsuario[usuario.nombre] ? (
              comentariosPorUsuario[usuario.nombre].map((comentario, i) => (
                <li key={i}>{comentario}</li>
              ))
            ) : (
              <li>No tienes comentarios aún.</li>
            )}
          </ul>
        </div>
        {/* COMPRAS */}
        </div>
        <div className="mis-compras">
          <h3>Mis Compras</h3>      
          <ul>
            {comprasPorUsuario[usuario.nombre] ? (
              comprasPorUsuario[usuario.nombre].map((compra, i) => (
                <li key={i}>{compra}</li> 

              ))
            ) : (
              <li>No has realizado compras aún.</li>
            )}
          </ul>
      </div>
  </div>
  
);

export default MiPerfil;
