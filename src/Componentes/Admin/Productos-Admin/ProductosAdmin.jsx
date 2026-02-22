import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useProductos, getAuthConfig } from '../../../hooks/useProductos';
import './ProductosAdmin.css';

axios.defaults.baseURL = 'http://localhost:5000';

function ProductosAdmin() {
  const { productos, loading, error, cargarProductos } = useProductos();
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', precio: '', stock: 0 });
  const [imagen, setImagen] = useState(null);

  // Filtrar productos
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para determinar si un producto está activo (stock > 0)
  const esProductoActivo = (stock) => Number(stock) > 0;

  const abrirModal = (producto = null) => {
    setProductoEditando(producto);
    setFormData(producto ? {
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    } : { nombre: '', descripcion: '', precio: '', stock: 0 });
    setImagen(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    
    const datos = new FormData();
    datos.append('nombre', formData.nombre);
    datos.append('descripcion', formData.descripcion);
    datos.append('precio', formData.precio);
    datos.append('stock', formData.stock);
    
    if (imagen) datos.append('imagen', imagen);

    const url = productoEditando 
      ? `/api/productos/${productoEditando.id_producto}`
      : '/api/productos';
    
    const metodo = productoEditando ? 'put' : 'post';
    
    if (!productoEditando && !imagen) {
      alert('Debe seleccionar una imagen para el producto');
      return;
    }

    axios[metodo](url, datos, getAuthConfig())
      .then(() => {
        alert(`Producto ${productoEditando ? 'actualizado' : 'agregado'} correctamente`);
        cerrarModal();
        cargarProductos();
      })
      .catch((error) => {
        alert(`Error al ${productoEditando ? 'actualizar' : 'agregar'} el producto`);
        console.error('Error:', error);
      });
  };

  const eliminarProducto = (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    axios.delete(`/api/productos/${id}`, getAuthConfig())
      .then(() => {
        cargarProductos();
        alert('Producto eliminado correctamente');
      })
      .catch((error) => {
        alert('Error al eliminar el producto');
        console.error('Error:', error);
      });
  };

  const formatearPrecio = (precio) => {
    const numeroEntero = Math.round(Number(precio));
    return `$${numeroEntero.toLocaleString('es-AR')}`;
  }

  if (loading) return (
    <div className="contenido-admin"><div className="cargando">Cargando productos...</div></div>
  );

  if (error) return (
    <div className="contenido-admin">
      <div className="error">{error}</div>
      <button onClick={cargarProductos} className="btn-reintentar">Reintentar</button>
    </div>
  );

  // Calcular resumen
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => esProductoActivo(p.stock)).length;
  const productosAgotados = productos.filter(p => Number(p.stock) === 0).length;
  const productosStockNegativo = productos.filter(p => Number(p.stock) < 0).length;

  return (
    <div className="contenido-admin">
      <div className="header-productos">
        <h1 className="titulo-principal">Productos</h1>
      </div>

      <div className="seccion-busqueda-resumen">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
          <button className="btn-agregar" onClick={() => abrirModal()}>+ Agregar Producto</button>
        </div>

        <div className="resumen-productos">
          <div className="resumen-item">
            <span className="resumen-numero">{totalProductos}</span>
            <span className="resumen-texto">Total</span>
          </div>
          <div className="resumen-item">
            <span className="resumen-numero">{productosActivos}</span>
            <span className="resumen-texto">Activos</span>
          </div>
          <div className="resumen-item">
            <span className="resumen-numero">{productosAgotados}</span>
            <span className="resumen-texto">Agotados</span>
          </div>
          {productosStockNegativo > 0 && (
            <div className="resumen-item resumen-negativo">
              <span className="resumen-numero">{productosStockNegativo}</span>
              <span className="resumen-texto">Stock Negativo</span>
            </div>
          )}
        </div>
      </div>

      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Imagen</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => {
              const stock = Number(producto.stock);
              const estaActivo = esProductoActivo(stock);
              const estaAgotado = stock === 0;
              const stockNegativo = stock < 0;
              
              return (
                <tr key={producto.id_producto} className={stockNegativo ? 'stock-negativo' : estaAgotado ? 'agotado' : ''}>
                  <td>{producto.id_producto}</td>
                  <td className="nombre-producto">{producto.nombre}</td>
                  <td className="imagen-producto">
                    {producto.imagen_url ? (
                      <img 
                        src={`http://localhost:5000${producto.imagen_url}`} 
                        alt={producto.nombre}
                        className="imagen-miniatura admin-imagen-miniatura"
                        onError={(e) => e.target.src = '/img/default.jpg'}
                      />
                    ) : <div className="sin-imagen">Sin imagen</div>}
                  </td>
                  <td className="precio">{formatearPrecio(producto.precio)}</td>
                  <td className={`cantidad ${stockNegativo ? 'stock-negativo' : estaAgotado ? 'stock-cero' : ''}`}>
                    {stock}
                  </td>
                  <td>
                    <span className={`estado ${stockNegativo ? 'error' : estaAgotado ? 'agotado' : 'activo'}`}>
                      {stockNegativo ? 'Stock Negativo' : estaAgotado ? 'Agotado' : 'Activo'}
                    </span>
                  </td>
                  <td className="acciones">
                    <button className="btn-editar" onClick={() => abrirModal(producto)}>
                      <img src='/img/lapiz.png' alt="Editar" />
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarProducto(producto.id_producto)}>
                      <img src='/img/basura.png' alt="Eliminar" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="overlay-formulario">
          <div className="modal-formulario">
            <h3>{productoEditando ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
            <form onSubmit={enviarFormulario}>
              <div className="input-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Descripción:</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="3" />
              </div>
              <div className="input-group">
                <label>Precio:</label>
                <input type="number" name="precio" value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} required min="0" step="1" />
              </div>
              <div className="input-group">
                <label>Stock:</label>
                <input type="number" name="stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required min="0" step="1" />
              </div>
              <div className="input-group">
                <label>Imagen:</label>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setImagen(e.target.files?.[0] || null)} required={!productoEditando} />
                <small>Solo imágenes JPG, JPEG, PNG</small>
              </div>
              <div className="botones-formulario">
                <button type="submit" className="btn-confirmar">{productoEditando ? 'Actualizar' : 'Agregar'}</button>
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosAdmin;