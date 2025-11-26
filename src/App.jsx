import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';
import VistaProductoDetalle from './Componentes/Vista-Producto-Detalle/VistaProductoDetalle';
import MiPerfil from './Componentes/MiPerfil/Mi-Perfil';  
import Login from './Componentes/Login/login';
import Registro from './Componentes/Registro/registro';
import AdminPanel from './Componentes/Admin/AdminPanel';
import ComprasAdmin from './Componentes/Admin/Compras-Admin/ComprasAdmin'; 
import ProductosAdmin from './Componentes/Admin/Productos-Admin/ProductosAdmin';
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [seccionAdminActiva, setSeccionAdminActiva] = useState('productos');
  
  // cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        localStorage.removeItem('carrito');
      }
    }
  }, []);

  // guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

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
    if (seccionAdminActiva === 'productos') {
      return <ProductosAdmin />;
    }
    if (seccionAdminActiva === 'usuarios') {
      return <AdminUsuarios/>;
    }
    if (seccionAdminActiva === 'compras') {
      return <ComprasAdmin />;
    }
    if (seccionAdminActiva === 'envios') {
      return <div>Contenido de envíos...</div>;
    }
    return <div>Contenido de productos...</div>;
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