import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';
import VistaProductoDetalle from './Componentes/Vista-Producto-Detalle/VistaProductoDetalle';
import MiPerfil from './Componentes/MiPerfil/Mi-Perfil';  
import Login from './Componentes/Login/login';
import Registro from './Componentes/Registro/registro';
import AdminPanel from './Componentes/Admin/AdminPanel';
import ComprasAdmin from './Componentes/Admin/Compras-Admin/ComprasAdmin'; 
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [seccionAdminActiva, setSeccionAdminActiva] = useState('productos'); // ← Cambiado a 'productos' por defecto

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

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  // Función para renderizar contenido del admin - SIN DASHBOARD
  const renderContenidoAdmin = () => {
    if (seccionAdminActiva === 'productos') {
      return <div>Contenido de productos...</div>;
    }
    if (seccionAdminActiva === 'usuarios') {
      return <div>Contenido de usuarios...</div>;
    }
    if (seccionAdminActiva === 'compras') {
      return <ComprasAdmin />;
    }
    if (seccionAdminActiva === 'envios') {
      return <div>Contenido de envíos...</div>;
    }
    return <div>Contenido de productos...</div>; // ← Por defecto productos
  };

  return (
    <div className="App">
      <Switch>
        <Route path="/">
          <VistaProductos 
            agregarAlCarrito={agregarAlCarrito} 
            totalItems={totalItems}
          />
        </Route>
        <Route path="/carrito">
          <VistaCarrito carrito={carrito} setCarrito={setCarrito} />
        </Route>
        <Route path="/producto/:id">
          <VistaProductoDetalle 
            agregarAlCarrito={agregarAlCarrito}
            totalItems={totalItems}
          />
        </Route>
        <Route path="/miperfil">
          <MiPerfil />
        </Route>
        <Route path="/iniciar-sesion">
          <Login />
        </Route>
        <Route path="/registrarse">
          <Registro />
        </Route>
        <Route path="/admin">
          <div className="contenedor-admin">
            <AdminPanel 
              seccionActiva={seccionAdminActiva} 
              setSeccionActiva={setSeccionAdminActiva} 
            />
            {renderContenidoAdmin()}
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;