import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { productos } from '../../data/productos';
import './Header-Menu.css';

function HeaderMenu({ onSearch, searchTerm = '' }) {
  const [terminoLocal, setTerminoLocal] = useState(searchTerm);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(-1);
  const sugerenciasRef = useRef([]);

  const manejarBusqueda = (e) => {
    const valor = e.target.value;
    setTerminoLocal(valor);
    
    // solo filtrar sugerencias en tiempo real, no ejecutar búsqueda
    if (valor.length > 0) {
      const sugerenciasFiltradas = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 5);
      setSugerencias(sugerenciasFiltradas);
      setMostrarSugerencias(true);
      setIndiceSeleccionado(-1);
    } else {
      setMostrarSugerencias(false);
    }
  };

  const manejarEnvioBusqueda = () => {
    if (terminoLocal.trim()) {
      // Si hay sugerencias, ir a la primera
      if (sugerencias.length > 0) {
        seleccionarSugerencia(sugerencias[0]);
      } else {
        // Si no hay sugerencias, redirigir a home
        window.location.href = '/';
      }
    }
    setMostrarSugerencias(false);
  };

  const manejarTecla = (e) => {
    if (!mostrarSugerencias || sugerencias.length === 0) {
      if (e.key === 'Enter') {
        manejarEnvioBusqueda();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIndiceSeleccionado(prev => 
          prev < sugerencias.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setIndiceSeleccionado(prev => 
          prev > 0 ? prev - 1 : sugerencias.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (indiceSeleccionado >= 0 && indiceSeleccionado < sugerencias.length) {
          seleccionarSugerencia(sugerencias[indiceSeleccionado]);
        } else {
          manejarEnvioBusqueda();
        }
        break;
      
      case 'Escape':
        setMostrarSugerencias(false);
        setIndiceSeleccionado(-1);
        break;
      
      default:
        break;
    }
  };

  const seleccionarSugerencia = (producto) => {
    setTerminoLocal(producto.nombre);
    setMostrarSugerencias(false);
    setIndiceSeleccionado(-1);
    // Redirigir a la página del producto
    window.location.href = `/producto/${producto.id}`;
  };

  const cerrarSugerencias = () => {
    setTimeout(() => {
      setMostrarSugerencias(false);
      setIndiceSeleccionado(-1);
    }, 200);
  };

  // Efecto para scroll a la sugerencia seleccionada
  useEffect(() => {
    if (indiceSeleccionado >= 0 && sugerenciasRef.current[indiceSeleccionado]) {
      sugerenciasRef.current[indiceSeleccionado].scrollIntoView({
        block: 'nearest'
      });
    }
  }, [indiceSeleccionado]);

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
            onChange={manejarBusqueda}
            onKeyDown={manejarTecla}
            onFocus={() => terminoLocal.length > 0 && setMostrarSugerencias(true)}
            onBlur={cerrarSugerencias}
            className="buscador-input"
          />
          <button className="buscador-btn" onClick={manejarEnvioBusqueda}>🔍</button>
          
          {/* Lista de sugerencias */}
          {mostrarSugerencias && (
            <div className="sugerencias-lista">
              {sugerencias.length > 0 ? (
                sugerencias.map((producto, index) => (
                  <div 
                    key={producto.id} 
                    ref={el => sugerenciasRef.current[index] = el}
                    className={`sugerencia-item ${index === indiceSeleccionado ? 'sugerencia-seleccionada' : ''}`}
                    onClick={() => seleccionarSugerencia(producto)}
                    onMouseEnter={() => setIndiceSeleccionado(index)}
                  >
                    <div className="sugerencia-info">
                      <div className="sugerencia-nombre">{producto.nombre}</div>
                    </div>
                  </div>
                ))
              ) : terminoLocal.length > 0 ? (
                <div className="sin-resultados">
                  <div className="mensaje-no-encontrado">
                    No encontramos productos para "{terminoLocal}"
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Menú de Navegación */}
        <nav className="menu-opciones">
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
            {/* Reemplazar emoji por imagen */}
           <span className="menu-texto">🛒</span>
            <span className="carrito-contador">0</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default HeaderMenu;