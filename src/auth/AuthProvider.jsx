import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Normaliza la forma del usuario para que tenga siempre `roles` (array)
const normalizeUser = (raw) => {
  if (!raw) return null;
  // si ya tiene roles como array
  if (raw.roles && Array.isArray(raw.roles)) return raw;

  const u = { ...raw };

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

  useEffect(() => {
    const load = () => {
      const storedAuth = localStorage.getItem('auth_user');
      const storedUser = localStorage.getItem('user');
      const raw = storedAuth ?? storedUser ?? null;
      if (raw) {
        try {
          setUser(normalizeUser(JSON.parse(raw)));
        } catch {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    };

    load();

    const onStorage = (e) => {
      if (e.key === 'auth_user' || e.key === 'user' || e.key === 'token') {
        load();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const loginWithToken = ({ token, user: userData }) => {
    const u = normalizeUser({ ...userData, token });
    setUser(u);
    // guardar en los dos formatos para compatibilidad
    try {
      localStorage.setItem('auth_user', JSON.stringify(u));
      localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem('token', token);
    } catch {}
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
