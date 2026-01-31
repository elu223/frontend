import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './auth/AuthProvider';
import { CarritoProvider } from './CarritoContext';
import HeaderMenu from './Componentes/Header/Header-Menu';
import Footer from './Componentes/Footer/Footer';
import ProtectedRoute from './auth/ProtectedRoute';
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
import Soporte from './Componentes/info/Soporte';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <div className="App">
          {/* Header en todas las rutas excepto admin y auth */}
          <Switch>
            <Route path="/admin/:rest*">
              {/* No mostrar Header en admin */}
            </Route>
            <Route path="/iniciar-sesion">
              {/* No mostrar Header en login */}
            </Route>
            <Route path="/registrarse">
              {/* No mostrar Header en registro */}
            </Route>
            <Route>
              <HeaderMenu />
            </Route>
          </Switch>
          
          <main className="main-content">
            <Switch>
              <Route path="/" component={VistaProductos} />
              <Route path="/soporte" component={Soporte} />
              <Route path="/carrito" component={VistaCarrito} />
              <Route path="/producto/:id" component={VistaProductoDetalle} />
              <Route path="/iniciar-sesion" component={Login} />
              <Route path="/registrarse" component={Registro} />
              <Route path="/buscar" component={VistaProductos} />
              
              {/* Rutas protegidas */}
              <ProtectedRoute path="/miperfil" adminOnly={false}>
                <MiPerfil />
              </ProtectedRoute>
              
              {/* Rutas de admin */}
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
                <div className="error-container">
                  <h1>403 - Acceso no autorizado</h1>
                  <p>No tienes permiso para acceder a esta página.</p>
                </div>
              </Route>
              
              {/* 404 */}
              <Route>
                <div className="error-container">
                  <h1>404 - Página no encontrada</h1>
                  <p>La página que buscas no existe.</p>
                </div>
              </Route>
            </Switch>
          </main>
          
          {/* Footer en todas las rutas excepto admin y auth */}
          <Switch>
            <Route path="/admin/:rest*">
              {/* No mostrar Footer en admin */}
            </Route>
            <Route path="/iniciar-sesion">
              {/* No mostrar Footer en login */}
            </Route>
            <Route path="/registrarse">
              {/* No mostrar Footer en registro */}
            </Route>
            <Route>
              <Footer />
            </Route>
          </Switch>
        </div>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;