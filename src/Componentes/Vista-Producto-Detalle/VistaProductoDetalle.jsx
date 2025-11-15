import { useState } from "react";
import { useRoute, Link } from "wouter";
import { FaStar } from 'react-icons/fa'; 
import HeaderMenu from "../Header/Header-Menu.jsx";
import { productos } from '../../data/productos';
import FormularioCompra from '../FormularioComprar/Formulario-Compra.jsx';
import './VistaProductoDetalle.css';
import Footer from "../Footer/Footer.jsx";

function VistaProductoDetalle({ agregarAlCarrito, totalItems = 0 }) { // Agregar totalItems
  const [match, params] = useRoute("/producto/:id");
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [comentariosLocales, setComentariosLocales] = useState([]);
  const [mostrarFormularioCompra, setMostrarFormularioCompra] = useState(false);
  const [carritoCompraRapida, setCarritoCompraRapida] = useState([]);

  const producto = productos.find(p => p.id === params?.id);

  // Función para manejar "Comprar ahora"
  const handleComprarAhora = () => {
    const productoConCantidad = {
      ...producto,
      cantidad: cantidad
    };
    setCarritoCompraRapida([productoConCantidad]);
    setMostrarFormularioCompra(true);
  };

  // Función para calcular el total de compra rápida
  const calcularTotalCompraRapida = () => {
    return carritoCompraRapida.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Función para cerrar el formulario
  const handleCerrarFormulario = () => {
    setMostrarFormularioCompra(false);
    setCarritoCompraRapida([]);
  };

  // Si no se encuentra el producto, mostrar mensaje de error
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

  // Productos relacionados (excluyendo el actual)
  const productosRelacionados = productos
    .filter(p => p.id !== producto.id)
    .slice(0, 6);

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

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const renderSelectableStars = () => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className="star selectable"
        color={index < rating ? "#ffc107" : "#e4e5e9"}
        size={24}
        style={{ cursor: 'pointer' }}
        onClick={() => handleRatingClick(index + 1)}
      />
    ));
  };

  const comentarios = [
    { 
      usuario: "TuchakalitalwU", 
      texto: "Me gustó el diseño y la calidad. Aparte de que es muy lindo.", 
      puntuacion: 5,
    },
    { 
      usuario: "Juanito124_owo", 
      texto: "No fue lo que esperaba. creí que era mas grande", 
      puntuacion: 5,
    },
    { 
      usuario: "User0001", 
      texto: "Me en cantaron los colores :3", 
      puntuacion: 5,
    }
  ];

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
                    <div key={prod.id} className="producto-miniatura">
                      <Link href={`/producto/${prod.id}`}>
                        <img src={prod.imagen} alt={prod.nombre} className="imagen-miniatura" />
                      </Link>
                      <div className="precio-miniatura">${prod.precio.toLocaleString()}</div>
                      <Link href={`/producto/${prod.id}`}>
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
                  <img src={producto.imagen} alt={producto.nombre} className="imagen-principal" />
                </div>
                
                <div className="contenedor-derecho">
                  
                  {/* Detalles del Producto */}
                  <div className="detalles-producto">
                    <h1 className="titulo-producto">{producto.nombre}</h1>
                    
                    <div className="rating-producto">
                      <span className="estrellas">{renderStars(producto.rating || 0)}</span>
                      <span>({producto.reviews || 0} reseñas)</span>
                    </div>
                    
                    <div className="precio-producto">${producto.precio.toLocaleString()}</div>

                    <div className="botones-producto">
                      <button 
                        className="btn-anadir-carrito" 
                        onClick={() => agregarAlCarrito({...producto, cantidad})}
                      >
                        Añadir al carrito
                      </button>
                      <button 
                        className="btn-comprar-ahora"
                        onClick={handleComprarAhora}
                      >
                        Comprar ahora
                      </button>
                    </div>

                    <div className="stock-cantidad-detalle">
                      <div className="stock-disponible">
                        <strong>Stock disponible:</strong> {producto.stock || 0}
                      </div>
                      <div className="selector-cantidad-detalle">
                        <strong>Cantidad:</strong>
                        <select 
                          value={cantidad} 
                          onChange={(e) => setCantidad(parseInt(e.target.value))}
                          className="select-cantidad"
                        >
                          {[...Array(Math.min(producto.stock || 1, 10))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} unidad{i + 1 > 1 ? 'es' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-producto-detalle">
                    <h3>Características del Producto</h3>
                    <ul>
                      {(producto.caracteristicas || []).map((caracteristica, index) => (
                        <li key={index}>{caracteristica}</li>
                      ))}
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
                    {renderSelectableStars()}
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
          total={calcularTotalCompraRapida()}
          onClose={handleCerrarFormulario}
        />
      )}

      {/* <footer className="footer">
        <div className="container">
          <p>&copy; 2025 TejidosMiki. Todos los derechos reservados.</p>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
}

export default VistaProductoDetalle;