import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenedor">
        <div className="footer-info">
          <h3>Tejidos Miki</h3>
          <p>Artesanías hechas con amor 🧵✨</p>
        </div>

        <div className="footer-links">
          <a href="/">Inicio</a>
            <a href="/carrito">Carrito</a>
          <a href="/miperfil">Perfil</a>
        </div>

        <div className="footer-social">
          <a href="https://www.instagram.com/tejidosmiki">
            <i className="bx bxl-instagram">instagram</i>
          </a>
          <a href="#">
            <i className="bx bxl-facebook">facebook</i>
          </a>
          <a href="https://wa.me/542901533532">
            <i className="bx bxl-whatsapp">whatsapp</i>
          </a>
        </div>
      </div>

      <div className="footer-copy">
        <p>© 2025 Tejidos Miki — Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;
