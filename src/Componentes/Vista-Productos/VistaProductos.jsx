import React from 'react';
import ProductCard from './TarjetaProductos.jsx';
import './VistaProductos.css';

function VistaProductos() {
  const productos = [
    { 
      id: '1',  
      nombre: 'Smartphone Samsung', 
      precio: 30000, 
      imagen: 'https://via.placeholder.com/300x300/007bff/ffffff?text=Samsung',
      descripcion: 'Smartphone de última generación'
    },
    { 
      id: '2', 
      nombre: 'Laptop HP', 
      precio: 100000, 
      imagen: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Laptop+HP',
      descripcion: 'Laptop ideal para trabajo y estudio'
    },
    { 
      id: '3',  
      nombre: 'Audífonos Sony', 
      precio: 30000, 
      imagen: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Audífonos',
      descripcion: 'Audífonos con cancelación de ruido'
    },
    { 
      id: '4',  
      nombre: 'Tablet iPad', 
      precio: 30000, 
      imagen: 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=iPad',
      descripcion: 'Tablet perfecta para creativos'
    },
    { 
      id: '5', 
      nombre: 'Smart Watch', 
      precio: 500000, 
      imagen: 'https://via.placeholder.com/300x300/fd7e14/ffffff?text=Smart+Watch',
      descripcion: 'Reloj inteligente con monitor de salud'
    }
  ];    
    return (
    <div className="vista-productos">
      {/* Header */}
      <header className="header-ecommerce">
        <div className="container">
          <div className="logo-container">
            <Link href="/" className="logo-link">
              <img src="/img/logo.png" alt="Logo TejidosMiki" className="logo-imagen" />
              <h1 className="logo-texto">TejidosMiki</h1>
            </Link>
          </div>
          
          {/* Buscador */}
          <div className="buscador-container">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="buscador-input"
            />
            <button className="buscador-btn">🔍</button>
          </div>

          {/*
          <nav className="navegacion">
            <Link href="/registrarse" className="nav-link">Registrarse</Link>
            <Link href="/iniciar-sesion" className="nav-link">Iniciar sesión</Link>
            <Link href="/ver-compras" className="nav-link">Ver compras</Link>
          </nav>
          */}
        </div>
      </header>

      {/* Productos */}
      <main className="main-content">
        <div className="container">
          {terminoBusqueda && (
            <div className="resultados-busqueda">
              <p>
                {productosFiltrados.length > 0 
                  ? `Se encontraron ${productosFiltrados.length} productos para "${terminoBusqueda}"`
                  : `No se encontraron productos para "${terminoBusqueda}"`
                }
              </p>
            </div>
          )}

          {/* contenedor con los productos */}
          <div className="contenedor-productos">
            <div className="lista-productos-horizontal"> 
              {(terminoBusqueda ? productosFiltrados : productos).map((producto) => (
                <Link key={producto.id} href={`/producto/${producto.id}`}>
                  <TarjetaProducto  
                    id={producto.id}
                    nombre={producto.nombre}
                    precio={producto.precio}
                    imagen={producto.imagen}
                    descripcion={producto.descripcion}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 TejidosMiki. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
    );
}

export default VistaProductos;
