import { useState } from "react";
import { FaStar } from 'react-icons/fa'; 
import '../Menu/MenuDesplegable.css';
import './VistaProductoDetalle.css';

function VistaProductoDetalle() {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [comentariosLocales, setComentariosLocales] = useState([]);
  // Datos del producto principal
  const producto = {
    nombre: "Mini Crochet Banana",
    precio: 5500,
    puntuacion: 5,
    imagen: "https://via.placeholder.com/400x400/6f42c1/ffffff?text=Mini+Banana",
    stock: 1
  };

  // 6 productos relacionados para el grid 2x3
  const productosRelacionados = [
    { 
      id: 1, 
      nombre: "Smartphone Samsung", 
      precio: 8000, 
      imagen: "https://via.placeholder.com/300x300/007bff/ffffff?text=Samsung" 
    },
    { 
      id: 2, 
      nombre: "Laptop HP", 
      precio: 6500, 
      imagen: "https://via.placeholder.com/300x300/28a745/ffffff?text=Laptop+HP" 
    },
    { 
      id: 3, 
      nombre: "Smart Watch", 
      precio: 8000, 
      imagen: "https://via.placeholder.com/300x300/fd7e14/ffffff?text=Smart+Watch" 
    },
    { 
      id: 4, 
      nombre: "Tablet iPad", 
      precio: 6500, 
      imagen: "https://via.placeholder.com/300x300/6f42c1/ffffff?text=iPad" 
    },
    { 
      id: 5, 
      nombre: "Audífonos Sony", 
      precio: 8000, 
      imagen: "https://via.placeholder.com/300x300/dc3545/ffffff?text=Audífonos" 
    },
    { 
      id: 6, 
      nombre: "Cámara Canon", 
      precio: 6500, 
      imagen: "https://via.placeholder.com/300x300/20c997/ffffff?text=Cámara" 
    }
  ];

  // Filtrar productos basado en la búsqueda
  const productosFiltrados = productosRelacionados.filter(producto =>
    producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

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

  // Para el rating de productos
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

  // Para la selección de rating en comentarios
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
        onMouseEnter={() => setRating(index + 1)}
      />
    ));
  };

  return (
    <div className="vista-producto-detalle">
      {/* HEADER CON BUSCADOR A LA DERECHA */}
      <div className="header-con-buscador">
        <div className="buscador-derecha">
          <div className="buscador-container">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="buscador-input"
            />
            <button className="buscador-btn">🔍</button>
          </div>
        </div>
      </div>

      <div className="contenedor-principal">
        
        {/* COLUMNA IZQUIERDA - PRODUCTOS RELACIONADOS */}
        <div className="columna-izquierda">
          <div className="productos-relacionados">
            <h3>Productos Relacionados</h3>
            <div className="grid-productos">
              {(terminoBusqueda ? productosFiltrados : productosRelacionados).map(prod => (
                <div key={prod.id} className="producto-miniatura">
                  <img src={prod.imagen} alt={prod.nombre} className="imagen-miniatura" />
                  <div className="precio-miniatura">${prod.precio.toLocaleString()}</div>
                  <button className="btn-miniatura">Agregar al carrito</button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                  <span className="estrellas">{renderStars(producto.puntuacion)}</span>
                </div>
                
                <div className="precio-producto">${producto.precio.toLocaleString()}</div>

                <div className="botones-producto">
                  <button className="btn-anadir-carrito">Añadir al carrito</button>
                  <button className="btn-comprar-ahora">Comprar ahora</button>
                </div>

                <div className="stock-cantidad-detalle">
                  <div className="stock-disponible">
                    <strong>stock disponible:</strong> {producto.stock}
                  </div>
                  <div className="selector-cantidad-detalle">
                    <strong>Cantidad:</strong>
                    <select 
                      value={cantidad} 
                      onChange={(e) => setCantidad(parseInt(e.target.value))}
                      className="select-cantidad"
                    >
                      <option value="1">1 unidad</option>
                      <option value="2">2 unidades</option>
                      <option value="3">3 unidades</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="info-producto-detalle">
                <h3>Lo que tenés que saber de este producto</h3>
                <ul>
                  <li>Nombre del diseño: Mini banana</li>
                  <li>Formato de venta: Individual.</li>
                  <li>Dimensiones: 13cm de altura y 7cm de ancho.</li>
                </ul>
              </div>

            </div>
          </div>
          <div className="seccion-comentarios-detalle">
            <h3>Agregar comentario:</h3>
            
            <div className="formulario-comentario">
              <div className="rating-comentario">
                {renderSelectableStars()}
              </div>
              <textarea 
                className="textarea-comentario"
                placeholder="..."
                rows="2"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
              <button className="btn-enviar-comentario">Enviar Comentario</button>
            </div>

            <div className="lista-comentarios">
              {[...comentariosLocales, ...comentarios].map((com, index) => (
                <div key={index} className="comentario-item">
                  <div className="usuario-comentario">{com.usuario}</div>
                  <div className="texto-comentario">{com.texto}</div>
                  {com.puntuacion === 5 && (
                    <div className="estrellas-comentario">★★★★★</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VistaProductoDetalle;