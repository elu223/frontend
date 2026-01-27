import { useState } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import './Login.css'; 
import Footer from '../Footer/Footer.jsx';
import { useAuth } from '../../auth/AuthProvider';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const iniciarSesion = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post('http://localhost:5000/usuarios/login', {
      email: email, 
      password: password 
    })
    .then((response) => {
      const data = response.data;
      const userData = {
        id_usuario: data.usuario.id_usuario,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        email: data.usuario.email,
        id_rol: data.usuario.id_rol,
        token: data.token
      };

      // guardar usuario
      login(userData);

      // redirigir según el rol
      if (data.usuario.id_rol === 1) {
        setLocation('/admin');
      } else {
        setLocation('/');
      }

      setLoading(false);
    })
    .catch((error) => {
      console.error('error en login:', error);
      alert('error: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    });
  }

  return (
    <div className="login-container"> 
      <div className="login-box">
        <h2 className="login-title">iniciar sesión</h2>
        
        <form className="login-form" onSubmit={iniciarSesion}>
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
              <span className="icon-eye" onClick={() => setShowPassword(!showPassword)}>
                👁
              </span>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "iniciando sesión..." : "aceptar"}
          </button>
        </form>

        <div className="login-links">
          <p className='parrafo-Login'>¿No tienes una cuenta?</p>
          <a href="/registrarse" className="link">Registrarse</a>
        </div>
      </div>
      <Footer />  
    </div>
  );
}

export default Login;