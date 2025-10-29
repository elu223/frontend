import React from 'react';
import { Route, Routes, Switch } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<VistaProductos />} />
        <Route path="/carrito" element={<VistaCarrito />} />
      </Routes>
  )
}
export default App;