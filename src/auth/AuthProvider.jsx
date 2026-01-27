// AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch {
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    cargarUsuario();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return <div>cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, login: () => {}, logout: () => {} };
  }
  return context;
};