import { useLocation } from "wouter";
import './TarjetaProductos.css';

function TarjetaProducto({ id, nombre, precio, imagen, descripcion, agregarAlCarrito }) {
  const [, setLocation] = useLocation();

  const handleAgregarCarrito = (e) => {
    e.stopPropagation(); // evita que también active el clic en la tarjeta
    agregarAlCarrito(); // esta función ya tiene la verificación de autenticación y stock
  };

  return (
    <div className="tarjeta-producto" onClick={() => setLocation(`/producto/${id}`)}>
      <div className="imagen-producto">
        <img src={imagen} alt={nombre} />
      </div>
      <div className="info-producto">
        <h3 className="nombre-producto">{nombre}</h3>
        <div className="precio-producto">${precio}</div>
        <div className="acciones-producto">
          <button className="btn-agregar-carrito" onClick={handleAgregarCarrito}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaProducto;