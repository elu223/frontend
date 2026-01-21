import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "../../auth/AuthProvider";
import HeaderMenu from "../Header/Header-Menu.jsx";
import Footer from "../Footer/Footer.jsx";
import "./Mi-Perfil.css";

function MiPerfil() {
  const { user } = useAuth();
  
  const [usuario, setUsuario] = useState({
    id_usuario: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    avatar: "./img/1.png",
  });

  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar datos del usuario desde el contexto de autenticación
  useEffect(() => {
    if (user) {
      console.log('User desde contexto:', user);
      setUsuario({
        id_usuario: user.id_usuario,
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        avatar: user.avatar || "./img/1.png"
      });
    }
  }, [user]);

  const comentariosPorUsuario = {
    "": [],
  };

  const comprasPorUsuario = {
    "": [],
  };

  const manejarCambio = (e) => {
    const nuevoUsuario = {
      ...usuario,
      [e.target.name]: e.target.value,
    };
    setUsuario(nuevoUsuario);
  };

  const manejarAvatar = (ruta) => {
    const nuevoUsuario = {
      ...usuario,
      avatar: ruta,
    };
    setUsuario(nuevoUsuario);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    console.log("Información del usuario actualizada:", usuario);
    alert("Perfil actualizado correctamente");
    setModoEdicion(false);
  };

  return (
    <div className="mi-perfil-contenedor">
      <HeaderMenu />
      <div className="mi-perfil">
      
      <div className="titulo-perfil">
        <h2 className="h2">Mi Perfil</h2>
      </div>

      <div className="container-perfil">

        <div className="perfil-usuario">
          <img src={usuario.avatar} alt="Avatar del usuario" className="avatar-imagen" />
          <h3>{usuario.nombre || "Sin nombre"} {usuario.apellido || ""}</h3>
          <p>{usuario.email || "Sin email"}</p>
          <p>{usuario.telefono || "Sin teléfono"}</p>
          <p>{usuario.direccion || "Sin dirección"}</p>

          <button className="editar-perfil-btn" onClick={() => setModoEdicion(!modoEdicion)}>
            {modoEdicion ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        {modoEdicion && (
          <form className="perfil-formulario" onSubmit={manejarSubmit}>
            <label>
              Nombre:
              <input 
                type="text" 
                name="nombre" 
                value={usuario.nombre} 
                onChange={manejarCambio} 
                placeholder="Ingresa tu nombre"
              />
            </label>

            <label>
              Apellido:
              <input 
                type="text" 
                name="apellido" 
                value={usuario.apellido} 
                onChange={manejarCambio} 
                placeholder="Ingresa tu apellido"
              />
            </label>

            <label>
              Email:
              <input 
                type="email" 
                name="email" 
                value={usuario.email} 
                onChange={manejarCambio} 
                placeholder="Ingresa tu email"
              />
            </label>

            <label>
              Teléfono:
              <input 
                type="text" 
                name="telefono" 
                value={usuario.telefono} 
                onChange={manejarCambio} 
                placeholder="Ingresa tu teléfono"
              />
            </label>

            <label>
              Dirección:
              <input 
                type="text" 
                name="direccion" 
                value={usuario.direccion} 
                onChange={manejarCambio} 
                placeholder="Ingresa tu dirección"
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
                    className={`avatar-opcion ${usuario.avatar === ruta ? "seleccionado" : ""}`}
                    onClick={() => manejarAvatar(ruta)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="guardar-btn">Guardar Cambios</button>
          </form>
        )}

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
      </div>

      <div className="mis-compras">
        <div className="titulo-compras">
          <h2 className="h2">Mis Compras</h2>
        </div>

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

      <Footer />
    </div>
  );
}

export default MiPerfil;