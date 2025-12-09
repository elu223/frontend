import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import './Header-Menu.css';
import axios from 'axios';

function HeaderMenu({ onSearch, searchTerm = '', totalItems = 0 }) {
  const [terminoLocal, setTerminoLocal] = useState(searchTerm);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [user, setUser] = useState(null);
  const [productos, setProductos] = useState([]);
  const [, setLocation] = useLocation();

  // Cargar usuario desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Cargar productos desde API para la búsqueda
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    axios.get('http://localhost:5000/api/productos')
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar productos para búsqueda:', error);
      });
  };

  // Escuchar cambios en localStorage
  useEffect(() => {
    const verificarCambiosStorage = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', verificarCambiosStorage);
    return () => window.removeEventListener('storage', verificarCambiosStorage);
  }, []);

  // Verificar si es admin
  const esAdmin = () => {
    if (user && user.rol === 1) {
      return true;
    }
    return false;
  }

  // Actualizar término local cuando searchTerm cambie
  useEffect(() => {
    setTerminoLocal(searchTerm);
  }, [searchTerm]);

  // Manejar búsqueda
  const manejarBusqueda = (valor) => {
    setTerminoLocal(valor);
    
    if (valor.length > 0 && productos.length > 0) {
      const sugerenciasFiltradas = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 5);
      setSugerencias(sugerenciasFiltradas);
      setMostrarSugerencias(true);
    } else {
      setMostrarSugerencias(false);
    }
  };

  // Enviar búsqueda
  const enviarBusqueda = () => {
    if (terminoLocal.trim()) {
      if (sugerencias.length > 0) {
        seleccionarSugerencia(sugerencias[0]);
      } else {
        // Buscar en todos los productos si no hay sugerencias visibles
        const productoEncontrado = productos.find(producto =>
          producto.nombre.toLowerCase().includes(terminoLocal.toLowerCase())
        );
        
        if (productoEncontrado) {
          setLocation(`/producto/${productoEncontrado.id_producto}`);
        } else {
          // Si no encuentra nada, redirigir a página de búsqueda
          setLocation(`/buscar?search=${terminoLocal}`);
        }
      }
    }
    setMostrarSugerencias(false);
  };

  // Manejar teclas
  const manejarTecla = (e) => {
    if (e.key === 'Enter') {
      enviarBusqueda();
    } else if (e.key === 'Escape') {
      setMostrarSugerencias(false);
    }
  };

  // Seleccionar sugerencia
  const seleccionarSugerencia = (producto) => {
    setTerminoLocal(producto.nombre);
    setMostrarSugerencias(false);
    setLocation(`/producto/${producto.id_producto}`);
  };

  // Cerrar sugerencias
  const cerrarSugerencias = () => {
    setTimeout(() => setMostrarSugerencias(false), 200);
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    const confirmar = window.confirm("¿Estás seguro que deseas cerrar sesión?");
    if (confirmar) {
      localStorage.removeItem('user');
      setUser(null);
      setLocation('/');
    }
  }

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
            onFocus={() => {
              if (terminoLocal.length > 0 && productos.length > 0) {
                setMostrarSugerencias(true);
              }
            }}
            onBlur={cerrarSugerencias}
            className="buscador-input"
          />
          <button className="buscador-btn" onClick={enviarBusqueda}>🔍</button>
          
          {/* Lista de sugerencias */}
          {mostrarSugerencias && (
            <div className="sugerencias-lista">
              {sugerencias.length > 0 ? (
                sugerencias.map((producto) => (
                  <div 
                    key={producto.id_producto} 
                    className="sugerencia-item"
                    onClick={() => seleccionarSugerencia(producto)}
                  >
                    <div className="sugerencia-info">
                      <div className="sugerencia-nombre">{producto.nombre}</div>
                      {producto.precio && (
                        <div className="sugerencia-precio">${parseInt(producto.precio).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : terminoLocal.length > 0 ? (
                <div className="sin-resultados">
                  No encontramos productos para "{terminoLocal}"
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Menú de Navegación */}
        <nav className="menu-opciones">
          {user ? (
            // USUARIO LOGUEADO
            <>
              <Link href="/miperfil" className="menu-opcion">
                <span className="menu-texto">Mi perfil</span>
              </Link>
              
              {esAdmin() && (
                <Link href="/admin" className="menu-opcion">
                  <span className="menu-texto">Panel Admin</span>
                </Link>
              )}
              
              <button 
                onClick={cerrarSesion} 
                className="menu-opcion btn-logout"
              >
                <span className="menu-texto">Cerrar sesión</span>
              </button>
            </>
          ) : (
            // USUARIO NO LOGUEADO
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