import React from 'react';
import { Link } from 'wouter';
import HeaderMenu from './Header-Menu.jsx'; // Asumiendo que Header-Menu es parte del Header general
import './Header.css'; // Crea un archivo CSS para el Header si no existe

function Header() {
  return (
    <header className="header-ecommerce">
      <div className="container">
        <div className="logo-container">
          <Link href="/" className="logo-link">
            <img src="/img/logo.png" alt="Logo TejidosMiki" className="logo-imagen" />
            <h1 className="logo-texto">TejidosMiki</h1>
          </Link>
        </div>
        <HeaderMenu /> {/* Si HeaderMenu es parte de tu header principal */}
      </div>
    </header>
  );
}

export default Header;