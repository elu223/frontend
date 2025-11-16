import { useLocation } from "wouter";
import './TarjetaProductos.css';

function TarjetaProducto({ id, nombre, precio, imagen, descripcion, agregarAlCarrito }) {
  const [location, setLocation] = useLocation();

  const producto = { 
    id, 
    nombre, 
    precio, 
    img: imagen,   // 👈 nombre correcto para VistaCarrito
    descripcion 
  };

  const irADetalle = () => setLocation(`/producto/${id}`);

  const handleAgregarYRedirigir = (e) => {
    e.stopPropagation();
    agregarAlCarrito(producto);
    setLocation("/carrito");
  };

  return (
    <div className="tarjeta-producto" key={id} onClick={irADetalle}>
      <div className="imagen-producto">
        <img src={imagen} alt={nombre} />
      </div>
      <div className="info-producto">
        <h3 className="nombre-producto">{nombre}</h3>
        <div className="precio-producto">${precio}</div>
        <div className="acciones-producto">
          <button className="btn-agregar-carrito" onClick={handleAgregarYRedirigir}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaProducto;
