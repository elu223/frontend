// src/CarritoContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';

const CarritoContext = createContext(null);

export const CarritoProvider = (props) => {
  const [carrito, setCarrito] = useState([]);
  const { user } = useAuth();

  // cargar carrito del localStorage cuando el usuario cambia
  useEffect(() => {
    if (user) {
      const carritoGuardado = localStorage.getItem(`carrito_${user.id_usuario}`);
      if (carritoGuardado) {
        try {
          setCarrito(JSON.parse(carritoGuardado));
        } catch {
          localStorage.removeItem(`carrito_${user.id_usuario}`);
          setCarrito([]);
        }
      } else {
        setCarrito([]);
      }
    } else {
      setCarrito([]);
    }
  }, [user]);

  // guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem(`carrito_${user.id_usuario}`, JSON.stringify(carrito));
    }
  }, [carrito, user]);

  // agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(item => item.id === producto.id);
      
      if (existe) {
        return prevCarrito.map(item =>
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + producto.cantidad }
            : item
        );
      } else {
        return [...prevCarrito, producto];
      }
    });
  };

  // eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.id !== id));
  };

  // actualizar cantidad de un producto
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito((prevCarrito) =>
      prevCarrito.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  // calcular total de items
  const calcularTotalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };
  //limpiar carrito despues de la compra
  const limpiarCarrito = () => {
    setCarrito([]);
  }
  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    calcularTotalItems,
    limpiarCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {props.children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    return {
      carrito: [],
      agregarAlCarrito: () => {},
      eliminarDelCarrito: () => {},
      actualizarCantidad: () => {},
      calcularTotalItems: () => 0,
      limpiarCarrito: () => {}
    };
  }
  return context;
};