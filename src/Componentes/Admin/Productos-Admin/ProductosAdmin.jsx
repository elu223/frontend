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
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: ''
  });

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

  const abrirModalAgregar = () => {
    setProductoEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen_url: ''
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      imagen_url: producto.imagen_url || ''
    });
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

  const enviarFormulario = (e) => {
    e.preventDefault();
    
    const datos = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseInt(formData.precio), // parseInt para quitar decimales
      stock: parseInt(formData.stock),
      imagen_url: formData.imagen_url
    };

    if (productoEditando) {
      // Editar producto existente
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
      // Agregar nuevo producto
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
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    axios.delete(`/api/productos/${id}`)
      .then(() => {
        cargarProductos();
        alert('Producto eliminado correctamente');
      })
      .catch((error) => {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      });
  };

  const formatearPrecio = (precio) => {
    // Formato argentino sin decimales
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
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto} className={Number(producto.stock) === 0 ? 'agotado' : ''}>
                <td>{producto.id_producto}</td>
                <td className="nombre-producto">{producto.nombre}</td>
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

      {/* Modal para agregar/editar productos */}
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
                  step="1"  // 1 para números enteros
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
                  step="0.001"
                />
              </div>
              
              <div className="input-group">
                <label>URL de Imagen:</label>
                <input
                  type="text"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={manejarCambio}
                  placeholder="img/nombre-imagen.jpg"
                />
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