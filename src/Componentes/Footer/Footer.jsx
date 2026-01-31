import "./Footer.css";
import { Link } from "wouter";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenedor">
        
        {/* Información de la empresa */}
        <div className="footer-info">
          <h3>Tejidos Miki 🧶</h3>
          <p>Artesanías tejidas con amor y dedicación</p>
        </div>

        {/* Navegación rápida */}
        <div className="footer-links">
          <Link href="/">Inicio</Link>
          <Link href="/carrito">Carrito</Link>
          <Link href="/miperfil">Mi Perfil</Link>
        </div>

        {/* Redes sociales y contacto */}
        <div className="footer-redes">
          <a 
            href="https://www.instagram.com/tejidosmiki" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a 
            href="https://wa.me/542901533532" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            WhatsApp
          </a>
        </div>

      </div>
      
      <div className="footer-copy">
        <p>
          © {new Date().getFullYear()} Tejidos Miki — 
          Diseñado por Luciana Orosco y Milagros Nenen
        </p>
        <p className="footer-legal">
          <Link href="/soporte">Soporte</Link> • 
          <Link href="/terminos">Términos y Condiciones</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;