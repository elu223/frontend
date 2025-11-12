import React, { useState } from 'react';
import { Route, Router, Switch } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';
import VistaProductoDetalle from './Componentes/Vista-Producto-Detalle/VistaProductoDetalle'
import MiPerfil from './Componentes/MiPerfil/Mi-Perfil';  
import './App.css';

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={VistaProductos} />
          <Route path="/carrito" component={VistaCarrito} />
          <Route path="/producto/:id" component={VistaProductoDetalle} />
          {/*más rutas */}
          <Route>404 - Página no encontrada</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;