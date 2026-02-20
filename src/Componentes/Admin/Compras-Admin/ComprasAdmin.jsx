import React, { useState } from 'react';
import { useComprasAdmin } from '../../../hooks/useCompras';
import TablaPagos from './TablaPagos';
import TablaVentas from './TablaVentas';
import ModalEstadoPago from './ModalEstadoPago';
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
  } 
  = useComprasAdmin();
  
  const [busqueda, setBusqueda] = useState("");
  const [mostrarTabla, setMostrarTabla] = useState('pagos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [filtroHoy, setFiltroHoy] = useState(false);
  
  // Funciones auxiliares
  const formatearMoneda = (monto) => monto ? `$${parseFloat(monto).toLocaleString('es-AR', {minimumFractionDigits: 2})}` : '$0.00';
  const formatearFecha = (fechaStr) => fechaStr || 'Sin fecha';
  
  // Abrir modal para editar estado
  const abrirModalEditar = (pago) => {
    setPagoEditando(pago);
    setNuevoEstado(pago.estado);
    setMostrarModal(true);
  };
  
  // Guardar nuevo estado
  const guardarEstado = () => {
    if (!pagoEditando) return;
    
    actualizarEstadoPago(pagoEditando.id_pago, nuevoEstado)
      .then(response => {
        alert(response.data?.venta_creada 
          ? 'Pago aprobado y venta creada exitosamente' 
          : 'Estado actualizado correctamente');
        setMostrarModal(false);
        setPagoEditando(null);
      })
      .catch(() => {
        alert('Error al actualizar el estado');
        setMostrarModal(false);
        setPagoEditando(null);
      });
  };
  
  // Componente de estadísticas
  const Estadisticas = () => (
    <div className="cuadricula-estadisticas">
      {[
        { titulo: 'Ventas Hoy', valor: ventasHoy, tipo: 'ventas', accion: () => { setFiltroHoy(true); setMostrarTabla('ventas'); setBusqueda(''); } },
        { titulo: 'Ventas Mes', valor: ventasMes, tipo: 'ventas', accion: () => { setFiltroHoy(false); setMostrarTabla('ventas'); setBusqueda(''); } },
        { titulo: 'Total Pagos', valor: totalPagos, tipo: 'pagos', accion: () => { setMostrarTabla('pagos'); setBusqueda(''); } }
      ].map((est, idx) => (
        <div key={idx} className="tarjeta-estadistica">
          <h3>{est.titulo}</h3>
          <div className="numero-estadistica">{est.valor}</div>
          <button className="enlace-estadistica" onClick={est.accion}>
            Ver {est.titulo}
          </button>
        </div>
      ))}
    </div>
  );
  
  // Componente de búsqueda
  const Busqueda = () => (
    <div className="acciones-superiores">
      <input
        type="text"
        placeholder={
          mostrarTabla === 'pagos' 
            ? "Buscar por ID, método, usuario, estado..." 
            : "Buscar por ID, producto, usuario..."
        }
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="input-busqueda"
      />
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
  
  return (
    <div className="contenido-admin">
      <div className="header-productos">
        <h1 className="titulo-principal">Compras Recientes</h1>
      </div>
      
      <Estadisticas />
      <Busqueda />
      
      {/* Mostrar tabla de pagos o ventas */}
      {mostrarTabla === 'pagos' ? (
        <TablaPagos
          pagos={pagos}
          busqueda={busqueda}
          formatearMoneda={formatearMoneda}
          formatearFecha={formatearFecha}
          abrirModalEditar={abrirModalEditar}
          eliminarPago={eliminarPago}
        />
      ) : (
        <TablaVentas
          ventas={ventas}
          busqueda={busqueda}
          filtroHoy={filtroHoy}
          formatearMoneda={formatearMoneda}
          formatearFecha={formatearFecha}
          eliminarVenta={eliminarVenta}
        />
      )}
      
      {/* Modal para cambiar estado */}
      {mostrarModal && pagoEditando && (
        <ModalEstadoPago
          pagoEditando={pagoEditando}
          nuevoEstado={nuevoEstado}
          setNuevoEstado={setNuevoEstado}
          guardarEstado={guardarEstado}
          cerrarModal={() => {
            setMostrarModal(false);
            setPagoEditando(null);
            setNuevoEstado('');
          }}
        />
      )}
    </div>
  );
}

export default ComprasAdmin;