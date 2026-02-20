import React from 'react';

function TablaVentas({ 
  ventas, 
  busqueda, 
  filtroHoy, 
  formatearMoneda, 
  formatearFecha, 
  eliminarVenta 
}) {
  
  const ventasFiltradas = ventas.filter(venta => {
    if (filtroHoy) {
      const hoy = new Date();
      const hoyFormato = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
      if (!venta.fecha_venta?.includes(hoyFormato)) return false;
    }
    return Object.values(venta).some(val => 
      String(val || '').toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  return (
    <div className="tabla-container compras">
      <table className="tabla-compras">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Producto</th>
            <th>Usuario</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.length > 0 ? ventasFiltradas.map(venta => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{venta.producto_nombre || 'Producto no disponible'}</td>
              <td>
                {venta.usuario_nombre ? 
                  `${venta.usuario_nombre} ${venta.usuario_apellido}` : 
                  'Usuario no disponible'
                }
              </td>
              <td>{venta.cantidad || 1}</td>
              <td>{formatearMoneda(venta.precio_unitario)}</td>
              <td>{formatearMoneda(venta.total)}</td>
              <td>{formatearFecha(venta.fecha_venta)}</td>
              <td>
                <span className={`estado-pago ${venta.estado || 'completada'}`}>
                  {venta.estado || 'completada'}
                </span>
              </td>
              <td className="acciones-td">
                <button 
                  className="btn-eliminar" 
                  onClick={() => eliminarVenta(venta.id_venta)} 
                  title="Eliminar venta"
                >
                  <img src="/img/basura.png" alt="Eliminar" />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="9" className="sin-datos">
                {filtroHoy ? 'No hay ventas registradas hoy' : 'No hay ventas registradas'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaVentas;