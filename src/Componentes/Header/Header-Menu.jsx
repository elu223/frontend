import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import './Header-Menu.css';
import { useAuth } from '../../auth/AuthProvider';
import { useCarrito } from '../../CarritoContext';

function HeaderMenu() {
  const [terminoLocal, setTerminoLocal] = useState('');
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { calcularTotalItems } = useCarrito();

  // Leer parámetro de búsqueda de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setTerminoLocal(searchParam);
    }
  }, [window.location.search]);

  const esAdmin = () => user && user.id_rol === 1;

  const enviarBusqueda = () => {
    if (terminoLocal.trim()) {
      setLocation(`/buscar?search=${terminoLocal}`);
    } else {
      setLocation('/');
    }
  };

  const manejarTecla = (e) => {
    if (e.key === 'Enter') enviarBusqueda();
  };

  const cerrarSesion = () => {
    const confirmar = window.confirm("¿estás seguro que deseas cerrar sesión?");
    if (confirmar) {
      logout();
      setLocation('/');
    }
  };

  const totalItems = calcularTotalItems();

  return (
    <header className="header-ecommerce">
      <div className="container">
        <div className="logo-container">
          <Link href="/" className="logo-link">
            <img src="/img/logo.png" alt="Logo TejidosMiki" className="logo-imagen" />
            <h1 className="logo-texto">TejidosMiki</h1>
          </Link>
        </div>
        <div className="buscador-container">
          <input
            type="text"
            placeholder="buscar productos..."
            value={terminoLocal}
            onChange={(e) => setTerminoLocal(e.target.value)}
            onKeyDown={manejarTecla}
            className="buscador-input"
          />
          <button className="buscador-btn" onClick={enviarBusqueda}>🔍</button>
        </div>
        <nav className="menu-opciones">
          {user ? (
            <>
              <Link href="/miperfil" className="menu-opcion">
                <span className="menu-texto">Mi perfil</span>
              </Link>
              {esAdmin() && (
                <Link href="/admin" className="menu-opcion">
                  <span className="menu-texto">Panel admin</span>
                </Link>
              )}
              <button onClick={cerrarSesion} className="menu-opcion btn-logout">
                <span className="menu-texto">Cerrar sesión</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/registrarse" className="menu-opcion">
                <span className="menu-texto">Crea tu cuenta</span>
              </Link>
              <Link href="/iniciar-sesion" className="menu-opcion">
                <span className="menu-texto">Ingresar</span>
              </Link>
            </>
          )}
          <Link href="/carrito" className="menu-opcion carrito-opcion">
            <img src="/img/carrito.png" alt="carrito de compras" className="carrito-icono" />
            <span className="carrito-contador">{totalItems}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default HeaderMenu;