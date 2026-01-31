import React, { useState } from 'react';
import { Link } from 'wouter';
import FormularioCompra from '../FormularioComprar/Formulario-Compra.jsx';
import { useAuth } from '../../auth/AuthProvider';
import { useLocation } from 'wouter';
import './VistaCarrito.css';
import axios from 'axios';
import { useCarrito } from '../../CarritoContext';

function VistaCarrito() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { carrito, eliminarDelCarrito, actualizarCantidad } = useCarrito();

  // función para verificar stock disponible
  const verificarStockDisponible = (productoId, cantidadDeseada) => {
    return new Promise((resolve) => {
      axios.get(`http://localhost:5000/api/productos/${productoId}`)
        .then((response) => {
          const stockTotal = response.data.stock || 0;
          
          if (cantidadDeseada > stockTotal) {
            alert(`solo hay ${stockTotal} unidades disponibles`);
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch(() => {
          alert('error al verificar stock');
          resolve(false);
        });
    });
  };

  const handleActualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      nuevaCantidad = 1;
    }
    
    verificarStockDisponible(id, nuevaCantidad)
      .then((tieneStock) => {
        if (tieneStock) {
          actualizarCantidad(id, nuevaCantidad);
        }
      });
  };

  const incrementarCantidad = (id) => {
    const item = carrito.find(item => item.id === id);
    if (!item) return;
    
    const nuevaCantidad = item.cantidad + 1;
    handleActualizarCantidad(id, nuevaCantidad);
  };

  const disminuirCantidad = (id) => {
    const item = carrito.find(item => item.id === id);
    if (!item) return;
    
    const nuevaCantidad = Math.max(1, item.cantidad - 1);
    handleActualizarCantidad(id, nuevaCantidad);
  };

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  return (
    <div className="Carrito-container">
      {/* ELIMINADO: HeaderMenu */}
      
      <h2 className="tituloCarrito">carrito de compras</h2>

      <div className="carrito">
        <div className="itemsLista">
          {carrito.length === 0 ? (
            <p className="carrito-vacio">tu carrito está vacío 🛒</p>
          ) : (
            carrito.map(item => (
              <div key={item.id} className="Carrito-item">
                <img src={item.img} alt={item.nombre} className="carrito-img" />
                <h3>{item.nombre}</h3>
                <div className="Precio-producto">
                  <p>precio</p>
                  <h3>${item.precio}</h3>
                </div>

                <div className="Cantidad-producto">
                  <p>cantidad</p>
                  <button className="Aumentar-cantidad" onClick={() => incrementarCantidad(item.id)}>+</button>

                  <input
                    className="cantidad-input"
                    type="number"
                    value={item.cantidad}
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      handleActualizarCantidad(item.id, value);
                    }}
                  />

                  <button className="Disminuir-cantidad" onClick={() => disminuirCantidad(item.id)}>-</button>
                </div>

                <button className="Boton-Eliminar Quitar" onClick={() => eliminarDelCarrito(item.id)}>quitar</button>
              </div>
            ))
          )}
        </div>

        <div className="Carrito-total">
          <h3>total de compra <p>${total}</p></h3>

          {carrito.length > 0 && (
            <button
              className="Boton-Comprar"
              onClick={() => {
                if (!user) {
                  alert('debes iniciar sesión para comprar');
                  setLocation('/iniciar-sesion');
                  return;
                }
                setMostrarFormulario(true);
              }}
            >
              comprar
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