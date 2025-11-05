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

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [voucher, setVoucher] = useState('');
    const [lugarEnvio, setLugarEnvio] = useState('');
    const [cardNombre, setCardNombre] = useState('');
    const [cardNumero, setCardNumero] = useState('');
    const [cardFecha, setCardFecha] = useState('');
    const [cardCVV, setCardCVV] = useState('');

    const aplicarVoucher = () => {
        console.log('Voucher aplicado:', voucher);
        // lógica para aplicar descuento...
    };

    const manejarPago = (e) => {
        e.preventDefault();
        const pago = {
            items,
            total,
            voucher,
            lugarEnvio,
            tarjeta: { cardNombre, cardNumero, cardFecha, cardCVV }
        };
        console.log('Procesar pago:', pago);
        // aquí enviar a backend o limpiar carrito
        setMostrarFormulario(false);
    };

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setDatosFormulario(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className='Carrito-container'>
            <h2 className='tituloCarrito'>
                {/* https://cdn-icons-png.flaticon.com/512/263/263142.png  imagen de carrito logo*/}
                <img src="./" alt="" />
                Carrito de Compras</h2>

            <div className='carrito'>

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
                <button className='Boton-Comprar' onClick={() => setMostrarFormulario(true)}>Comprar</button>
            </div>

            {mostrarFormulario && (
                <div className='formulario-overlay'>
                    <div className='formulario-container pago-form'>
                        <form onSubmit={manejarPago}>
                            <div className='fila-voucher'>
                                <input
                                    type="text"
                                    placeholder="Código del vale"
                                    value={voucher}
                                    onChange={(e) => setVoucher(e.target.value)}
                                />
                                <button type="button" className='btn-aplicar' onClick={aplicarVoucher}>Aplicar</button>
                            </div>

                            <div className='campo-envio'>
                                <input
                                    type="text"
                                    placeholder="Lugar del envio"
                                    value={lugarEnvio}
                                    onChange={(e) => setLugarEnvio(e.target.value)}
                                />
                            </div>

                            <div className='medios-pago'>
                                <div className='pago-icon'>VISA</div>
                                <div className='pago-icon'>MCD</div>
                                <div className='pago-icon'>BBVA</div>
                                <div className='pago-icon'>NX</div>
                            </div>

                            <label className='label'>Nombre de la tarjeta</label>
                            <input
                                type="text"
                                placeholder="Titular de la tarjeta"
                                value={cardNombre}
                                onChange={(e) => setCardNombre(e.target.value)}
                                required
                            />

                            <label className='label'>Numero de tarjeta</label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                value={cardNumero}
                                onChange={(e) => setCardNumero(e.target.value)}
                                required
                            />

                            <div className='fila-pequena'>
                                <div className='col-pequena'>
                                    <label className='label'>Fecha</label>
                                    <input
                                        type="text"
                                        placeholder="MM/AA"
                                        value={cardFecha}
                                        onChange={(e) => setCardFecha(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='col-pequena'>
                                    <label className='label'>CVV</label>
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        value={cardCVV}
                                        onChange={(e) => setCardCVV(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='resumen-pago'>
                                <div className='total-text'>${total.toLocaleString()}</div>
                                <button type="submit" className='btn-pagar'>Pagar</button>
                            </div>

                            <button type="button" className='btn-cancel' onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
            </div>
            
    );
}
export default VistaCarrito;
