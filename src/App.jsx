import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import VistaProductos from './Componentes/Vista-Productos/VistaProductos';
import VistaCarrito from './Componentes/Vista-Carrito/VistaCarrito';
import VistaProductoDetalle from './Componentes/Vista-Producto-Detalle/VistaProductoDetalle';
import MiPerfil from './Componentes/MiPerfil/Mi-Perfil';  
import Login from './Componentes/Login/login';
import Registro from './Componentes/Registro/registro';
import AdminPanel from './Componentes/Admin/AdminPanel';
import AdminUsuarios from './Componentes/Admin/Admin-Usuarios/AdminUsuarios';
import ComprasAdmin from './Componentes/Admin/Compras-Admin/ComprasAdmin'; 
import ProductosAdmin from './Componentes/Admin/Productos-Admin/ProductosAdmin';
import EnviosPendiente from './Componentes/Admin/Admin-Envios-Pendientes/EnvioPendiente';
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
      return <AdminUsuarios/>
    }
    if (seccionAdminActiva === 'compras') {
      return <ComprasAdmin />;
    }
    if (seccionAdminActiva === 'envios') {
      return <EnviosPendiente />;
    }
    return <div>Contenido de productos...</div>;
  };

  return (
    <AuthProvider>
      <div className="App">
        <Switch>
          <Route path="/" component={VistaProductos} />
          <Route path="/carrito" component={VistaCarrito} />
          <Route path="/producto/:id" component={VistaProductoDetalle} />
          <Route>404 - Página no encontrada</Route>
        </Switch>
      </div>
    </AuthProvider>
  );
}

export default App;