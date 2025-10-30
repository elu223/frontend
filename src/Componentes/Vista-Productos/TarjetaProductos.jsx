<<<<<<< HEAD
import './VistaProductos.css';
function ProductCard({ nombre, precio, imagen }) {
    return (
        <div className="tarjeta-producto">
            <img src={imagen} alt={nombre} className="imagen-producto" />
            <h2 className="nombre-producto">{nombre}</h2>
            <p className="precio-producto">${precio.toFixed}</p>
        </div>
    );
=======
import { useState } from 'react';
import './TarjetaProductos.css';

function TarjetaProducto({ id, nombre, precio, imagen, descripcion }) {

  return (
    <div className="tarjeta-producto">
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
>>>>>>> origin/develop_orosco
}

export default TarjetaProducto;