import { Link } from "wouter";
import { useState, useEffect } from "react";
import { productos } from '../../data/productos';
import './Header-Menu.css';

function HeaderMenu({ onSearch, searchTerm = '', totalItems = 0 }) {
  const [terminoLocal, setTerminoLocal] = useState(searchTerm);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Escuchar cambios en localStorage (para cuando se haga login en otra página)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actualizar término local cuando searchTerm cambie
  useEffect(() => {
    setTerminoLocal(searchTerm);
  }, [searchTerm]);

  const manejarBusqueda = (valor) => {
    setTerminoLocal(valor);
    
    if (valor.length > 0) {
      const sugerenciasFiltradas = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 5);
      setSugerencias(sugerenciasFiltradas);
      setMostrarSugerencias(true);
    } else {
      setMostrarSugerencias(false);
    }
  };

  const manejarEnvioBusqueda = () => {
    if (terminoLocal.trim()) {
      if (sugerencias.length > 0) {
        seleccionarSugerencia(sugerencias[0]);
      } else {
        window.location.href = '/';
      }
    }
    setMostrarSugerencias(false);
  };

  const manejarTecla = (e) => {
    if (e.key === 'Enter') {
      manejarEnvioBusqueda();
    } else if (e.key === 'Escape') {
      setMostrarSugerencias(false);
    }
  };

  const seleccionarSugerencia = (producto) => {
    setTerminoLocal(producto.nombre);
    setMostrarSugerencias(false);
    window.location.href = `/producto/${producto.id}`;
  };

  const cerrarSugerencias = () => {
    setTimeout(() => setMostrarSugerencias(false), 200);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="header-ecommerce">
      <div className="container">
        {/* Logo */}
        <div className="logo-container">
          <Link href="/" className="logo-link">
            <img src="/img/logo.png" alt="Logo TejidosMiki" className="logo-imagen" />
            <h1 className="logo-texto">TejidosMiki</h1>
          </Link>
        </div>

        {/* Buscador con sugerencias */}
        <div className="buscador-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={terminoLocal}
            onChange={(e) => manejarBusqueda(e.target.value)}
            onKeyDown={manejarTecla}
            onFocus={() => terminoLocal.length > 0 && setMostrarSugerencias(true)}
            onBlur={cerrarSugerencias}
            className="buscador-input"
          />
          <button className="buscador-btn" onClick={manejarEnvioBusqueda}>🔍</button>
          
          {/* Lista de sugerencias - CORREGIDO */}
          {mostrarSugerencias && (
            <div className="sugerencias-lista">
              {sugerencias.length > 0 ? (
                sugerencias.map((producto) => (
                  <div 
                    key={producto.id} 
                    className="sugerencia-item"
                    onClick={() => seleccionarSugerencia(producto)}
                  >
                    <div className="sugerencia-info">
                      <div className="sugerencia-nombre">{producto.nombre}</div>
                    </div>
                  </div>
                ))
              ) : (
                // CORRECCIÓN: Esto se muestra cuando hay término de búsqueda pero NO hay sugerencias
                <div className="sin-resultados">
                  No encontramos productos para "{terminoLocal}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menú de Navegación */}
        <nav className="menu-opciones">
          {user ? (
            // USUARIO LOGUEADO - muestra Mi Perfil y Cerrar Sesión
            <>
              <span className="menu-opcion usuario-bienvenida">
                ¡Hola, {user.name}!
              </span>
              <Link href="/compras" className="menu-opcion">
                <span className="menu-texto">Mis compras</span>
              </Link>
              <Link href="/miperfil" className="menu-opcion">
                <span className="menu-texto">Mi perfil</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="menu-opcion btn-logout"
              >
                <span className="menu-texto">Cerrar sesión</span>
              </button>
            </>
          ) : (
            // USUARIO NO LOGUEADO - muestra Crea cuenta e Ingresa
            <>
              <Link href="/registrarse" className="menu-opcion">
                <span className="menu-texto">Crea tu cuenta</span>
              </Link>
              
              <Link href="/iniciar-sesion" className="menu-opcion">
                <span className="menu-texto">Ingresa</span>
              </Link>
              
              <Link href="/compras" className="menu-opcion">
                <span className="menu-texto">Mis compras</span>
              </Link>
            </>
          )}
          
          <Link href="/carrito" className="menu-opcion carrito-opcion">
            <img src="/img/carrito.png" alt="Carrito de compras" className="carrito-icono" />
            <span className="carrito-contador">{totalItems}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default HeaderMenu;