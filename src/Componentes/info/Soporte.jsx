import React from 'react';
import './soporte.css';

const Soporte = () => {
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjklgvaa";

    return (
        <div className="soporte-pagina">
            <div className="soporte-container">
                <h1 className="soporte-titulo">Soporte</h1>
                <p className="soporte-descripcion">
                    ¿Tenés alguna duda o problema? Contactanos y te ayudaremos lo antes posible.
                </p>
                
                <form action={FORMSPREE_ENDPOINT} method="POST" className="soporte-formulario">
                    <div className="form-box">
                        <div className="campo">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Tu correo electrónico" 
                                required 
                                className="input-email"
                            />
                        </div>
                        
                        <div className="campo">
                            <textarea 
                                name="mensaje" 
                                placeholder="Escribe tus dudas, consultas o problemas..." 
                                rows="6"
                                required 
                                className="textarea-mensaje"
                            ></textarea>
                        </div>
                        
                        <button type="submit" className="btn-enviar">
                            ENVIAR MENSAJE
                        </button>
                    </div>
                </form>
                
                <div className="soporte-info">
                    <h3>Otras formas de contacto:</h3>
                    <p><strong>Email:</strong> tejidosmiki@gmail.com</p>
                    <p><strong>WhatsApp:</strong> +54 2901 533-532</p>
                    <p><strong>Horario de atención:</strong> Lunes a Viernes 9:00 - 18:00 hs</p>
                </div>
            </div>
        </div>
    );
};

export default Soporte;