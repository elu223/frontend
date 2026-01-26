import { useLocation } from "wouter";
import './TarjetaProductos.css';
import { useAuth } from '../../auth/AuthProvider';

function TarjetaProducto({ id, nombre, precio, imagen, descripcion, agregarAlCarrito }) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const producto = { 
    id, 
    nombre, 
    precio, 
    img: imagen,   
    descripcion 
  };

  const irADetalle = () => setLocation(`/producto/${id}`);

  const handleAgregarYRedirigir = (e) => {
    e.stopPropagation();
    // verificar autenticación
    if (!user) {
      setLocation('/iniciar-sesion');
      return;
    }

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
