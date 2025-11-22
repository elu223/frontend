// En Login.jsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import './Login.css'; 
import Footer from '../Footer/Footer.jsx';

// Configuración simple de axios
axios.defaults.baseURL = 'http://localhost:5000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/usuarios/login', {
        email: email, 
        password: password 
      });

      const data = response.data;
      
      const userData = {
        token: data.token,
        name: data.usuario.nombre,   
        apellido: data.usuario.apellido, 
        email: data.usuario.email, 
        rol: data.usuario.id_rol   
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      window.dispatchEvent(new Event('storage'));
      
      // Redirigir según el rol
      if (data.usuario.id_rol === 1) {
        setLocation('/admin');
      } else {
        setLocation('/');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container"> 
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="Tu email"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Tu contraseña"
            />
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