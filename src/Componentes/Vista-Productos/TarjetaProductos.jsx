
import './TarjetaProductos.css';


function TarjetaProducto({ id, nombre, precio, imagen, descripcion }) {
  // const [cantidad, setCantidad] = useState(1);
  // const [nombre, setNombre] = useState('');
  // const [precio, setPrecio] = useState(0);


  return (
    <div className="tarjeta-producto" key ={id}>
      <div className="imagen-producto">
        <img src={imagen} alt={nombre} />
      </div>
      
      <div className="info-producto">
        <h3 className="nombre-producto">{nombre}</h3>
        <p className="descripcion-producto">{descripcion}</p>
        <div className="precio-producto">${precio}</div>
      </div>
    </div>
  );
}

export default TarjetaProducto;