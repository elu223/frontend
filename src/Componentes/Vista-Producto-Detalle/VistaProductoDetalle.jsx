import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { FaStar } from 'react-icons/fa'; 
import HeaderMenu from "../Header/Header-Menu.jsx";
import FormularioCompra from '../FormularioComprar/Formulario-Compra.jsx';
import './VistaProductoDetalle.css';
import Footer from "../Footer/Footer.jsx";
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';
import { useLocation } from 'wouter';

function VistaProductoDetalle({ agregarAlCarrito, totalItems = 0 }) {
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

  // Obtener producto desde la API
  useEffect(() => {
    if (params?.id) {
      cargarProducto();
    }
  }, [params?.id]);

  const cargarProducto = () => {
    setCargando(true);
    
    // Primero obtener el producto específico
    axios.get(`http://localhost:5000/api/productos/${params.id}`)
      .then((response) => {
        setProducto(response.data);
        
        // Luego obtener todos los productos para mostrar relacionados
        axios.get('http://localhost:5000/api/productos')
          .then((responseAll) => {
            // Filtrar productos relacionados (excluyendo el actual)
            const relacionados = responseAll.data
              .filter(p => p.id_producto !== response.data.id_producto)
              .slice(0, 6);
            setProductosRelacionados(relacionados);
            setCargando(false);
          })
          .catch((error) => {
            console.error('Error al cargar productos relacionados:', error);
            setCargando(false);
          });
      })
      .catch((error) => {
        console.error('Error al cargar producto:', error);
        setCargando(false);
      });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "star filled" : "star"}
        color={index < rating ? "#ffc107" : "#e4e5e9"}
        size={20}
      />
    ));
  };

  const comentarios = [
    {
      usuario: "AnaMaria87",
      texto: "Me gustó el diseño y la calidad. Aparte de que es muy lindo.", 
      puntuacion: 5,
    },
    { 
      usuario: "Juanito124", 
      texto: "No fue lo que esperaba. creí que era mas grande", 
      puntuacion: 5,
    },
    { 
      usuario: "User0001", 
      texto: "Me en cantaron los colores :3", 
      puntuacion: 5,
    }
  ];

  // Si está cargando
  if (cargando) {
    return (
      <div className="vista-producto-detalle">
        <HeaderMenu totalItems={totalItems} />
        <main className="main-content">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="cargando-detalle">Cargando producto...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Si el producto no existe
  if (!producto) {  
    return (
      <div className="vista-producto-detalle">
        <HeaderMenu totalItems={totalItems} />
        <main className="main-content">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h2>Producto no encontrado</h2>
              <p>El producto que buscas no existe o ha sido removido.</p>
              <Link href="/" className="btn-volver-tienda">
                ← Volver a la tienda
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="vista-producto-detalle">
      <HeaderMenu totalItems={totalItems} />

      <main className="main-content">
        <div className="container">
          <div className="contenedor-principal">
            
            {/* COLUMNA IZQUIERDA - PRODUCTOS RELACIONADOS */}
            <div className="columna-izquierda">
              <div className="productos-relacionados">
                <h3>Productos Relacionados</h3>
                <div className="grid-productos">
                  {productosRelacionados.map(prod => (
                    <div key={prod.id_producto} className="producto-miniatura">
                      <Link href={`/producto/${prod.id_producto}`}>
                        <img src={`http://localhost:5000${prod.imagen_url}`} alt={prod.nombre} className="imagen-miniatura" />
                      </Link>
                      <div className="precio-miniatura">${parseInt(prod.precio).toLocaleString()}</div>
                      <Link href={`/producto/${prod.id_producto}`}>
                        <button className="btn-miniatura">Ver Detalles</button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - CONTENIDO PRINCIPAL */}
            <div className="columna-derecha">
              
              <div className="seccion-superior">
                
                {/* Imagen Principal */}
                <div className="contenedor-imagen-principal">
                  <img src={`http://localhost:5000${producto.imagen_url}`} alt={producto.nombre} className="imagen-principal" />
                </div>
                
                <div className="contenedor-derecho">
                  
                  {/* Detalles del Producto */}
                  <div className="detalles-producto">
                    <h1 className="titulo-producto">{producto.nombre}</h1>
                    
                    <div className="rating-producto">
                      <span className="estrellas">{renderStars(4.5)}</span>
                      <span>({producto.reviews || 0} reseñas)</span>
                    </div>
                    
                    <div className="precio-producto">${parseInt(producto.precio).toLocaleString()}</div>
                      
                    <div className="botones-producto">
                      <button 
                        className="btn-anadir-carrito" 
                        onClick={() => {
                          if (!user) {
                            setLocation('/iniciar-sesion');
                            return;
                          }

                          agregarAlCarrito({
                            ...producto, 
                            id: producto.id_producto,
                            cantidad: cantidad,
                            img: producto.imagen_url
                          });
                        }}
                      >
                        Añadir al carrito
                      </button>
                      <button 
                        className="btn-comprar-ahora"
                        onClick={() => {
                          if (!user) {
                            setLocation('/iniciar-sesion');
                            return;
                          }

                          const productoConCantidad = {
                            ...producto,
                            id: producto.id_producto,
                            cantidad: cantidad,
                            img: producto.imagen_url
                          };
                          setCarritoCompraRapida([productoConCantidad]);
                          setMostrarFormularioCompra(true);
                        }}
                      >
                        Comprar ahora
                      </button>
                    </div>

                    <div className="stock-cantidad-detalle">
                      <div className="stock-disponible">
                        <strong>Stock disponible:</strong> {producto.stock || 0}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-producto-detalle">
                    <h3>Características del Producto</h3>
                    <ul>
                      {producto.descripcion && (
                        <li>{producto.descripcion}</li>
                      )}
                      <li>Producto de alta calidad</li>
                      <li>Materiales premium</li>
                      <li>Hecho a mano</li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* SECCIÓN DE COMENTARIOS */}
              <div className="seccion-comentarios-detalle">
                <h3>Comentarios y Reseñas</h3>
                
                <div className="formulario-comentario">
                  <h4>Agregar comentario:</h4>
                  <div className="rating-comentario">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className="star selectable"
                        color={index < rating ? "#ffc107" : "#e4e5e9"}
                        size={24}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setRating(index + 1)}
                      />
                    ))}
                  </div>
                  <textarea 
                    className="textarea-comentario"
                    placeholder="Comparte tu experiencia con este producto..."
                    rows="4"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  />
                  <button 
                    className="btn-enviar-comentario"
                    onClick={() => {
                      if (!user) {
                        setLocation('/iniciar-sesion');
                        return;
                      }

                      if (comentario.trim() && rating > 0) {
                        const nuevoComentario = {
                          usuario: user.nombre || "Usuario Actual",
                          texto: comentario,
                          puntuacion: rating
                        };
                        setComentariosLocales([...comentariosLocales, nuevoComentario]);
                        setComentario('');
                        setRating(0);
                      }
                    }}
                  >
                    Enviar Comentario
                  </button>
                </div>

                <div className="lista-comentarios">
                  {[...comentarios, ...comentariosLocales].map((com, index) => (
                    <div key={index} className="comentario-item">
                      <div className="usuario-comentario">{com.usuario}</div>
                      <div className="texto-comentario">{com.texto}</div>
                      <div className="estrellas-comentario">
                        {"★".repeat(com.puntuacion)}{"☆".repeat(5 - com.puntuacion)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Formulario de Compra Modal */}
      {mostrarFormularioCompra && (
        <FormularioCompra 
          carrito={carritoCompraRapida}
          total={carritoCompraRapida.reduce((total, item) => total + (item.precio * item.cantidad), 0)}
          onClose={() => {
            setMostrarFormularioCompra(false);
            setCarritoCompraRapida([]);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default VistaProductoDetalle;

