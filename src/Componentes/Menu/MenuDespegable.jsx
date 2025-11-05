import { useState } from "react";
import { Link } from "wouter";
import './MenuDesplegable.css';

function MenuDesplegable() {
  const [isOpen, setIsOpen] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');

  const opciones = [
    { nombre: 'Casa', ruta: '/' },
    { nombre: 'Carrito', ruta: '/carrito' },
    { nombre: 'Mi Perfil', ruta: '/perfil' },
    { nombre: 'Mis Compras', ruta: '/compras' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOpcionClick = (opcion) => {
    setOpcionSeleccionada(opcion.nombre);
    setIsOpen(false);
  };

  return (
    <div className="menu-desplegable">
      <button 
        className="boton-menu"
        onClick={toggleMenu}
      >
        ☰ Menú
      </button>
      
      {isOpen && (
        <div className="menu-contenido">
          {opciones.map((opcion) => (
            <Link 
              key={opcion.nombre}
              href={opcion.ruta}
              className={`opcion-menu ${
                opcionSeleccionada === opcion.nombre ? 'seleccionada' : ''
              }`}
              onClick={() => handleOpcionClick(opcion)}
            >
              {opcion.nombre}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuDesplegable;