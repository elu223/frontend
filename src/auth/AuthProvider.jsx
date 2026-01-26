import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Normaliza la forma del usuario para que tenga siempre `roles` (array)
const normalizeUser = (raw) => {
  if (!raw) return null;
  // si ya tiene roles como array
  if (raw.roles && Array.isArray(raw.roles)) return raw;

  const u = { ...raw };

  // Asegurar que id_usuario está presente
  if (!u.id_usuario && u.id) {
    u.id_usuario = u.id;
  }

  // distintos lugares usan `id_rol` o `rol` o `role`
  const idRol = raw.id_rol ?? raw.rol ?? raw.role;
  if (idRol !== undefined) {
    // ejemplo simple: id_rol === 1 -> admin
    const roles = [];
    if (Number(idRol) === 1) roles.push('admin');
    else roles.push('user');
    u.roles = roles;
  }

  return u;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('http://localhost:5000/usuarios/me', {
          method: 'GET',
          credentials: 'include', // Enviar cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const normalizedUser = normalizeUser(data.usuario);
          setUser(normalizedUser);
          // También guardar token en localStorage como backup
          if (data.token) {
            localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
            localStorage.setItem('token', data.token);
          }
        } else {
          setUser(null);
          localStorage.removeItem('auth_user');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();

    const onStorage = (e) => {
      if (e.key === 'auth_user' || e.key === 'user' || e.key === 'token') {
        verifySession();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const loginWithToken = ({ token, user: userData }) => {
    console.log('loginWithToken ejecutado con:', { token: !!token, userData });
    const u = normalizeUser({ ...userData, token });
    console.log('Usuario normalizado:', u);
    setUser(u);
    // guardar en los dos formatos para compatibilidad
    try {
      localStorage.setItem('auth_user', JSON.stringify(u));
      localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem('token', token);
      console.log('Sesión guardada correctamente');
    } catch (e) {
      console.error('Error guardando sesión:', e);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/usuarios/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error en logout:', error);
    }
    
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
