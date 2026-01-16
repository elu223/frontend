import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { FaStar } from 'react-icons/fa'; 
import HeaderMenu from "../Header/Header-Menu.jsx";
import FormularioCompra from '../FormularioComprar/Formulario-Compra.jsx';
import './VistaProductoDetalle.css';
import Footer from "../Footer/Footer.jsx";
import axios from 'axios';

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

  // obtener producto desde la api
  useEffect(() => {
    if (params?.id) {
      cargarProducto();
    }
  }, [params?.id]);

  const cargarProducto = () => {
    setCargando(true);
    
    // obtener producto específico
    axios.get(`http://localhost:5000/api/productos/${params.id}`)
      .then((response) => {
        setProducto(response.data);
        
        // obtener productos relacionados
        axios.get('http://localhost:5000/api/productos')
          .then((responseAll) => {
            // filtrar relacionados (excluir actual)
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

  // añadir al carrito: valida stock, no actualiza bd
  const handleAñadirCarrito = () => {
    const stockActual = producto?.stock || 0;
    const cantidadNumero = Number(cantidad) || 1;
    
    // validaciones básicas
    if (stockActual <= 0) {
      alert('No hay stock disponible');
      return; 
    }
    
    if (cantidadNumero <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }
    
    if (cantidadNumero > stockActual) {
      alert(`Solo hay ${stockActual} unidad(es) disponibles`);
      return;
    }
    
    // verificar stock en backend
    axios.get(`http://localhost:5000/api/productos/${producto.id_producto}`)
      .then((response) => {
        const stockVerificado = response.data.stock;
        
        // validar con stock actualizado
        if (cantidadNumero > stockVerificado) {
          alert(`Stock actualizado: solo quedan ${stockVerificado} unidad(es) disponibles`);
          setCantidad(Math.min(cantidadNumero, stockVerificado));
          return;
        }
        
        // añadir solo al carrito local
        // no actualizar bd aquí
        agregarAlCarrito({
          ...producto,
          id: producto.id_producto,
          cantidad: cantidadNumero,
          img: `http://localhost:5000${producto.imagen_url}`
        });
        
        // mostrar confirmación
        alert(`${cantidadNumero} unidad(es) de "${producto.nombre}" añadidas al carrito`);
      })
      .catch((error) => {
        console.error('Error al verificar stock:', error);
        alert('Error al verificar stock disponible');
      });
  };

  // compra rápida
  const handleComprarAhora = () => {
    const stockActual = producto?.stock || 0;
    const cantidadNumero = Number(cantidad) || 1;
    
    // validación básica
    if (stockActual <= 0) {
      alert('No hay stock disponible');
      return;
    }
    
    if (cantidadNumero <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }
    
    if (cantidadNumero > stockActual) {
      alert(`Solo hay ${stockActual} unidad(es) disponibles`);
      return;
    }
    
    // verificar stock en backend
    axios.get(`http://localhost:5000/api/productos/${producto.id_producto}`)
      .then((response) => {
        const stockVerificado = response.data.stock;
        
        if (cantidadNumero > stockVerificado) {
          alert(`Stock actualizado: solo quedan ${stockVerificado} unidad(es) disponibles`);
          setCantidad(Math.min(cantidadNumero, stockVerificado));
          return;
        }
        
        // proceder si hay stock suficiente
        const productoConCantidad = {
          ...producto,
          id: producto.id_producto,
          cantidad: cantidadNumero,
          img: `http://localhost:5000${producto.imagen_url}`
        };
        setCarritoCompraRapida([productoConCantidad]);
        setMostrarFormularioCompra(true);
      })
      .catch((error) => {
        console.error('Error al verificar stock:', error);
        alert('Error al verificar stock disponible');
      });
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

  // si está cargando
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

  // si el producto no existe
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
                      <div className="selector-cantidad-detalle" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          Cantidad:
                          <input
                            type="number"
                            min="1"
                            max={producto.stock || 1}
                            value={cantidad}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 1;
                              const limite = producto.stock || 0;
                              
                              // si el usuario escribe más que el stock
                              if (val > limite && limite > 0) {
                                alert(`Solo hay ${limite} disponibles`);
                                setCantidad(limite);
                              } 
                              // si escribe menos de 1
                              else if (val < 1) {
                                setCantidad(1);
                              }
                              // si es válido
                              else {
                                setCantidad(val);
                              }
                            }}
                            className="select-cantidad"
                            style={{ width: '80px' }}
                          />
                        </label>

                        <div style={{ fontWeight: 600 }}>
                          Stock: {producto.stock || 0}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          className="btn-anadir-carrito"
                          onClick={handleAñadirCarrito}
                          disabled={producto.stock === 0 || cantidad > (producto.stock || 0)}
                        >
                          Añadir al carrito
                        </button>

                        <button
                          className="btn-comprar-ahora"
                          onClick={handleComprarAhora}
                          disabled={producto.stock === 0 || cantidad > (producto.stock || 0)}
                        >
                          Comprar ahora
                        </button>
                      </div>
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
                      if (comentario.trim() && rating > 0) {
                        const nuevoComentario = {
                          usuario: "Usuario Actual",
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