import { useState, useEffect } from "react";
import TarjetaProducto from './TarjetaProductos.jsx';
import HeaderMenu from "../Header/Header-Menu.jsx";
import './VistaProductos.css';

function VistaProductos({ agregarAlCarrito, totalItems = 0 }) { 
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
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
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) || producto.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

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

