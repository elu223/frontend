import React, { useState } from 'react';
import { Route, Router, Switch } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';
import VistaProductoDetalle from './Componentes/Vista-Producto-Detalle/VistaProductoDetalle'
import MiPerfil from './Componentes/MiPerfil/Mi-Perfil';  
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => item.id === producto.id);
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/">
            <VistaProductos agregarAlCarrito={agregarAlCarrito} />
          </Route>
          <Route path="/carrito">
            <VistaCarrito carrito={carrito} setCarrito={setCarrito} />
          </Route>
          <Route path="/producto/:id">
            <VistaProductoDetalle agregarAlCarrito={agregarAlCarrito} />
          </Route>
          <Route path="/miperfil">
            <MiPerfil />
          </Route>
          
          <Route>404 - Página no encontrada</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;