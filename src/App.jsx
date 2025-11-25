import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';
import VistaProductoDetalle from './Componentes/Vista-Producto-Detalle/VistaProductoDetalle';
import MiPerfil from './Componentes/MiPerfil/Mi-Perfil';  
import Login from './Componentes/Login/login';
import Registro from './Componentes/Registro/registro';
import AdminPanel from './Componentes/Admin/AdminPanel';
import ProductosAdmin from './Componentes/Admin/Productos-Admin/ProductosAdmin';
import AdminUsuarios from './Componentes/Admin/Admin-Usuarios/AdminUsuarios';
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [seccionAdminActiva, setSeccionAdminActiva] = useState('dashboard');

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

  // Función para renderizar contenido del admin
  const renderContenidoAdmin = () => {
    if (seccionAdminActiva === 'dashboard' || seccionAdminActiva === 'productos') {
      return <ProductosAdmin />;
    }
    if (seccionAdminActiva === 'usuarios') {
      return <div>Contenido de usuarios...</div>;
    }
    if (seccionAdminActiva === 'compras') {
      return <div>Contenido de compras...</div>;
    }
    if (seccionAdminActiva === 'envios') {
      return <div>Contenido de envíos...</div>;
    }
    return <ProductosAdmin />;
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
        <Route path="/admin/usuarios">
        <AdminUsuarios/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;