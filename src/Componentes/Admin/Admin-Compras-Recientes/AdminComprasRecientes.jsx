import axios from "axios";
import { useEffect, useState } from "react";

function ComprasRecientes() {
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        const usuarioId = localStorage.getItem("usuario_id");

        axios.get(`http://localhost:3000/compras/recientes/${usuarioId}`)
            .then(res => setCompras(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h2>Compras recientes</h2>
            <ul>
                {compras.map((compra) => (
                    <li key={compra.id}>
                        {compra.producto} – {compra.cantidad} u. – ${compra.total}  
                        <br />
                        <small>{new Date(compra.fecha).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ComprasRecientes;
