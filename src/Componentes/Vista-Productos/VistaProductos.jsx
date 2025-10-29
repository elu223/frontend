
import ProductCard from './TarjetaProductos.jsx';
import './VistaProductos.css';

function VistaProductos() {
  const productos = [
    { id: 1, nombre: 'Producto 1', precio: 10.99, imagen: 'ruta/a/imagen1.jpg' },
    { id: 2, nombre: 'Producto 2', precio: 15.49, imagen: 'ruta/a/imagen2.jpg' },
    { id: 3, nombre: 'Producto 3', precio: 7.99, imagen: 'ruta/a/imagen3.jpg' },
    
  ];    
    return (
    <div className="vista-productos">
      <h1>Productos Disponibles</h1>
      <div className="lista-productos"> 
        {productos.map((producto) => (
          <ProductCard  
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
          />
        ))}
        </div> 
        <Link href="/carrito">
          <button className="btn-carrito">Mi Carrito</button>
        </Link>
    </div>
    );
}

export default VistaProductos;
