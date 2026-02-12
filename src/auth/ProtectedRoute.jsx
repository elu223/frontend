import React from 'react';
import { Route, useLocation } from 'wouter';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ path, children, adminOnly = false }) => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <Route path={path}>
      {() => {
        // efecto para redirigir si no tiene acceso
        React.useEffect(() => {
          if (!user) {
            setLocation('/iniciar-sesion');
            return;
          }
          
          if (adminOnly && (!user || user.id_rol !== 1)) {
            setLocation('/');
            return;
          }
        }, [user, adminOnly, setLocation]);

        // verificar acceso
        if (!user) {
          return <div>redirigiendo...</div>;
        }
        
        if (adminOnly && user.id_rol !== 1) {
          return <div>redirigiendo...</div>;
        }

        return children;
      }}
    </Route>
  );
};

export default ProtectedRoute;