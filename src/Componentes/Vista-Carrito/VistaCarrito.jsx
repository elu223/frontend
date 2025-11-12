import React, { useState } from 'react';
import { Link } from 'wouter';
import FormularioCompra from '../FormularioComprar/Formulario-Compra.jsx';
import Header from '../Header/Header.jsx'; // Importa el nuevo componente Header
import { useCarrito } from '../CarritoContext/CarritoContext.jsx';
import './VistaCarrito.css';

function VistaCarrito() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { carrito, setCarrito, eliminarItem, actualizarCantidad, incrementarCantidad, disminuirCantidad } = useCarrito();

  const eliminarItem = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad } : item
    ));
  };

  const incrementarCantidad = (id) => {
    setCarrito(carrito.map(item =>
      item.id === id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ));
  };

  const disminuirCantidad = (id) => {
    setCarrito(carrito.map(item =>
      item.id === id
        ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
        : item
    ));
  };

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  return (
    <div className="Carrito-container">
      <Header /> {/* Usa el componente Header reutilizable */}

      <h2 className="tituloCarrito">Carrito de Compras</h2>

      <div className="carrito">
        <div className="itemsLista">
          {carrito.length === 0 ? (
            <p className="carrito-vacio">Tu carrito está vacío 🛒</p>
          ) : (
            carrito.map(item => (
              <div key={item.id} className="Carrito-item">
                <h3>{item.nombre}</h3>

                <div className="Precio-producto">
                  <p>Precio</p>
                  <h3>${item.precio}</h3>
                </div>

                <div className="Cantidad-producto">
                  <p>Cantidad</p>
                  <button className="Aumentar-cantidad" onClick={() => incrementarCantidad(item.id)}>+</button>

                  <input
                    className="cantidad-input"
                    type="number"
                    value={item.cantidad}
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      actualizarCantidad(item.id, Math.max(1, value));
                    }}
                  />

                  <button className="Disminuir-cantidad" onClick={() => disminuirCantidad(item.id)}>-</button>
                </div>

                <button className="Boton-Eliminar Quitar" onClick={() => eliminarItem(item.id)}>Quitar</button>
              </div>
            ))
          )}
        </div>

        <div className="Carrito-total">
          <h3>Total de compra <p>${total}</p></h3>

          {carrito.length > 0 && (
            <button
              className="Boton-Comprar"
              onClick={() => setMostrarFormulario(true)}
            >
              Comprar
            </button>
          )}
        </div>

        {mostrarFormulario && (
          <FormularioCompra
            carrito={carrito}
            total={total}
            onClose={() => setMostrarFormulario(false)}
          />
        )}
      </div>
    </div>
  );
}

export default VistaCarrito;
  