import React from 'react';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';

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