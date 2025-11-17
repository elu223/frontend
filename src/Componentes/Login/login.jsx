import { useState } from 'react';
import { useLocation } from 'wouter';
import HeaderMenu from '../Header/Header-Menu';
import './Login.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar todos los datos del usuario en localStorage
        const userData = {
          token: data.token,
          name: data.nombre,
          apellido: data.apellido,
          email: email,
          rol: data.rol
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Disparar evento para que HeaderMenu detecte el cambio
        window.dispatchEvent(new Event('storage'));
        
        // Redirigir al home
        setLocation('/');
        
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <HeaderMenu />
      
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
    </div>
  );
}

export default Login;