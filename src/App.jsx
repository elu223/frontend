import React from 'react';
import { Route, Router, Routes } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={VistaProductos} />
          <Route path="/carrito" component={VistaCarrito} />
          {/* Agregar más rutas */}
          <Route>404 - Página no encontrada</Route>
        </Switch>
      </div>
    </Router>
    );
}

export default App;