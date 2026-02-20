import React from 'react';

function TablaPagos({ 
  pagos, 
  busqueda, 
  formatearMoneda, 
  formatearFecha, 
  abrirModalEditar, 
  eliminarPago 
}) {
  
  const pagosFiltrados = pagos.filter(pago => 
    Object.values(pago).some(val => 
      String(val || '').toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="tabla-container compras">
      <table className="tabla-compras">
        <thead>
          <tr>
            <th>ID Pago</th>
            <th>Monto</th>
            <th>Método</th>
            <th>Usuario</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagosFiltrados.length > 0 ? pagosFiltrados.map(pago => (
            <tr key={pago.id_pago}>
              <td>{pago.id_pago}</td>
              <td>{formatearMoneda(pago.monto)}</td>
              <td>{pago.metodo || 'No especificado'}</td>
              <td>{pago.usuario_nombre || 'Usuario'} {pago.usuario_apellido || ''}</td>
              <td>
                {pago.productos_nombres ? (
                  <div className="productos-lista">
                    {pago.cantidad_productos > 1 ? 
                      `${pago.cantidad_productos} productos` : 
                      pago.productos_nombres
                    }
                  </div>
                ) : 'Sin productos'}
              </td>
              <td>
                <span className={`estado-pago ${pago.estado}`}>
                  {pago.estado || 'pendiente'}
                </span>
              </td>
              <td>{formatearFecha(pago.fecha)}</td>
              <td className="acciones-td">
                <button 
                  className="btn-editar" 
                  onClick={() => abrirModalEditar(pago)} 
                  title="Cambiar estado"
                >
                  <img src="/img/lapiz.png" alt="Editar" />
                </button>
                <button 
                  className="btn-eliminar" 
                  onClick={() => eliminarPago(pago.id_pago)} 
                  title="Eliminar pago"
                >
                  <img src="/img/basura.png" alt="Eliminar" />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="sin-datos">
                No hay pagos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPagos;