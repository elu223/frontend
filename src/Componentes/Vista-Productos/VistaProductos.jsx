import { useState, useEffect } from "react";
import TarjetaProducto from './TarjetaProductos.jsx';
import HeaderMenu from "../Header/Header-Menu.jsx";
import './VistaProductos.css';
import Footer from "../Footer/Footer.jsx";
import axios from 'axios';
import { useLocation } from 'wouter';
import { useAuth } from '../../auth/AuthProvider';
import { useCarrito } from '../../CarritoContext';

function VistaProductos() { 
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [productosMostrados, setProductosMostrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { carrito, agregarAlCarrito, calcularTotalItems } = useCarrito();
  
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setCargando(true);
    axios.get('http://localhost:5000/api/productos')
      .then((response) => {
        setProductosMostrados(response.data);
        setCargando(false);
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
          setTerminoBusqueda(searchParam);
          const filtrados = response.data.filter(p =>
            p.nombre.toLowerCase().includes(searchParam.toLowerCase())
          );
          setProductosMostrados(filtrados);
        }
      })
      .catch(() => {
        setCargando(false);
      });
  };

  const cantidadEnCarrito = (productoId) => {
    const item = carrito.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
  };

  const verificarAutenticacion = () => {
    if (!user) {
      alert('debes iniciar sesión para agregar productos al carrito');
      setLocation('/iniciar-sesion');
      return false;
    }
    return true;
  };

  const handleAgregarAlCarrito = (producto) => {
    if (!verificarAutenticacion()) return;
    
    const yaEnCarrito = cantidadEnCarrito(producto.id_producto);
    const stockTotal = producto.stock || 0;
    
    if (stockTotal <= 0) {
      alert('no hay stock disponible');
      return;
    }
    
    const totalDespues = yaEnCarrito + 1;
    
    if (totalDespues > stockTotal) {
      const maxPermitido = stockTotal - yaEnCarrito;
      
      if (maxPermitido <= 0) {
        alert('ya no puedes agregar más de este producto. límite de stock alcanzado.');
      } else {
        alert(`solo puedes agregar ${maxPermitido} unidad(es) más. ya tienes ${yaEnCarrito} en el carrito.`);
      }
      return;
    }
    
    axios.get(`http://localhost:5000/api/productos/${producto.id_producto}`)
      .then((response) => {
        const stockVerificado = response.data.stock;
        
        if (totalDespues > stockVerificado) {
          const maxPermitido = stockVerificado - yaEnCarrito;
          
          if (maxPermitido <= 0) {
            alert('stock actualizado: ya no hay unidades disponibles');
          } else {
            alert(`stock actualizado: solo puedes agregar ${maxPermitido} unidad(es) más`);
          }
          return;
        }
        
        agregarAlCarrito({
          ...producto,
          id: producto.id_producto,
          cantidad: 1,
          img: `http://localhost:5000${producto.imagen_url}`
        });
        
        alert(`1 unidad de "${producto.nombre}" añadida al carrito`);
      })
      .catch(() => {
        alert('error al verificar stock disponible');
      });
  };

  const ejecutarBusqueda = (termino) => {
    setTerminoBusqueda(termino);
    if (termino.trim() === '') {
      cargarProductos();
    } else {
      const filtrados = productosMostrados.filter(p =>
        p.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      setProductosMostrados(filtrados);
    }
  };

  const totalItems = calcularTotalItems();

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
            <div className="cargando-productos">cargando productos...</div>
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
                  ? `se encontraron ${productosMostrados.length} productos para "${terminoBusqueda}"`
                  : `no se encontraron productos para "${terminoBusqueda}".`
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
                  ver todos los productos
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
                  agregarAlCarrito={() => handleAgregarAlCarrito(producto)}
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