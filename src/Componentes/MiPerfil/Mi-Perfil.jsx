
import { useState } from "react";
import HeaderMenu from "../Header/Header-Menu.jsx";
import './Mi-Perfil.css';

function MiPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: 'Milagros',
    email: '', // Puedes inicializarlo con datos del usuario si los tienes
    direccion: '', // O dejarlo vacío para que el usuario lo complete
  });

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




return (
  <div className="mi-perfil">
    <HeaderMenu />
      <div className="perfil-titulo"> 
        <h2>Mi Perfil</h2>
      </div>
        <div className="container-perfil">
        <div className="perfil-usuario">
                  <div className={`avatar avatar-${avatar}`}>
                      <span className="iniciales">{usuario.nombre.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3>{usuario.nombre}</h3>
                  <p>{correo}</p>
              </div>

            <div className="mis-comentarios">
                    <h3>Mis Comentarios</h3>
                    <ul>
                        <li>Comentario 1: Me encanta este sitio web!</li>
                        <li>Comentario 2: Los productos son de excelente calidad.</li>
                        <li>Comentario 3: El servicio al cliente es muy amable.</li>
                    </ul>

                </div>
          </div>
      </div>
    );
}

export default MiPerfil;
