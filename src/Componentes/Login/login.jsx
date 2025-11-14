import { useState } from 'react';
import { useLocation } from 'wouter';
import HeaderMenu from '../Header/Header-Menu';
import './Login.css'; 

function Login({ login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      name: email.split('@')[0],
      email: email
    };
    
    login(userData);
    setLocation('/');
  };

  return (
    <div className="login-container">
      <HeaderMenu user={null} logout={() => {}} />
      
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Nombre de usuario</label>
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

          <button type="submit" className="login-button">
            Aceptar
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