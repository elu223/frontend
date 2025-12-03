import { Link } from 'wouter';
import './AdminPanel.css';

function AdminPanel() {
  return (
    <div className="barra-lateral-admin">
      {/* Logo que lleva a la vista principal (/) */}
      <Link href="/" className="logo-admin-link">
        <div className="logo-container-admin">
          <img className="logo-panel" src="img/logo.png" alt="TejidosMiki" />
        </div>
      </Link>
      <nav className="navegacion-panel">
        {/* Enlaces de navegación del panel de administración */}
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
      </nav>
    </div>
  );
}

export default AdminPanel;