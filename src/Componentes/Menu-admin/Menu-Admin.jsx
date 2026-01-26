
function MenuAdmin(){
return(
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
    );  
}  
    
