import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { FaStar } from 'react-icons/fa'; 
import FormularioCompra from '../FormularioComprar/Formulario-Compra.jsx';
import './VistaProductoDetalle.css';
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';
import { useLocation } from 'wouter';
import { useCarrito } from '../../CarritoContext';

function VistaProductoDetalle() {
  const [match, params] = useRoute("/producto/:id");
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [comentariosLocales, setComentariosLocales] = useState([]);
  const [mostrarFormularioCompra, setMostrarFormularioCompra] = useState(false);
  const [carritoCompraRapida, setCarritoCompraRapida] = useState([]);
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { carrito, agregarAlCarrito } = useCarrito(); 

  useEffect(() => {
    if (params?.id) cargarProducto();
  }, [params?.id]);

  const cargarProducto = () => {
    setCargando(true);
    axios.get(`http://localhost:5000/api/productos/${params.id}`).then((res) => {
      setProducto(res.data);
      axios.get('http://localhost:5000/api/productos').then((resAll) => {
        setProductosRelacionados(resAll.data.filter(p => p.id_producto !== res.data.id_producto).slice(0, 6));
        setCargando(false);
      }).catch(() => setCargando(false));
    }).catch(() => setCargando(false));
  };

  const cantidadEnCarrito = () => {
    const item = carrito.find(item => item.id === producto?.id_producto);
    return item ? item.cantidad : 0;
  };

  const verificarAutenticacion = () => {
    if (!user) {
      alert('debes iniciar sesión');
      setLocation('/iniciar-sesion');
      return false;
    }
    return true;
  };

  const manejarStock = (operacion) => {
    const cantidadNumero = Number(cantidad) || 1;
    const yaEnCarrito = cantidadEnCarrito();
    
    axios.get(`http://localhost:5000/api/productos/${producto.id_producto}`).then((res) => {
      const stock = res.data.stock;
      const total = yaEnCarrito + cantidadNumero;
      
      if (total > stock) {
        const maxPermitido = stock - yaEnCarrito;
        if (maxPermitido <= 0) {
          alert('ya no hay unidades disponibles');
        } else {
          alert(`solo puedes ${operacion} ${maxPermitido} unidad(es) más`);
          setCantidad(maxPermitido);
        }
        return;
      }
      
      if (operacion === 'agregar') {
        agregarAlCarrito({ ...producto, id: producto.id_producto, cantidad: cantidadNumero, img: `http://localhost:5000${producto.imagen_url}` });
        alert(`${cantidadNumero} unidad(es) de "${producto.nombre}" añadidas`);
      } else {
        setCarritoCompraRapida([{ ...producto, id: producto.id_producto, cantidad: cantidadNumero, img: `http://localhost:5000${producto.imagen_url}` }]);
        setMostrarFormularioCompra(true);
      }
    }).catch(() => alert('error al verificar stock'));
  };

  const comentarios = [
    { usuario: "AnaMaria87", texto: "me gustó el diseño y la calidad.", puntuacion: 5 },
    { usuario: "Juanito124", texto: "no fue lo que esperaba.", puntuacion: 5 },
    { usuario: "User0001", texto: "me encantaron los colores :3", puntuacion: 5 }
  ];

  if (cargando) return (
    <div className="vista-producto-detalle">
      {/*Si no se encuentra el producto*/}
      <main className="main-content"><div className="cargando-detalle">cargando...</div></main>
    </div>
  );

  if (!producto) return (
    <div className="vista-producto-detalle">
      <main className="main-content">
        <div className="producto-no-encontrado">
          <h2>producto no encontrado</h2>
          <Link href="/" className="btn-volver-tienda">← volver a la tienda</Link>
        </div>
      </main>
    </div>
  );

  const yaTiene = cantidadEnCarrito();
  const maximoPermitido = Math.max(0, producto.stock - yaTiene);

  return (
    <div className="vista-producto-detalle">
      {/*Vista de imagen pricipal con sus datos*/}
      <main className="main-content">
        <div className="contenedor-principal">
          
          <div className="columna-izquierda">
            <div className="productos-relacionados">
              <h3>productos relacionados</h3>
              <div className="grid-productos">
                {productosRelacionados.map(prod => (
                  <div key={prod.id_producto} className="producto-miniatura">
                    <Link href={`/producto/${prod.id_producto}`}>
                      <img src={`http://localhost:5000${prod.imagen_url}`} alt={prod.nombre} className="imagen-miniatura" />
                    </Link>
                    <div className="precio-miniatura">${parseInt(prod.precio).toLocaleString()}</div>
                    <Link href={`/producto/${prod.id_producto}`}>
                      <button className="btn-miniatura">ver detalles</button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="columna-derecha">
            <div className="seccion-superior">
              <div className="contenedor-imagen-principal">
                <img src={`http://localhost:5000${producto.imagen_url}`} alt={producto.nombre} className="imagen-principal" />
              </div>
              
              <div className="contenedor-derecho">
                <div className="detalles-producto">
                  <h1 className="titulo-producto">{producto.nombre}</h1>
                  <div className="rating-producto">
                    <span className="estrellas">
                      {[...Array(5)].map((_, i) => <FaStar key={i} color={i < 4.5 ? "#ffc107" : "#e4e5e9"} size={20} />)}
                    </span>
                    <span>({producto.reviews || 0} reseñas)</span>
                  </div>
                  <div className="precio-producto">${parseInt(producto.precio).toLocaleString()}</div>
                  
                  <div className="selector-cantidad-detalle">
                    <label>cantidad:
                      <input type="number" min="1" max={maximoPermitido} value={cantidad} onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        if (val > maximoPermitido && maximoPermitido > 0) {
                          alert(`solo puedes agregar ${maximoPermitido} unidad(es) más`);
                          setCantidad(maximoPermitido);
                        } else setCantidad(val < 1 ? 1 : val);
                      }} className="select-cantidad" />
                    </label>
                    <div className="stock-info">stock: {producto.stock}</div>
                  </div>

                  <div className="botones-producto">
                    <button className="btn-anadir-carrito" onClick={() => verificarAutenticacion() && manejarStock('agregar')}>
                      añadir al carrito
                    </button>
                    <button className="btn-comprar-ahora" onClick={() => verificarAutenticacion() && manejarStock('comprar')}>
                      comprar ahora
                    </button>
                  </div>
                </div>
                
                <div className="info-producto-detalle">
                  <h3>características del producto</h3>
                  <ul>
                    {producto.descripcion && <li>{producto.descripcion}</li>}
                    <li>producto de alta calidad</li>
                    <li>materiales premium</li>
                    <li>hecho a mano</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="seccion-comentarios-detalle">
              <h3>comentarios y reseñas</h3>
              <div className="formulario-comentario">
                <h4>agregar comentario:</h4>
                <div className="rating-comentario">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="star selectable" color={i < rating ? "#ffc107" : "#e4e5e9"} size={24} onClick={() => setRating(i + 1)} />)}
                </div>
                <textarea className="textarea-comentario" placeholder="comparte tu experiencia..." rows="4" value={comentario} onChange={(e) => setComentario(e.target.value)} />
                <button className="btn-enviar-comentario" onClick={() => {
                  if (!user) setLocation('/iniciar-sesion');
                  else if (comentario.trim() && rating > 0) {
                    setComentariosLocales([...comentariosLocales, { usuario: user.nombre || "usuario actual", texto: comentario, puntuacion: rating }]);
                    setComentario(''); setRating(0);
                  }
                }}>enviar comentario</button>
              </div>

              <div className="lista-comentarios">
                {[...comentarios, ...comentariosLocales].map((com, i) => (
                  <div key={i} className="comentario-item">
                    <div className="usuario-comentario">{com.usuario}</div>
                    <div className="texto-comentario">{com.texto}</div>
                    <div className="estrellas-comentario">{"★".repeat(com.puntuacion)}{"☆".repeat(5 - com.puntuacion)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {mostrarFormularioCompra && (
        <FormularioCompra
          carrito={carritoCompraRapida}
          total={carritoCompraRapida.reduce((t, item) => t + (item.precio * item.cantidad), 0)} // CORREGIDO
          onClose={() => {
            setMostrarFormularioCompra(false);
            setCarritoCompraRapida([]);
          }}
        />
      )}
    </div>
  );
}

export default VistaProductoDetalle;