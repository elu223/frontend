import React, { useState } from 'react';
import { useComprasAdmin } from '../../../hooks/useCompras';
import './ComprasAdmin.css';

function ComprasAdmin() {
  const {
    pagos,
    ventas,
    loading,
    ventasHoy,
    ventasMes,
    totalPagos,
    eliminarPago,
    eliminarVenta,
    actualizarEstadoPago
  } = useComprasAdmin();
  
  const [busqueda, setBusqueda] = useState("");
  const [mostrarTabla, setMostrarTabla] = useState('pagos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [filtroHoy, setFiltroHoy] = useState(false);
  
  // Funciones auxiliares
  const formatearMoneda = (monto) => monto ? `$${parseFloat(monto).toLocaleString('es-AR', {minimumFractionDigits: 2})}` : '$0.00';
  const formatearFecha = (fechaStr) => fechaStr || 'Sin fecha';
  
  // Filtrar datos
  const pagosFiltrados = pagos.filter(p => 
    Object.values(p).some(val => 
      String(val || '').toLowerCase().includes(busqueda.toLowerCase())
    )
  );
  
  const ventasFiltradas = ventas.filter(v => {
    if (filtroHoy) {
      const hoy = new Date();
      const hoyFormato = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
      if (!v.fecha_venta?.includes(hoyFormato)) return false;
    }
    return Object.values(v).some(val => 
      String(val || '').toLowerCase().includes(busqueda.toLowerCase())
    );
  });
  
  // Manejar estados
  const abrirModalEditar = (pago) => {
    setPagoEditando(pago);
    setNuevoEstado(pago.estado);
    setMostrarModal(true);
  };
  
  const cerrarModal = () => {
    setMostrarModal(false);
    setPagoEditando(null);
    setNuevoEstado('');
  };
  
  const guardarEstado = () => {
    if (!pagoEditando) return;
    
    actualizarEstadoPago(pagoEditando.id_pago, nuevoEstado)
      .then(response => {
        alert(response.data?.venta_creada 
          ? 'Pago aprobado y venta creada exitosamente' 
          : 'Estado actualizado correctamente');
        cerrarModal();
      })
      .catch(() => {
        alert('Error al actualizar el estado');
        cerrarModal();
      });
  };
  
  // Componentes reutilizables
  const Estadisticas = () => (
    <div className="cuadricula-estadisticas">
      {[
        { titulo: 'Ventas Hoy', valor: ventasHoy, accion: () => { setFiltroHoy(true); setMostrarTabla('ventas'); setBusqueda(''); } },
        { titulo: 'Ventas Mes', valor: ventasMes, accion: () => { setFiltroHoy(false); setMostrarTabla('ventas'); setBusqueda(''); } },
        { titulo: 'Total Pagos', valor: totalPagos, accion: () => { setMostrarTabla('pagos'); setBusqueda(''); } },
        { titulo: 'Mensajes', valor: 0, accion: () => alert('Funcionalidad en desarrollo') }
      ].map((est, idx) => (
        <div key={idx} className="tarjeta-estadistica">
          <h3>{est.titulo}</h3>
          <div className="numero-estadistica">{est.valor}</div>
          <button className="enlace-estadistica" onClick={est.accion}>
            Ver {est.titulo.includes('Mensajes') ? 'Mensajes' : est.titulo.split(' ')[0]}
          </button>
        </div>
      ))}
    </div>
  );
  
  const Busqueda = ({ placeholder }) => (
    <div className="acciones-superiores">
      <input
        type="text"
        placeholder={placeholder}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="input-busqueda"
      />
    </div>
  );
  
  const Modal = () => mostrarModal && pagoEditando && (
    <div className="overlay-formulario">
      <div className="modal-formulario">
        <h3>Cambiar estado del pago #{pagoEditando.id_pago}</h3>
        <div className="input-group">
          <label>Nuevo Estado:</label>
          <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} className="select-estado">
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <div className="botones-formulario">
          <button className="btn-confirmar" onClick={guardarEstado}>Guardar</button>
          <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
        </div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="contenido-admin">
        <div className="header-productos">
          <h1 className="titulo-principal">Compras Recientes</h1>
        </div>
        <div className="cargando-listado">
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }
  
  const mostrarPagos = mostrarTabla === 'pagos';
  const mostrarVentas = mostrarTabla === 'ventas';
  
  return (
    <div className="contenido-admin">
      <div className="header-productos">
        <h1 className="titulo-principal">Compras Recientes</h1>
      </div>
      
      <Estadisticas />
      
      {mostrarPagos && (
        <>
          <Busqueda placeholder="Buscar por ID, método, usuario, estado..." />
          
          <div className="tabla-container compras">
            <table className="tabla-compras">
              <thead>
                <tr>
                  <th>ID Pago</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>ID Carrito</th>
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
                    <td><span className={`estado-pago ${pago.estado}`}>{pago.estado || 'pendiente'}</span></td>
                    <td>{pago.id_carrito}</td>
                    <td>{formatearFecha(pago.fecha)}</td>
                    <td className="acciones-td">
                      <button className="btn-editar" onClick={() => abrirModalEditar(pago)} title="Cambiar estado">
                        <img src="/img/lapiz.png" alt="Editar" />
                      </button>
                      <button className="btn-eliminar" onClick={() => eliminarPago(pago.id_pago)} title="Eliminar pago">
                        <img src="/img/basura.png" alt="Eliminar" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="sin-datos">No hay pagos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {pagosFiltrados.length > 0 && (
            <div className="resumen-ventas">
              <p>
                Total pagos: <strong>{pagosFiltrados.length}</strong>
                {' '}| Pendientes: <strong>{pagos.filter(p => p.estado === 'pendiente').length}</strong>
                {' '}| Aprobados: <strong>{pagos.filter(p => p.estado === 'aprobado').length}</strong>
              </p>
            </div>
          )}
        </>
      )}
      
      {mostrarVentas && (
        <>
          <Busqueda placeholder="Buscar por ID, producto, usuario..." />
          
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
                    <td>{venta.usuario_nombre ? `${venta.usuario_nombre} ${venta.usuario_apellido}` : 'Usuario no disponible'}</td>
                    <td>{venta.cantidad || 1}</td>
                    <td>{formatearMoneda(venta.precio_unitario)}</td>
                    <td>{formatearMoneda(venta.total)}</td>
                    <td>{formatearFecha(venta.fecha_venta)}</td>
                    <td><span className={`estado-pago ${venta.estado || 'completada'}`}>{venta.estado || 'completada'}</span></td>
                    <td className="acciones-td">
                      <button className="btn-eliminar" onClick={() => eliminarVenta(venta.id_venta)} title="Eliminar venta">
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
          
          {ventasFiltradas.length > 0 && (
            <div className="resumen-ventas">
              <p>
                {filtroHoy 
                  ? `Ventas de hoy: ${ventasFiltradas.length}`
                  : `Total ventas: ${ventasFiltradas.length} (Hoy: ${ventasHoy} | Mes: ${ventasMes})`
                }
              </p>
            </div>
          )}
        </>
      )}
      
      <Modal />
    </div>
  );
}

export default ComprasAdmin;