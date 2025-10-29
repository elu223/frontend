import './VistaProductos.css';
function ProductCard({ nombre, precio, imagen }) {
    return (
        <div className="tarjeta-producto">
            <img src={imagen} alt={nombre} className="imagen-producto" />
            <h2 className="nombre-producto">{nombre}</h2>
            <p className="precio-producto">${precio.toFixed(2)}</p>
        </div>
    );
}
export default ProductCard;