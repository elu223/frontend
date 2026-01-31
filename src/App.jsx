import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './auth/AuthProvider';
import { CarritoProvider } from './CarritoContext';
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
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <div className="App">
          <Switch>
            <Route path="/">
              <VistaProductos />
            </Route>
            <Route path="/carrito">
              <VistaCarrito />
            </Route>
            <Route path="/producto/:id">
              <VistaProductoDetalle />
            </Route>
            <Route path="/iniciar-sesion">
              <Login />
            </Route>
            <Route path="/registrarse">
              <Registro />
            </Route>
            <ProtectedRoute path="/miperfil">
              <MiPerfil />
            </ProtectedRoute>
            <Route path="/buscar">
              <VistaProductos />
            </Route>

            <ProtectedRoute path="/admin" adminOnly={true}>
              <div className="contenedor-admin">
                <AdminPanel />
                <ProductosAdmin />
              </div>
            </ProtectedRoute>

            <ProtectedRoute path="/admin/usuarios" adminOnly={true}>
              <div className="contenedor-admin">
                <AdminPanel />
                <AdminUsuarios />
              </div>
            </ProtectedRoute>

            <ProtectedRoute path="/admin/compras" adminOnly={true}>
              <div className="contenedor-admin">
                <AdminPanel />
                <ComprasAdmin />
              </div>
            </ProtectedRoute>

            <ProtectedRoute path="/admin/envios" adminOnly={true}>
              <div className="contenedor-admin">
                <AdminPanel />
                <EnviosPendiente />
              </div>
            </ProtectedRoute>

            <Route path="/forbidden">
              <div>acceso no autorizado</div>
            </Route>
          </Switch>
        </div>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;