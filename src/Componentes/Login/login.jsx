import { useState } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios'; // Importar axios
import './Login.css'; 
import Footer from '../Footer/Footer.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // USAR AXIOS - no fetch
      const response = await axios.post('/usuarios/login', {
        email: email, 
        password: password 
      });

      const data = response.data;
      
      console.log('Respuesta del login:', data); // Para debugging
      
      // Guardar todos los datos del usuario en localStorage
      const userData = {
        token: data.token,
        name: data.usuario.nombre,   
        apellido: data.usuario.apellido, 
        email: data.usuario.email, 
        rol: data.usuario.id_rol   
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Disparar evento para que HeaderMenu detecte el cambio
      window.dispatchEvent(new Event('storage'));
      
      // Redirigir al home
      setLocation('/');
      
    } catch (error) {
      console.error('Error en login:', error);
      console.log('Response data:', error.response?.data);
      console.log('Response status:', error.response?.status);
      
      if (error.response) {
        alert(`Error: ${error.response.data.error || error.response.data}`);
      } else if (error.request) {
        alert('Error de conexión. Verifica que el backend esté corriendo en puerto 5000.');
      } else {
        alert('Error inesperado: ' + error.message);
      }
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