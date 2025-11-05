import React, {useState}  from 'react';

import './VistaCarrito.css';

function VistaCarrito() {
    const [items, setItems] = useState([
        { id: 1, nombre: 'Producto 1', precio: 10.0, cantidad: 2 },
        { id: 2, nombre: 'Producto 2', precio: 15.0, cantidad: 1 },
        { id: 3, nombre: 'Producto 3', precio: 15.0, cantidad: 1 },
        { id: 4, nombre: 'Producto 4', precio: 15.0, cantidad: 1 },
    
    ]);

    const eliminarItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    }

    const actualizarCantidad = (id, cantidad) => {
        setItems(items.map(item => item.id === id ? { ...item, cantidad } : item));
    }

    const incrementarCantidad = (id) => {
        setItems(items.map(item => 
            item.id === id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        ));
    };

    const disminuirCantidad = (id) => {
        setItems(items.map(item => 
            item.id === id 
            ? { ...item, cantidad: Math.max(1, item.cantidad - 1) } 
            : item
        ));
    };

    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    return (
        <div className='Carrito-container'>
            <h2 className='tituloCarrito'>
                {/* https://cdn-icons-png.flaticon.com/512/263/263142.png  imagen de carrito logo*/}
                <img src="./" alt="" />
                Carrito de compra</h2>

            <div className='itemsLista'>
                {items.map(item => (
                    <div key={item.id} className='Carrito-item'>
                        <h3>{item.nombre}</h3>
                        <div className='Precio-producto'>
                            <p>Precio</p>
                        <h3>${item.precio}</h3>
                        </div>
                        <div className='Cantidad-producto'>
                            <p>Cantidad</p>
                            <button className='Aumentar-cantidad' onClick={() => incrementarCantidad(item.id)}>+</button>
                         <input className='cantidad-input'
                            type="number"   
                            value={item.cantidad}
                            min="1"
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                actualizarCantidad(item.id, Math.max(1, value));
                            }}
                         />
                            <button className='Disminuir-cantidad' onClick={() => disminuirCantidad(item.id)}>-</button>
                        </div>
                        <button className='Boton-Eliminar Quitar' onClick={() => eliminarItem(item.id)}>Quitar</button>
                    </div>
                ))}
            </div>
            <div className='Carrito-total'>
                <h3>Total de compra 
                    <p>${total}</p>
                </h3>
                <button className='Boton-Comprar'>Comprar</button>
            </div>
        </div>
    );
}
export default VistaCarrito;
