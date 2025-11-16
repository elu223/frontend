import { useState } from 'react';
import './AdminPanel.css';

function AdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState('dashboard');

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <img className="logo-img" src="img/logo.png" alt="Panel Admin" />
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${seccionActiva === 'dashboard' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-item ${seccionActiva === 'usuarios' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('usuarios')}
          >
            Usuarios
          </button>
          <button 
            className={`nav-item ${seccionActiva === 'compras' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('compras')}
          >
            Compras recientes
          </button>
          <button 
            className={`nav-item ${seccionActiva === 'envios' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('envios')}
          >
            Envíos pendientes
          </button>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="admin-content">
        <h1 className="content-title">Productos</h1>

        {/* Cards de Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Ventas Hoy</h3>
            <div className="stat-number">2</div>
            <button className="stat-link">= Ir al listado</button>
          </div>

          <div className="stat-card">
            <h3>Ventas Mes</h3>
            <div className="stat-number">3</div>
            <button className="stat-link">= Ir al listado</button>
          </div>

          <div className="stat-card">
            <h3>Pagos por Aprobar</h3>
            <div className="stat-number">1</div>
            <button className="stat-link">= Ir al listado</button>
          </div>

          <div className="stat-card">
            <h3>Mensajes Abiertos</h3>
            <div className="stat-number">0</div>
            <button className="stat-link">= Ir al listado</button>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="divider"></div>

        {/* Sección de Listados */}
        <div className="listados-section">
          <h2>Acá van los listados</h2>
          <div className="listado-placeholder">
            <p>Los listados de productos aparecerán aquí...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;