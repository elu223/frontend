import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import './AdminPanel.css';

function AdminPanel({ seccionActiva, setSeccionActiva }) {
  const [, setLocation] = useLocation();

  // Verificar si es admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.rol !== 1) {
      setLocation('/');
    }
  }, [setLocation]);

  // Si no es admin, no muestra nada
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.rol !== 1) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        fontSize: '18px'
      }}>
        <h2>No tienes permisos para acceder a esta página</h2>
        <a href="/">Volver al inicio</a>
      </div>
    );
  }

  return (
    <div className="barra-lateral-admin">
      <Link href='/' className={"logo-link"}>
          <img className="logo-panel" src="img/logo.png" alt="Panel Admin" />
      </Link>
      <nav className="navegacion-panel">
        {/* ELIMINADO: Botón de Dashboard */}
        <button 
          className={`item-navegacion ${seccionActiva === 'productos' ? 'activo' : ''}`}
          onClick={() => setSeccionActiva('productos')}
        >
          Productos
        </button>
        <button 
          className={`item-navegacion ${seccionActiva === 'usuarios' ? 'activo' : ''}`}
          onClick={() => setSeccionActiva('usuarios')}
        >
          Usuarios
        </button>
        <button 
          className={`item-navegacion ${seccionActiva === 'compras' ? 'activo' : ''}`}
          onClick={() => setSeccionActiva('compras')}
        >
          Compras recientes
        </button>
        <button 
          className={`item-navegacion ${seccionActiva === 'envios' ? 'activo' : ''}`}
          onClick={() => setSeccionActiva('envios')}
        >
          Envíos pendientes
        </button>
      </nav>
    </div>
  );
}

export default AdminPanel;