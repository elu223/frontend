import { useState } from 'react';
import { useLocation } from 'wouter';
import HeaderMenu from '../Header/Header-Menu';
import './registro.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [, setLocation] = useLocation();
A
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Guardar usuario en localStorage
    const userData = {
      name: nombre,
      email: email,
      fechaRegistro: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Forzar actualización del header
    window.dispatchEvent(new Event('storage'));
    
    setLocation('/');
  };

  return (
    <div className="registro-container">
      <HeaderMenu />
      
      <div className="registro-box">
        <h2 className="registro-title">Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit} className="registro-form">
          <div className="input-group">
            <label className="input-label">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="input-field"
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="tu@email.com"
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
              placeholder="Contraseña segura"
              minLength="6"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Repite tu contraseña"
            />
          </div>

          <button type="submit" className="registro-button">
            Crear Cuenta
          </button>
        </form>

        <div className="registro-links">
          <a href="/iniciar-sesion" className="link">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}

export default Registro;