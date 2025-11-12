import { useState } from "react";
import TarjetaProducto from './TarjetaProductos.jsx';
import HeaderMenu from "../Header/Header-Menu.jsx";
import './VistaProductos.css';
import { useCarrito } from "../CarritoContext/CarritoContext.jsx";

function VistaProductos() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const { agregarAlCarrito } = useCarrito();

  const productos = [
    { id: '1', nombre: 'Ajolote Amigurumi Amarillo', precio: 6500, imagen: '/img/ajolote amarillo.jpeg' },
    { id: '2', nombre: 'Tulipan Rojo Tejido', precio: 7500, imagen: 'img/tulipan rojo.jpeg' },
    { id: '3', nombre: 'Llavero Corazón', precio: 7800, imagen: 'img/llaveros en forma de corazon.jpeg' },
    { id: '4', nombre: 'Pelota Tejida', precio: 6500, imagen: '/img/pelota.jpeg' },
    { id: '5', nombre: 'Rosa Blanca Tejida', precio: 7500, imagen: 'img/rosa blanca.jpeg' },
    { id: '6', nombre: 'Rosa Roja Tejida', precio: 7500, imagen: 'img/rosa.png' },
    { id: '7', nombre: 'Crochet Domo Hat', precio: 10000, imagen: 'img/gorro domo.png' },
    { id: '8', nombre: 'Smart Watch', precio: 500000, imagen: 'https://via.placeholder.com/300x300/fd7e14/ffffff?text=Smart+Watch' },
    { id: '9', nombre: 'Smart Watch', precio: 500000, imagen: 'https://via.placeholder.com/300x300/fd7e14/ffffff?text=Smart+Watch' },
    { id: '10', nombre: 'Smart Watch', precio: 500000, imagen: 'https://via.placeholder.com/300x300/fd7e14/ffffff?text=Smart+Watch' },
  ];

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="vista-productos">
      <HeaderMenu onSearch={setTerminoBusqueda} searchTerm={terminoBusqueda} />

      <main className="main-content">
        <div className="container">
          {terminoBusqueda && (
            <div className="resultados-busqueda">
              <p>
                {productosFiltrados.length > 0
                  ? `Se encontraron ${productosFiltrados.length} productos para "${terminoBusqueda}"`
                  : `No se encontraron productos para "${terminoBusqueda}". Mostrando todos los productos.`
                }
              </p>
              {productosFiltrados.length === 0 && (
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
              {productosFiltrados.map((producto) => (
                <TarjetaProducto
                  key={producto.id}
                  id={producto.id}
                  nombre={producto.nombre}
                  precio={producto.precio}
                  imagen={producto.imagen}
                  descripcion={producto.descripcion}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 TejidosMiki. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default VistaProductos;