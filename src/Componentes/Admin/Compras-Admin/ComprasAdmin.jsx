import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ComprasAdmin.css';

function ComprasAdmin() {
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);
  const [totalPagos, setTotalPagos] = useState(0); 
  const [mensajesAbiertos, setMensajesAbiertos] = useState(0);
  
  const [pagos, setPagos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [busquedaPagos, setBusquedaPagos] = useState("");
  const [busquedaVentas, setBusquedaVentas] = useState("");
  
  const [mostrarTabla, setMostrarTabla] = useState('pagos');
  const [cargando, setCargando] = useState(true);
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');

  // Estado para controlar si mostrar solo ventas de hoy
  const [filtroHoy, setFiltroHoy] = useState(false);

  // Cargar todos los datos
  const cargarTodosLosDatos = () => {
    setCargando(true);
    
    // Cargar pagos
    axios.get("http://localhost:5000/api/pagos")
      .then((res) => {
        setPagos(res.data || []);
        setTotalPagos(res.data.length || 0);
      })
      .catch(() => {
        setPagos([]);
        setTotalPagos(0);
      });
    
    // Cargar ventas
    axios.get("http://localhost:5000/api/ventas")
      .then((res) => {
        setVentas(res.data || []);
      })
      .catch(() => {
        setVentas([]);
      });
    
    // Cargar estadísticas
    cargarEstadisticas();
  };

  // Cargar estadísticas
  const cargarEstadisticas = () => {
    // Ventas de hoy
    axios.get("http://localhost:5000/api/ventas/hoy")
      .then((res) => {
        setVentasHoy(res.data.total_ventas || 0);
      })
      .catch(() => {
        setVentasHoy(0);
      });

    // Ventas del mes
    axios.get("http://localhost:5000/api/ventas/mes")
      .then((res) => {
        setVentasMes(res.data.total_ventas || 0);
      })
      .catch(() => {
        setVentasMes(0);
      });

    // Completar carga
    setMensajesAbiertos(0);
    setCargando(false);
  };

  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  // Filtrar pagos
  const pagosFiltrados = pagos.filter((pago) => {
    const busqueda = busquedaPagos.toLowerCase();
    return (
      pago.id_pago.toString().includes(busqueda) ||
      (pago.metodo && pago.metodo.toLowerCase().includes(busqueda)) ||
      (pago.estado && pago.estado.toLowerCase().includes(busqueda)) ||
      pago.id_carrito.toString().includes(busqueda) ||
      (pago.usuario_nombre && pago.usuario_nombre.toLowerCase().includes(busqueda)) ||
      (pago.usuario_apellido && pago.usuario_apellido.toLowerCase().includes(busqueda))
    );
  });

  // Filtrar ventas - CON FILTRO DE HOY
  const ventasFiltradas = ventas.filter((venta) => {
    // Primero aplicamos filtro de "hoy" si está activado
    if (filtroHoy) {
      const hoy = new Date();
      // Formato DD/MM/YYYY
      const diaHoy = hoy.getDate().toString().padStart(2, '0');
      const mesHoy = (hoy.getMonth() + 1).toString().padStart(2, '0');
      const añoHoy = hoy.getFullYear();
      const hoyFormato = `${diaHoy}/${mesHoy}/${añoHoy}`;
      
      // Verificar si la fecha de la venta contiene la fecha de hoy
      if (!venta.fecha_venta || !venta.fecha_venta.includes(hoyFormato)) {
        return false;
      }
    }
    
    // Luego aplicamos el filtro de búsqueda
    const busqueda = busquedaVentas.toLowerCase();
    return (
      venta.id_venta.toString().includes(busqueda) ||
      (venta.producto_nombre && venta.producto_nombre.toLowerCase().includes(busqueda)) ||
      (venta.usuario_nombre && venta.usuario_nombre.toLowerCase().includes(busqueda)) ||
      (venta.estado && venta.estado.toLowerCase().includes(busqueda))
    );
  });

  // Eliminar pago
  const eliminarPago = (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este pago?")) return;
    
    axios.delete(`http://localhost:5000/api/pagos/${id}`)
      .then(() => {
        const nuevosPagos = pagos.filter(pago => pago.id_pago !== id);
        setPagos(nuevosPagos);
        setTotalPagos(nuevosPagos.length);
        alert('Pago eliminado correctamente');
      })
      .catch((error) => {
        console.error("Error eliminando pago:", error);
        alert('Error al eliminar el pago');
      });
  };

  // Eliminar venta
  const eliminarVenta = (id) => {
    if (!window.confirm("¿Seguro quieres eliminar esta venta?")) return;
    
    axios.delete(`http://localhost:5000/api/ventas/${id}`)
      .then(() => {
        alert('Venta eliminada correctamente');
        cargarTodosLosDatos(); // Recargar todo
      })
      .catch((error) => {
        console.error("Error eliminando venta:", error);
        alert('Error al eliminar la venta');
      });
  };

  // Abrir modal editar
  const abrirModalEditar = (pago) => {
    setPagoEditando(pago);
    setNuevoEstado(pago.estado);
    setMostrarModal(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setPagoEditando(null);
    setNuevoEstado('');
  };

  // Guardar estado del pago
  const guardarEstado = () => {
    if (!pagoEditando) return;
    
    axios.put(`http://localhost:5000/api/pagos/${pagoEditando.id_pago}`, { 
      estado: nuevoEstado 
    })
      .then((response) => {
        if (response.data.venta_creada) {
          alert('Pago aprobado y venta creada exitosamente');
        } else {
          alert('Estado actualizado correctamente');
        }
        
        // Recargar datos para actualizar todo
        cargarTodosLosDatos();
        cerrarModal();
      })
      .catch((error) => {
        console.error("Error actualizando estado:", error);
        alert('Error al actualizar el estado');
        cerrarModal();
      });
  };

  // Formatear moneda
  const formatearMoneda = (monto) => {
    if (!monto) return '$0.00';
    const numero = parseFloat(monto);
    return `$${numero.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin fecha';
    return fechaStr;
  };

  if (cargando) {
    return (
      <div className="admin-usuarios-container">
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
    <div className="admin-usuarios-container">
      <div className="header-productos">
        <h1 className="titulo-principal">Compras Recientes</h1>
      </div>

      <div className="cuadricula-estadisticas">
        <div className="tarjeta-estadistica">
          <h3>Ventas Hoy</h3>
          <div className="numero-estadistica">{ventasHoy}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => {
              setFiltroHoy(true);  // Activar filtro de hoy
              setMostrarTabla('ventas');
              setBusquedaVentas(""); // Limpiar búsqueda
            }}
          >
            Ver Ventas
          </button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Ventas Mes</h3>
          <div className="numero-estadistica">{ventasMes}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => {
              setFiltroHoy(false); // Desactivar filtro de hoy
              setMostrarTabla('ventas');
              setBusquedaVentas(""); // Limpiar búsqueda
            }}
          >
            Ver Ventas
          </button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Total Pagos</h3>
          <div className="numero-estadistica">{totalPagos}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => {
              setMostrarTabla('pagos');
              setBusquedaPagos("");
            }}
          >
            Ver Pagos
          </button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Mensajes</h3>
          <div className="numero-estadistica">{mensajesAbiertos}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => alert('Funcionalidad de mensajes en desarrollo')}
          >
            Ver Mensajes
          </button>
        </div>
      </div>

      {mostrarTabla === 'pagos' && (
        <>
          <div className="acciones-superiores">
            <input
              type="text"
              placeholder="Buscar por ID, método, usuario, estado..."
              value={busquedaPagos}
              onChange={(e) => setBusquedaPagos(e.target.value)}
              className="input-busqueda"
            />
          </div>

          <table className="tabla-usuarios">
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
              {pagosFiltrados.length > 0 ? (
                pagosFiltrados.map((pago) => (
                  <tr key={pago.id_pago}>
                    <td>{pago.id_pago}</td>
                    <td>{formatearMoneda(pago.monto)}</td>
                    <td>{pago.metodo || 'No especificado'}</td>
                    <td>{pago.usuario_nombre || 'Usuario'} {pago.usuario_apellido || ''}</td>
                    <td>
                      <span className={`estado-pago ${pago.estado}`}>
                        {pago.estado || 'pendiente'}
                      </span>
                    </td>
                    <td>{pago.id_carrito}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                    No hay pagos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
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

      {mostrarTabla === 'ventas' && (
        <>
          <div className="acciones-superiores">
            <input
              type="text"
              placeholder="Buscar por ID, producto, usuario..."
              value={busquedaVentas}
              onChange={(e) => setBusquedaVentas(e.target.value)}
              className="input-busqueda"
            />
          </div>

          <table className="tabla-usuarios">
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
              {ventasFiltradas.length > 0 ? (
                ventasFiltradas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td>{venta.id_venta}</td>
                    <td>{venta.producto_nombre || 'Producto no disponible'}</td>
                    <td>{venta.usuario_nombre ? `${venta.usuario_nombre} ${venta.usuario_apellido}` : 'Usuario no disponible'}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>
                    {filtroHoy 
                      ? 'No hay ventas registradas hoy' 
                      : 'No hay ventas registradas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
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

      {mostrarModal && pagoEditando && (
        <div className="overlay-formulario">
          <div className="modal-formulario">
            <h3>Cambiar estado del pago #{pagoEditando.id_pago}</h3>
            
            <div className="input-group">
              <label>Nuevo Estado:</label>
              <select 
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="select-estado"
              >
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
            
            <div className="botones-formulario">
              <button 
                className="btn-confirmar"
                onClick={guardarEstado}
              >
                Guardar
              </button>
              <button 
                className="btn-cancelar"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComprasAdmin;