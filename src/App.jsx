import React from 'react';
import { Route, Router, Routes, Switch } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';

function App() {
  return (
    <Router>
      <Switch>
        <div>
          <Routes>
            <Route path="/" element={<VistaProductos />} />
            <Route path="/carrito" element={<VistaCarrito />} />
          </Routes>
        </div>
      </Switch>
    </Router>
  )

}
export default App;