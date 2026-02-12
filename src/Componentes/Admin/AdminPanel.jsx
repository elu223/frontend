import { Link, useLocation } from 'wouter';
import './AdminPanel.css';
import { useAuth } from '../../auth/AuthProvider';
import { useEffect } from 'react';

function AdminPanel() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  // verificar si es admin al cargar
  useEffect(() => {
    if (!user) {
      setLocation('/iniciar-sesion');
      return;
    }
    
    if (user.id_rol !== 1) {
      alert('no tienes permisos de administrador');
      setLocation('/');
    }
  }, [user, setLocation]);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  // si no es admin, no renderizar nada (se redirige en el useEffect)
  if (!user || user.id_rol !== 1) {
    return null;
  }

  return (
    <div className="barra-lateral-admin">
      <Link href="/" className="logo-admin-link">
        <div className="logo-container-admin">
          <img className="logo-panel" src="img/logo.png" alt="TejidosMiki" />
        </div>
      </Link>
      <nav className="navegacion-panel">
        <Link href="/admin" className="item-navegacion">
          Productos
        </Link>
        <Link href="/admin/usuarios" className="item-navegacion">
          Usuarios
        </Link>
        <Link href="/admin/compras" className="item-navegacion">
          Compras recientes
        </Link>
        <Link href="/admin/envios" className="item-navegacion">
          Envíos pendientes
        </Link>
        
        <button onClick={handleLogout} className="item-navegacion logout-admin">
          Cerrar sesión
        </button>
      </nav>
    </div>
  );
}

export default AdminPanel;