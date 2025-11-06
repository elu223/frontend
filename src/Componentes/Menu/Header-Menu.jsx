import { Link } from "wouter";
import './Header-Menu.css';

function HeaderMenu() {
  return (
    <nav className="header-menu-ml">
      <div className="menu-opciones">
        <Link href="/registrarse" className="menu-opcion">
          <span className="menu-texto">Crea tu cuenta</span>
        </Link>
        
        <Link href="/iniciar-sesion" className="menu-opcion">
          <span className="menu-texto">Ingresa</span>
        </Link>
        
        <Link href="/compras" className="menu-opcion">
          <span className="menu-texto">Mis compras</span>
        </Link>
        
        <Link href="/carrito" className="menu-opcion carrito-opcion">
          <span className="carrito-icono">🛒</span>
          <span className="carrito-contador">0</span>
        </Link>
      </div>
    </nav>
  );
}

export default HeaderMenu;