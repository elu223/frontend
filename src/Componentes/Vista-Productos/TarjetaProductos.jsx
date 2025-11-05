import { useState } from 'react'; 
import './TarjetaProductos.css';

function TarjetaProducto({ id, nombre, precio, imagen, descripcion }) {

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