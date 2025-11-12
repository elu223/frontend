import React from 'react';
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
          <Route path="/">
            <VistaProductos />
          </Route>
          <Route path="/carrito">
            <VistaCarrito />
          </Route>
          <Route path="/producto/:id">
            <VistaProductoDetalle />
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