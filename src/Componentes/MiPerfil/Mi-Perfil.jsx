import { useState } from "react";
import { Link } from "wouter";
import "./Mi-Perfil.css";

function MiPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: "Milagros",
    email: "milagros@gmail.com",
    direccion: "Río Grande, Tierra del Fuego",
    avatar: "/img/avatares/avatar1.png", // imagen de perfil
  });

  const [modoEdicion, setModoEdicion] = useState(false);

  const comentariosPorUsuario = {
    "Milagros": [
      "Me encanta este sitio web!",
      "Los productos son de excelente calidad.",
      "El servicio al cliente es muy amable.",
    ],
    "Invitado": ["Aún no tienes comentarios."],
  };

  const comprasPorUsuario = {
    "Milagros": [
      "Suéter de lana - 20/05/2024",
      "Bufanda tejida - 15/06/2024",
      "Guantes de punto - 10/07/2024",
    ],
    "Invitado": ["Todavía no realizaste compras."],
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarAvatar = (ruta) => {
    setUsuario((prev) => ({ ...prev, avatar: ruta }));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    console.log("Perfil actualizado:", usuario);
    setModoEdicion(false);
  };

  return (
    <div className="mi-perfil">
      {/* HEADER */}
      <header className="header-ecommerce">
        <div className="container">
          <div className="logo-container">
            <Link href="/" className="logo-link">
              <img
                src="/img/logo.png"
                alt="Logo TejidosMiki"
                className="logo-imagen"
              />
              <h1 className="logo-texto">TejidosMiki</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* PERFIL */}
      <div className="perfil-titulo">
        <h2>Mi Perfil</h2>
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

            <button type="submit" className="guardar-btn">
              Guardar Cambios
            </button>
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
}

export default MiPerfil;
