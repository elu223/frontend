import React from 'react';
import { Route, useLocation } from 'wouter';
import { useAuth } from '../auth/AuthProvider';

const ProtectedContent = ({ children, allowedRoles }) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  if (!user) {
    // No autenticado -> ir a login
    setLocation('/iniciar-sesion');
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user.roles?.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      setLocation('/forbidden');
      return null;
    }
  }

  return children;
};

const ProtectedRoute = ({ path, children, allowedRoles = [] }) => {
  return (
    <Route path={path}>
      {() => <ProtectedContent allowedRoles={allowedRoles}>{children}</ProtectedContent>}
    </Route>
  );
};

export default ProtectedRoute;
