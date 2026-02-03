import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthProvider";
import axios from "axios";
import "./Mi-Perfil.css";

function MiPerfil() {
  const { user, login } = useAuth();
  
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    avatar: "./img/1.png",
  });

  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setUsuario({
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
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const manejarAvatar = (ruta) => {
    setUsuario({...usuario, avatar: ruta});
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    
    // Verificar email
    if (usuario.email !== user.email) {
      alert("no puedes cambiar tu correo electrónico");
      setUsuario({...usuario, email: user.email});
      return;
    }
    
    // CAMBIO IMPORTANTE: Enviar id_rol también
    axios.put(`http://localhost:5000/usuarios/${user.id_usuario}`, {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
      avatar: usuario.avatar,
      id_rol: user.id_rol // ← AÑADIR ESTO, es requerido por tu backend
    })
    .then((response) => {
      console.log("Respuesta del backend:", response.data); // Para debug
      
      // Tu backend responde con {mensaje: "...", usuario: {...}}
      if (response.data && response.data.usuario) {
        const datosActualizados = {
          ...user, // Mantiene token, id_usuario
          nombre: response.data.usuario.nombre,
          apellido: response.data.usuario.apellido,
          telefono: response.data.usuario.telefono,
          direccion: response.data.usuario.direccion,
          avatar: usuario.avatar, // ← Usar el avatar del estado actual
          id_rol: response.data.usuario.id_rol
        };
        login(datosActualizados);
      }
      
      alert("perfil actualizado correctamente");
      setModoEdicion(false);
    })
    .catch((error) => {
      console.error("error completo:", error.response?.data || error);
      alert("error al actualizar perfil: " + (error.response?.data?.error || error.message));
    });
  };

  return (
    <div className="mi-perfil-contenedor">
      <div className="mi-perfil">
        <div className="titulo-perfil">
          <h2 className="h2">mi perfil</h2>
        </div>

        <div className="container-perfil">
          <div className="perfil-usuario">
            <img src={usuario.avatar} alt="avatar" className="avatar-imagen" />
            <h3>{usuario.nombre} {usuario.apellido}</h3>
            <p>{usuario.email}</p>
            <p>{usuario.telefono || "sin teléfono"}</p>
            <p>{usuario.direccion || "sin dirección"}</p>

            <button className="editar-perfil-btn" onClick={() => setModoEdicion(!modoEdicion)}>
              {modoEdicion ? "cancelar" : "editar perfil"}
            </button>
          </div>

          {modoEdicion && (
            <form className="perfil-formulario" onSubmit={manejarSubmit}>
              <label>nombre:
                <input type="text" name="nombre" value={usuario.nombre} onChange={manejarCambio} />
              </label>

              <label>apellido:
                <input type="text" name="apellido" value={usuario.apellido} onChange={manejarCambio} />
              </label>

              <label>email:
                <input type="email" name="email" value={usuario.email} onChange={manejarCambio} readOnly />
              </label>

              <label>teléfono:
                <input type="text" name="telefono" value={usuario.telefono} onChange={manejarCambio} />
              </label>

              <label>dirección:
                <input type="text" name="direccion" value={usuario.direccion} onChange={manejarCambio} />
              </label>

              <div className="seleccion-avatar">
                <p>seleccioná tu avatar:</p>
                <div className="opciones-avatar">
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <img
                      key={num}
                      src={`./img/${num}.png`}
                      alt="avatar"
                      className={`avatar-opcion ${usuario.avatar === `./img/${num}.png` ? "seleccionado" : ""}`}
                      onClick={() => manejarAvatar(`./img/${num}.png`)}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="guardar-btn">guardar cambios</button>
            </form>
          )}

          <div className="mis-comentarios">
            <h3>mis comentarios</h3>
            <ul><li>no tienes comentarios aún.</li></ul>
          </div>
        </div>

        <div className="mis-compras">
          <div className="titulo-compras">
            <h2 className="h2">mis compras</h2>
          </div>
          <ul><li>no has realizado compras aún.</li></ul>
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;