import { useState, useEffect } from 'react';
import './ComprasAdmin.css';

function ComprasAdmin() {
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);
  const [pagosPendientes, setPagosPendientes] = useState(0);
  const [mensajesAbiertos, setMensajesAbiertos] = useState(0);
  const [cargando, setCargando] = useState(true);
  
  // Estado para controlar qué listado mostrar
  const [listadoActivo, setListadoActivo] = useState(null); // 'hoy', 'mes', 'pendientes', 'mensajes'
  const [ventasData, setVentasData] = useState([]);
  const [cargandoListado, setCargandoListado] = useState(false);

  // Cargar estadísticas cuando el componente se monta
  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = () => {
    setCargando(true);
    
    // Ventas de hoy
    fetch('http://localhost:5000/api/ventas/hoy')
      .then((response) => response.json())
      .then((data) => {
        setVentasHoy(data.total_ventas || 0);
        return fetch('http://localhost:5000/api/ventas/mes');
      })
      .then((response) => response.json())
      .then((data) => {
        setVentasMes(data.total_ventas || 0);
        return fetch('http://localhost:5000/api/ventas/pendientes');
      })
      .then((response) => response.json())
      .then((data) => {
        setPagosPendientes(data.total_pendientes || 0);
        setMensajesAbiertos(0);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error cargando estadísticas:', error);
        setCargando(false);
        // Valores por defecto
        setVentasHoy(2);
        setVentasMes(3);
        setPagosPendientes(1);
        setMensajesAbiertos(0);
      });
  };

  // Función para cargar el listado de ventas
  const cargarListadoVentas = (tipo) => {
    setListadoActivo(tipo);
    setCargandoListado(true);
    
    let url = '';
    let titulo = '';
    
    // Definir qué endpoint llamar según el tipo
    if (tipo === 'hoy') {
      url = 'http://localhost:5000/api/ventas/detalle-hoy';
      titulo = 'Ventas de Hoy';
    } else if (tipo === 'mes') {
      url = 'http://localhost:5000/api/ventas/detalle-mes';
      titulo = 'Ventas del Mes';
    } else if (tipo === 'pendientes') {
      url = 'http://localhost:5000/api/ventas/detalle-pendientes';
      titulo = 'Pagos Pendientes';
    } else {
      // Para mensajes (simulado)
      setVentasData([]);
      setCargandoListado(false);
      return;
    }
    
    // Llamar al backend
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setVentasData(data);
        setCargandoListado(false);
      })
      .catch((error) => {
        console.error('Error cargando listado:', error);
        // Datos de ejemplo si falla
        setVentasData([
          { id: 1, producto: 'Bufanda de lana', cliente: 'Juan Pérez', monto: 100, fecha: '2024-11-29' },
          { id: 2, producto: 'Gorro tejido', cliente: 'María García', monto: 80, fecha: '2024-11-29' }
        ]);
        setCargandoListado(false);
      });
  };

  // Función para cerrar el listado
  const cerrarListado = () => {
    setListadoActivo(null);
    setVentasData([]);
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  if (cargando) {
    return (
      <div className="contenido-admin">
        <h1 className="titulo-principal">Compras recientes</h1>
        <div className="marcador-position-listados">
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contenido-admin">
      <h1 className="titulo-principal">Compras recientes</h1>

      {/* Tarjetas de Estadísticas */}
      <div className="cuadricula-estadisticas">
        <div className="tarjeta-estadistica">
          <h3>Ventas Hoy</h3>
          <div className="numero-estadistica">{ventasHoy}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => cargarListadoVentas('hoy')}
          >
            = Ir al listado
          </button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Ventas Mes</h3>
          <div className="numero-estadistica">{ventasMes}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => cargarListadoVentas('mes')}
          >
            = Ir al listado
          </button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Pagos por Aprobar</h3>
          <div className="numero-estadistica">{pagosPendientes}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => cargarListadoVentas('pendientes')}
          >
            = Ir al listado
          </button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Mensajes Abiertos</h3>
          <div className="numero-estadistica">{mensajesAbiertos}</div>
          <button 
            className="enlace-estadistica" 
            onClick={() => cargarListadoVentas('mensajes')}
          >
            = Ir al listado
          </button>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="divisor"></div>

      {/* Sección de Listados*/}
      {listadoActivo && (
        <div className="seccion-listados-activa">
          <div className="cabecera-listado">
            <button onClick={cerrarListado} className="btn-cerrar-listado">
              ✕ Cerrar
            </button>
          </div>
          
          {cargandoListado ? (
            <div className="cargando-listado">
              <p>Cargando listado...</p>
            </div>
          ) : (
            <div className="contenido-listado">
              {ventasData.length > 0 ? (
                <table className="tabla-ventas">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Cliente</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasData.map((venta) => (
                      <tr key={venta.id}>
                        <td>{venta.id}</td>
                        <td>{venta.producto || 'Producto no disponible'}</td>
                        <td>{venta.cliente || 'Cliente no disponible'}</td>
                        <td>${venta.monto || 0}</td>
                        <td>{formatearFecha(venta.fecha)}</td>
                        <td>
                          <span className={`estado-venta ${venta.estado || 'pendiente'}`}>
                            {venta.estado || 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="sin-datos-listado">
                  <p>No hay datos disponibles para mostrar.</p>
                  <p>Intenta recargar o verifica la conexión con el servidor.</p>
                </div>
              )}
              
              <div className="resumen-listado">
                <p>
                  Total: <strong>{ventasData.length}</strong> registros encontrados
                </p>
                <button onClick={cerrarListado} className="enlace-estadistica">
                  Ocultar listado
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sección de Listados (solo se muestra si no hay listado activo) */}
      {!listadoActivo && (
        <div className="seccion-listados">
          <h2>Selecciona una opción</h2>
          <div className="marcador-position-listados">
            <p>Haz clic en "Ir al listado" de cualquiera de las tarjetas para ver los detalles.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComprasAdmin;