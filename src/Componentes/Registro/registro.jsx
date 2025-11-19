import { useState } from "react";
import { useLocation } from "wouter";
import axios from 'axios'; // Importar axios
import "./registro.css";
import Footer from "../Footer/Footer";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // USAR AXIOS - no fetch
      const response = await axios.post('/usuarios/register', {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        telefono: "",
        direccion: ""
      });

      const data = response.data;
      
      console.log('Respuesta del backend:', data); // Para debugging
      
      // Guardar usuario en localStorage
      const userData = {
        token: data.token,
        name: data.usuario.nombre,
        apellido: data.usuario.apellido,
        email: data.usuario.email,
        rol: data.usuario.id_rol
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Disparar evento para que HeaderMenu se actualice
      window.dispatchEvent(new Event('storage'));
      
      // Redirigir al home
      setLocation("/");
      
    } catch (error) {
      console.error('Error en el registro:', error);
      console.log('Response data:', error.response?.data);
      console.log('Response status:', error.response?.status);
      
      if (error.response) {
        alert(`Error: ${error.response.data}`);
      } else if (error.request) {
        alert('Error de conexión. Verifica que el backend esté corriendo.');
      } else {
        alert('Error inesperado: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        <h2 className="registro-title">Registrarse</h2>

        <div className="avatar-circle">
          <img src="/img/icon-user.png" alt="icono usuario" className="avatar-img" />
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-icon-wrapper">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                minLength="6"
              />
              <span
                className="icon-eye"
                onClick={() => setShowPass(!showPass)}
              >
                👁
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmar contraseña</label>
            <div className="input-icon-wrapper">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
                minLength="6"
              />
              <span
                className="icon-arrow"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                ⌄
              </span>
            </div>
          </div>

          <div className="button-row">
            <button 
              type="submit" 
              className="btn-confirmar"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Confirmar"}
            </button>

            <a href="/iniciar-sesion" className="btn-login">
              Iniciar sesión
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Registro;