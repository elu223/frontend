import React, {useState}  from 'react';
import './VistaCarrito.css';

function VistaCarrito() {
    const [items, setItems] = useState([
        { id: 1, nombre: 'Producto 1', precio: 10.0, cantidad: 2 },
        { id: 2, nombre: 'Producto 2', precio: 15.0, cantidad: 1 },
    ]);

    const eliminarItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    }

    const actualizarCantidad = (id, cantidad) => {
        setItems(items.map(item => item.id === id ? { ...item, cantidad } : item));
    }

    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    return (
        <div className='Carrito-container'>
            <h2 className='tituloCarrito'>Carrito de compra</h2>

            <div className='itemsLista'>
                {items.map(item => (
                    <div key={item.id} className='Carrito-item'>
                        <h3>{item.nombre}</h3>
                        <h3>${item.precio}</h3>
                        <input 
                            type="number"   
                            value={item.cantidad}
                            min="1"
                            onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))}
                        />
                        <button className='Boton-Eliminar' onClick={() => eliminarItem(item.id)}>Eliminar</button>
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