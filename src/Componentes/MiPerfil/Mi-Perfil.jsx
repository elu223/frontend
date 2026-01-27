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

  // cargar datos del usuario desde el contexto
  useEffect(() => {
    if (user) {
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

  const manejarSubmit = (e) => {
    e.preventDefault();
    
    // no permitir cambiar el email
    if (usuario.email !== user.email) {
      alert("no puedes cambiar tu correo electrónico");
      setUsuario({...usuario, email: user.email});
      return;
    }
    
    console.log("información del usuario actualizada:", usuario);
    alert("perfil actualizado correctamente");
    setModoEdicion(false);
  };

  return (
    <div className="mi-perfil-contenedor">
      <HeaderMenu />
      <div className="mi-perfil">
      
      <div className="titulo-perfil">
        <h2 className="h2">mi perfil</h2>
      </div>

      <div className="container-perfil">

        <div className="perfil-usuario">
          <img src={usuario.avatar} alt="avatar del usuario" className="avatar-imagen" />
          <h3>{usuario.nombre || "sin nombre"} {usuario.apellido || ""}</h3>
          <p>{usuario.email || "sin email"}</p>
          <p>{usuario.telefono || "sin teléfono"}</p>
          <p>{usuario.direccion || "sin dirección"}</p>

          <button className="editar-perfil-btn" onClick={() => setModoEdicion(!modoEdicion)}>
            {modoEdicion ? "cancelar" : "editar perfil"}
          </button>
        </div>

        {modoEdicion && (
          <form className="perfil-formulario" onSubmit={manejarSubmit}>
            <label>
              nombre:
              <input 
                type="text" 
                name="nombre" 
                value={usuario.nombre} 
                onChange={manejarCambio} 
                placeholder="ingresa tu nombre"
              />
            </label>

            <label>
              apellido:
              <input 
                type="text" 
                name="apellido" 
                value={usuario.apellido} 
                onChange={manejarCambio} 
                placeholder="ingresa tu apellido"
              />
            </label>

            <label>
              email:
              <input 
                type="email" 
                name="email" 
                value={usuario.email} 
                onChange={manejarCambio} 
                placeholder="ingresa tu email"
                readOnly
              />
            </label>

            <label>
              teléfono:
              <input 
                type="text" 
                name="telefono" 
                value={usuario.telefono} 
                onChange={manejarCambio} 
                placeholder="ingresa tu teléfono"
              />
            </label>

            <label>
              dirección:
              <input 
                type="text" 
                name="direccion" 
                value={usuario.direccion} 
                onChange={manejarCambio} 
                placeholder="ingresa tu dirección"
              />
            </label>

            <div className="seleccion-avatar">
              <p>seleccioná tu avatar:</p>
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
                    alt="avatar"
                    className={`avatar-opcion ${usuario.avatar === ruta ? "seleccionado" : ""}`}
                    onClick={() => manejarAvatar(ruta)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="guardar-btn">guardar cambios</button>
          </form>
        )}

        <div className="mis-comentarios">
          <h3>mis comentarios</h3>
          <ul>
            <li>no tienes comentarios aún.</li>
          </ul>
        </div>
      </div>

      <div className="mis-compras">
        <div className="titulo-compras">
          <h2 className="h2">mis compras</h2>
        </div>

        <ul>
          <li>no has realizado compras aún.</li>
        </ul>
      </div>
      </div>

      <Footer />
    </div>
  );
}

export default MiPerfil;