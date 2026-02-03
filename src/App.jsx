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
          <Switch>
            {/* Rutas de Admin  */}
            <Route path="/admin">
              <ProtectedRoute path="/admin">
                <div className="contenedor-admin">
                  <AdminPanel />
                  <ProductosAdmin />
                </div>
              </ProtectedRoute>
            </Route>
            
            <Route path="/admin/usuarios">
              <ProtectedRoute path="/admin/usuarios">
                <div className="contenedor-admin">
                  <AdminPanel />
                  <AdminUsuarios />
                </div>
              </ProtectedRoute>
            </Route>
            
            <Route path="/admin/compras">
              <ProtectedRoute path="/admin/compras">
                <div className="contenedor-admin">
                  <AdminPanel />
                  <ComprasAdmin />
                </div>
              </ProtectedRoute>
            </Route>
            
            <Route path="/admin/envios">
              <ProtectedRoute path="/admin/envios">
                <div className="contenedor-admin">
                  <AdminPanel />
                  <EnviosPendiente />
                </div>
              </ProtectedRoute>
            </Route>
            
            {/* todas las demás rutas con Header y Footer */}
            <Route>
              <HeaderMenu />
              
              <main className="main-content">
                <Switch>
                  <Route path="/" component={VistaProductos} />
                  <Route path="/soporte" component={Soporte} />
                  <Route path="/carrito" component={VistaCarrito} />
                  <Route path="/producto/:id" component={VistaProductoDetalle} />
                  <Route path="/iniciar-sesion" component={Login} />
                  <Route path="/registrarse" component={Registro} />
                  <Route path="/buscar" component={VistaProductos} />
                  
                  <ProtectedRoute path="/miperfil">
                    <MiPerfil />
                  </ProtectedRoute>
                </Switch>
              </main>
              
              <Footer />
            </Route>
          </Switch>
        </div>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;