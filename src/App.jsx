import React from 'react';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VistaProductos />} />
        <Route path="/carrito" element={<VistaCarrito />} />
      </Routes>
    </Router>
  );
}

export default App;