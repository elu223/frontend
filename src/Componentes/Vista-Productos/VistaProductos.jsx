import { useState, useEffect } from "react";
import TarjetaProducto from './TarjetaProductos.jsx';
import HeaderMenu from "../Header/Header-Menu.jsx";
import './VistaProductos.css';
import Footer from "../Footer/Footer.jsx";
import axios from 'axios';

function VistaProductos({ agregarAlCarrito, totalItems = 0 }) { 
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [productosMostrados, setProductosMostrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Obtener productos desde la API
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setCargando(true);
    axios.get('http://localhost:5000/api/productos')
      .then((response) => {
        setProductosMostrados(response.data);
        setCargando(false);
        
        // Leer parámetro de búsqueda de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
          setTerminoBusqueda(searchParam);
          const productosFiltrados = response.data.filter(producto =>
            producto.nombre.toLowerCase().includes(searchParam.toLowerCase())
          );
          setProductosMostrados(productosFiltrados);
        }
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
        setCargando(false);
      });
  };

  const ejecutarBusqueda = (termino) => {
    setTerminoBusqueda(termino);
    if (termino.trim() === '') {
      // Recargar todos los productos
      cargarProductos();
    } else {
      // Filtrar productos
      const filtrados = productosMostrados.filter(producto =>
        producto.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      setProductosMostrados(filtrados);
    }
  };

  if (cargando) {
    return (
      <div className="vista-productos">
        <HeaderMenu 
          onSearch={ejecutarBusqueda} 
          searchTerm={terminoBusqueda} 
          totalItems={totalItems} 
        />
        <main className="main-content">
          <div className="container">
            <div className="cargando-productos">Cargando productos...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="vista-productos">
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
                  : `No se encontraron productos para "${terminoBusqueda}".`
                }
              </p>
              {productosMostrados.length === 0 && (
                <button 
                  className="btn-ver-todos"
                  onClick={() => {
                    setTerminoBusqueda('');
                    cargarProductos();
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
                  key={producto.id_producto}
                  id={producto.id_producto}
                  nombre={producto.nombre}
                  precio={producto.precio}
                  imagen={`http://localhost:5000${producto.imagen_url}`}
                  descripcion={producto.descripcion}
                  agregarAlCarrito={agregarAlCarrito}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default VistaProductos;

