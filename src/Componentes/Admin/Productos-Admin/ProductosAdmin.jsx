import './ProductosAdmin.css';

function ProductosAdmin() {
  return (
    <div className="contenido-admin">
      <h1 className="titulo-principal">Productos</h1>

      {/* Tarjetas de Estadísticas */}
      <div className="cuadricula-estadisticas">
        <div className="tarjeta-estadistica">
          <h3>Ventas Hoy</h3>
          <div className="numero-estadistica">2</div>
          <button className="enlace-estadistica">= Ir al listado</button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Ventas Mes</h3>
          <div className="numero-estadistica">3</div>
          <button className="enlace-estadistica">= Ir al listado</button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Pagos por Aprobar</h3>
          <div className="numero-estadistica">1</div>
          <button className="enlace-estadistica">= Ir al listado</button>
        </div>

        <div className="tarjeta-estadistica">
          <h3>Mensajes Abiertos</h3>
          <div className="numero-estadistica">0</div>
          <button className="enlace-estadistica">= Ir al listado</button>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="divisor"></div>

      {/* Sección de Listados */}
      <div className="seccion-listados">
        <h2>Acá van los listados</h2>
        <div className="marcador-position-listados">
          <p>Los listados de productos aparecerán aquí...</p>
        </div>
      </div>
    </div>
  );
}

export default ProductosAdmin;