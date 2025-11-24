import { useState, useEffect } from "react";
import TarjetaProducto from './TarjetaProductos.jsx';
import HeaderMenu from "../Header/Header-Menu.jsx";
import  {productos}  from '../../data/productos.js';
import './VistaProductos.css';
import Footer from "../Footer/Footer.jsx";

function VistaProductos({ agregarAlCarrito, totalItems = 0 }) { 
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [productosMostrados, setProductosMostrados] = useState(productos);
  
  // Leer parámetro de búsqueda de la URL al cargar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setTerminoBusqueda(searchParam);
      // Filtrar productos basado en la búsqueda
      const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchParam.toLowerCase())
      );
      setProductosMostrados(productosFiltrados);
    }
  }, []);

  const ejecutarBusqueda = (termino) => {
    setTerminoBusqueda(termino);
    if (termino.trim() === '') {
      setProductosMostrados(productos);
    } else {
      const filtrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      setProductosMostrados(filtrados);
    }
  };

  return (
    <div className="vista-productos">
      {/* Pasar totalItems al HeaderMenu */}
      <HeaderMenu 
        onSearch={ejecutarBusqueda} 
        searchTerm={terminoBusqueda} 
        totalItems={totalItems} 
      />

      <main className="main-content">
        <div className="container">
          {terminoBusqueda && (
            <div className="resultados-busqueda">
              <p>
                {productosMostrados.length > 0
                  ? `Se encontraron ${productosMostrados.length} productos para "${terminoBusqueda}"`
                  : `No se encontraron productos para "${terminoBusqueda}". Mostrando todos los productos.`
                }
              </p>
              {productosMostrados.length === 0 && (
                <button 
                  className="btn-ver-todos"
                  onClick={() => {
                    setTerminoBusqueda('');
                    setProductosMostrados(productos);
                  }}
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          )}

          <div className="contenedor-productos">
            <div className="lista-productos-horizontal">
              {productosMostrados.map((producto) => (
                <TarjetaProducto
                  key={producto.id}
                  id={producto.id}
                  nombre={producto.nombre}
                  precio={producto.precio}
                  imagen={producto.imagen}
                  descripcion={producto.descripcion}
                  agregarAlCarrito={agregarAlCarrito}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* <footer className="footer">
        <div className="container">
          <p>&copy; 2025 TejidosMiki. Todos los derechos reservados.</p>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
}

export default VistaProductos;