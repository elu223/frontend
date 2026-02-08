import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useProductos, getAuthConfig } from '../../../hooks/useProductos';
import './ProductosAdmin.css';

axios.defaults.baseURL = 'http://localhost:5000';

function ProductosAdmin() {
  // Usar hook para productos
  const { productos, loading, error, cargarProductos } = useProductos();
  // Estados para búsqueda y modal
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: 0
  });
  const [imagen, setImagen] = useState(null);

  // Filtrar productos según búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función unificada para abrir modal
  const abrirModal = (producto = null) => {
    setProductoEditando(producto);
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        stock: producto.stock
      });
    } else {
      setFormData({ nombre: '', descripcion: '', precio: '', stock: 0 });
    }
    setImagen(null);
    setMostrarModal(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };

  // Función para manejar cambios en el formulario
  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para manejar la carga de imagen
  const manejarArchivo = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  // Función para enviar el formulario
  const enviarFormulario = (e) => {
    e.preventDefault();
    
    const datos = new FormData();
    datos.append('nombre', formData.nombre);
    datos.append('descripcion', formData.descripcion);
    datos.append('precio', formData.precio);
    datos.append('stock', formData.stock);
    
    if (imagen) datos.append('imagen', imagen);

    if (productoEditando) {
      axios.put(`/api/productos/${productoEditando.id_producto}`, datos, getAuthConfig())
        .then(() => {
          alert('Producto actualizado correctamente');
          cerrarModal();
          cargarProductos();
        })
        .catch((error) => {
          console.error('Error al actualizar producto:', error);
          alert('Error al actualizar el producto');
        });
    } else {
      if (!imagen) {
        alert('Debe seleccionar una imagen para el producto');
        return;
      }
      axios.post('/api/productos', datos, getAuthConfig())
        .then(() => {
          alert('Producto agregado correctamente');
          cerrarModal();
          cargarProductos();
        })
        .catch((error) => {
          console.error('Error al agregar producto:', error);
          alert('Error al agregar el producto');
        });
    }
  };

  // Función para eliminar producto
  const eliminarProducto = (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    axios.delete(`/api/productos/${id}`, getAuthConfig())
      .then(() => {
        cargarProductos();
        alert('Producto eliminado correctamente');
      })
      .catch((error) => {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      });
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => `$${parseInt(precio).toLocaleString('es-AR')}`;

  // Mostrar estado de carga
  if (loading) return (
    <div className="contenido-admin">
      <div className="cargando">Cargando productos...</div>
    </div>
  );

  // Mostrar error
  if (error) return (
    <div className="contenido-admin">
      <div className="error">{error}</div>
      <button onClick={cargarProductos} className="btn-reintentar">Reintentar</button>
    </div>
  );

  return (
    <div className="contenido-admin">
      <div className="header-productos">
        <h1 className="titulo-principal">Productos</h1>
      </div>

      {/* Sección de búsqueda y resumen juntos */}
      <div className="seccion-busqueda-resumen">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
          <button className="btn-agregar" onClick={() => abrirModal()}>
            + Agregar Producto
          </button>
        </div>

        {/* Resumen de productos - ahora debajo del buscador */}
        <div className="resumen-productos">
          <div className="resumen-item">
            <span className="resumen-numero">{productos.length}</span>
            <span className="resumen-texto">Total Productos</span>
          </div>
          <div className="resumen-item">
            <span className="resumen-numero">{productos.filter(p => Number(p.stock) > 0).length}</span>
            <span className="resumen-texto">Productos Activos</span>
          </div>
          <div className="resumen-item">
            <span className="resumen-numero">{productos.filter(p => Number(p.stock) === 0).length}</span>
            <span className="resumen-texto">Productos Agotados</span>
          </div>
        </div>
      </div>

      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id_producto} className={Number(producto.stock) === 0 ? 'agotado' : ''}>
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
                <td className={`cantidad ${Number(producto.stock) === 0 ? 'stock-cero' : ''}`}>
                  {Number(producto.stock) % 1 === 0 ? parseInt(producto.stock) : parseFloat(producto.stock)}
                </td>
                <td>
                  <span className={`estado ${Number(producto.stock) === 0 ? 'agotado' : 'activo'}`}>
                    {Number(producto.stock) === 0 ? 'Agotado' : 'Activo'}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar productos (integrado) */}
      {mostrarModal && (
        <div className="overlay-formulario">
          <div className="modal-formulario">
            <h3>{productoEditando ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
            <form onSubmit={enviarFormulario}>
              <div className="input-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={manejarCambio} required />
              </div>
              <div className="input-group">
                <label>Descripción:</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={manejarCambio} rows="3" />
              </div>
              <div className="input-group">
                <label>Precio:</label>
                <input type="number" name="precio" value={formData.precio} onChange={manejarCambio} required min="0" step="1" />
              </div>
              <div className="input-group">
                <label>Stock:</label>
                <input type="number" name="stock" value={formData.stock} onChange={manejarCambio} required min="0" step="1" />
              </div>
              <div className="input-group">
                <label>Imagen del Producto:</label>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={manejarArchivo} required={!productoEditando} />
                <small>Solo se permiten imágenes JPG, JPEG, PNG</small>
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