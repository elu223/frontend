import { Link } from "wouter";
import { useState } from "react";
import HeaderMenu from "../Menu/Header-Menu.jsx";
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
    return (
      <div className="mi-perfil">
        <header className="header-ecommerce">
          <div className="container">
            <div className="logo-container">
              <Link href="/" className="logo-link">
                <img src="/img/logo.png" alt="Logo TejidosMiki" className="logo-imagen" />
                <h1 className="logo-texto">TejidosMiki</h1>
              </Link>
            </div>
            <HeaderMenu />
          </div>
        </header>
        <main className="main-content">
          <div className="container perfil-contenedor">
            <div className="perfil-titulo"> 
                <h2>Mi Perfil</h2>
            </div>
            
            <form className="perfil-formulario">
                <label> Nombre:
                  <input
                    type="text" 
                    name="nombre"
                    value={usuario.nombre}
                    onChange={manejarCambio}
                  />
                </label>            
                <label> Email:
                  <input
                    type="email"    
                    name="email"
                    value={usuario.email}
                    onChange={manejarCambio}
                  />
                </label>
                <label> Dirección:
                  <input
                    type="text"
                    name="direccion"
                    value={usuario.direccion}
                    onChange={manejarCambio}
                  />
                </label>
                <button type="submit" className="perfil-guardar-btn">Guardar Cambios</button>
                <button type="button" className="perfil-cancelar-btn">Cancelar</button>

                
                <div className="mis-comentarios">
                    <h3>Mis Comentarios</h3>
                    <ul>
                        <li>Comentario 1: Me encanta este sitio web!</li>
                        <li>Comentario 2: Los productos son de excelente calidad.</li>
                        <li>Comentario 3: El servicio al cliente es muy amable.</li>
                    </ul>

                </div>
            </form>
          </div>
        </main>
        </div>
    );
}

export default MiPerfil;
