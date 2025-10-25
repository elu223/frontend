import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VistaProductos from './pages/Vista-Productos/VistaProductos';
import VistaCarrito from './pages/Vista-Carrito/VistaCarrito';

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