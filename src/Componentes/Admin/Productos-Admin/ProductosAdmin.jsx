import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductosAdmin.css';

axios.defaults.baseURL = 'http://localhost:5000';

function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: 0
  });
  const [imagen, setImagen] = useState(null);
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setLoading(true);
    axios.get('/api/productos')
      .then((response) => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
        setError('Error al cargar los productos');
        setLoading(false);
      });
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalAgregar = () => {
    setProductoEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: 0
    });
    setImagen(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    });
    setImagen(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarArchivo = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    
    const datos = new FormData();
    datos.append('nombre', formData.nombre);
    datos.append('descripcion', formData.descripcion);
    datos.append('precio', formData.precio);
    datos.append('stock', formData.stock);
    
    if (imagen) {
      datos.append('imagen', imagen);
    }

    if (productoEditando) {
      axios.put(`/api/productos/${productoEditando.id_producto}`, datos)
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
      
      axios.post('/api/productos', datos)
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

  const eliminarProducto = (id) => {
    // solicita confirmación antes de eliminar
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    // Realizar solicitud DELETE al servidor con el ID del producto
    axios.delete(`/api/productos/${id}`)
      .then(() => {
        // Si la eliminación es exitosa, recargar la lista de productos
        cargarProductos();
        alert('Producto eliminado correctamente');
      })
      .catch((error) => {
        // Si hay error, mostrar en consola 
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      });
  };

  const formatearPrecio = (precio) => {
    return `$${parseInt(precio).toLocaleString('es-AR')}`;
  };

  if (loading) {
    return (
      <div className="contenido-admin">
        <div className="cargando">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contenido-admin">
        <div className="error">{error}</div>
        <button onClick={cargarProductos} className="btn-reintentar">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="contenido-admin">
      <div className="header-productos">
        <h1 className="titulo-principal">Productos</h1>
      </div>

      <div className="acciones-superiores">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />

        <button className="btn-agregar" onClick={abrirModalAgregar}>
          + Agregar Producto
        </button>
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
                      onError={(e) => {
                        e.target.src = '/img/default.jpg';
                      }}
                    />
                  ) : (
                    <div className="sin-imagen">Sin imagen</div>
                  )}
                </td>
                <td className="precio">{formatearPrecio(producto.precio)}</td>
                <td className={`cantidad ${Number(producto.stock) === 0 ? 'stock-cero' : ''}`}>
                  {Number(producto.stock) % 1 === 0 ? 
                    parseInt(producto.stock) : 
                    parseFloat(producto.stock)
                  }
                </td>
                <td>
                  <span className={`estado ${Number(producto.stock) === 0 ? 'agotado' : 'activo'}`}>
                    {Number(producto.stock) === 0 ? 'Agotado' : 'Activo'}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar" 
                    title="Editar producto" 
                    onClick={() => abrirModalEditar(producto)}
                  >
                    <img src='/img/lapiz.png' alt="Editar" />
                  </button>
                  <button 
                    className="btn-eliminar" 
                    title="Eliminar producto"
                    onClick={() => eliminarProducto(producto.id_producto)}
                  >
                    <img src='/img/basura.png' alt="Eliminar" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {/* modal agregar editar productos */}
      {mostrarModal && (
        <div className="overlay-formulario">
          <div className="modal-formulario">
            <h3>{productoEditando ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
            
            <form onSubmit={enviarFormulario}>
              <div className="input-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={manejarCambio}
                  rows="3"
                />
              </div>
              
              <div className="input-group">
                <label>Precio:</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={manejarCambio}
                  required
                  min="0"
                  step="1"
                />
              </div>
              
              <div className="input-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={manejarCambio}
                  required
                  min="0"
                  step="1"
                />
              </div>
              
              <div className="input-group">
                <label>Imagen del Producto:</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={manejarArchivo}
                  required={!productoEditando}
                />
                <small>Solo se permiten imágenes JPG, JPEG, PNG</small>
              </div>
              
              <div className="botones-formulario">
                <button type="submit" className="btn-confirmar">
                  {productoEditando ? 'Actualizar' : 'Agregar'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosAdmin;