// En Login.jsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import './Login.css'; 
import Footer from '../Footer/Footer.jsx';
import { useAuth } from '../../auth/AuthProvider';

// Configuración simple de axios
axios.defaults.baseURL = 'http://localhost:5000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { loginWithToken } = useAuth();

  const iniciarSesion = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post('/usuarios/login', {
      email: email, 
      password: password 
    })
    .then((response) => {
      const data = response.data;
      const { token, usuario } = data;
      const userPayload = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        id_rol: usuario.id_rol,
        id_usuario: usuario.id_usuario,
      };

      // usar el contexto de auth para normalizar y guardar
      if (typeof loginWithToken === 'function') {
        loginWithToken({ token, user: userPayload });
      } else {
        localStorage.setItem('user', JSON.stringify({ ...userPayload, token }));
      }

      // Redirigir según el rol
      if (usuario.id_rol === 1) {
        setLocation('/admin');
      } else {
        setLocation('/');
      }

      setLoading(false);
    })
    .catch((error) => {
      console.error('Error en login:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    });
  }

  return (
    <div className="login-container"> 
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <form 
          className="login-form"
          onSubmit={(e) => iniciarSesion(e)}
        >
          <div className="input-group">
            <label className="input-label">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <div className="input-icon-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
              <span
                className="icon-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Aceptar"}
          </button>
        </form>

        <div className="login-links">
          <a href="#" className="link">¿Olvidaste tu contraseña?</a>
          <a href="/registrarse" className="link">Registrarse</a>
        </div>
      </div>
      <Footer />  
    </div>
  );
}

export default Login;