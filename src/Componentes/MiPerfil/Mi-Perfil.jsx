import { useState } from "react";
import { Link } from "wouter";
import HeaderMenu from "../Header/Header-Menu.jsx";
import Footer from "../Footer/Footer.jsx";
import "./Mi-Perfil.css";

function MiPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: "Milagros",
    email: "",
    direccion: "",
    avatar: "./img/1.png",
  });

  const [modoEdicion, setModoEdicion] = useState(false);

  const comentariosPorUsuario = {
    Milagros: [
      "Me encanta este sitio web!",
      "Los productos son de excelente calidad.",
      "El servicio al cliente es muy amable.",
    ],
  };

  const comprasPorUsuario = {
    Milagros: ["Falda satinada", "Blusa rosa pastel", "Hilo encerado x2"],
  };

  const manejarCambio = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const manejarAvatar = (ruta) => {
    setUsuario({
      ...usuario,
      avatar: ruta,
    });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    console.log("Información del usuario actualizada:", usuario);
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
          <h3>{usuario.nombre}</h3>
          <p>{usuario.email || "Sin email"}</p>
          <p>{usuario.direccion || "Sin dirección"}</p>

          <button className="editar-perfil-btn" onClick={() => setModoEdicion(!modoEdicion)}>
            {modoEdicion ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        {modoEdicion && (
          <form className="perfil-formulario" onSubmit={manejarSubmit}>
            <label>
              Nombre:
              <input type="text" name="nombre" value={usuario.nombre} onChange={manejarCambio} />
            </label>

            <label>
              Email:
              <input type="email" name="email" value={usuario.email} onChange={manejarCambio} />
            </label>

            <label>
              Dirección:
              <input type="text" name="direccion" value={usuario.direccion} onChange={manejarCambio} />
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
