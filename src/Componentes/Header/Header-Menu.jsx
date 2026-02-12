// HeaderMenu.jsx con autocomplete
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import './Header-Menu.css';
import { useAuth } from '../../auth/AuthProvider';
import { useCarrito } from '../../CarritoContext';
import axios from 'axios';

function HeaderMenu() {
  const [terminoLocal, setTerminoLocal] = useState('');
  const [location, navigate] = useLocation();
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const { user, logout } = useAuth();
  const { calcularTotalItems } = useCarrito();
  const buscadorRef = useRef(null);

  // Leer parámetro de búsqueda cuando cambia la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    setTerminoLocal(searchParam || '');
  }, [location]);

  // Obtener sugerencias cuando el usuario escribe
  useEffect(() => {
    if (terminoLocal.trim().length > 2) {
      axios.get(`http://localhost:5000/api/productos?buscar=${terminoLocal}`)
        .then(response => {
          const sugerenciasLimitadas = response.data.slice(0, 5);
          setSugerencias(sugerenciasLimitadas);
          setMostrarSugerencias(true);
        })
        .catch(() => {
          setSugerencias([]);
        });
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  }, [terminoLocal]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const esAdmin = () => user && user.id_rol === 1;

  const enviarBusqueda = () => {
    if (terminoLocal.trim()) {
      navigate(`/buscar?search=${terminoLocal.trim()}`);
      setMostrarSugerencias(false);
    } else {
      navigate('/');
    }
  };

  const seleccionarSugerencia = (producto) => {
    setTerminoLocal(producto.nombre);
    navigate(`/producto/${producto.id_producto}`);
    setMostrarSugerencias(false);
  };

  const manejarTecla = (e) => {
    if (e.key === 'Enter') enviarBusqueda();
  };

  const cerrarSesion = () => {
    const confirmar = window.confirm("¿estás seguro que deseas cerrar sesión?");
    if (confirmar) {
      logout();
      navigate('/');
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
        <div className="buscador-container" ref={buscadorRef}>
          <input
            type="text"
            placeholder="buscar productos..."
            value={terminoLocal}
            onChange={(e) => setTerminoLocal(e.target.value)}
            onKeyDown={manejarTecla}
            onFocus={() => terminoLocal.length > 2 && setMostrarSugerencias(true)}
            className="buscador-input"
          />
          <button className="buscador-btn" onClick={enviarBusqueda}>🔍</button>
          
          {/* Sugerencias */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className="sugerencias-lista">
              {sugerencias.map((producto) => (
                <div 
                  key={producto.id_producto}
                  className="sugerencia-item"
                  onClick={() => seleccionarSugerencia(producto)}
                >
                  <div className="sugerencia-info">
                    <div className="sugerencia-nombre">{producto.nombre}</div>
                    <div className="sugerencia-precio">${producto.precio}</div>
                  </div>
                </div>
              ))}
              <div className="sugerencia-ver-todos" onClick={enviarBusqueda}>
                Ver todos los resultados para "{terminoLocal}"
              </div>
            </div>
          )}
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