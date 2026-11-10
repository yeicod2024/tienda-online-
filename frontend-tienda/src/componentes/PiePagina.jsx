import { MapPin, Phone, Mail, Globe, Share2, MessageSquare } from 'lucide-react';

/**
 * Componente PiePagina: Pie de página oficial de "Technological Device".
 * Implementa la maquetación en 3 columnas vista en la foto de referencia (Contacto, Enlaces, Síguenos)
 * utilizando únicamente las utilidades de cuadrícula y tipografía de Bootstrap 5.
 */
function PiePagina() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-secondary">
      <div className="container">
        <div className="row g-4 text-center text-md-start">
          
          {/* Columna 1: Información de Contacto */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-3 text-white">Contacto</h5>
            <ul className="list-unstyled text-secondary fs-6 d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <MapPin size={18} className="text-info" />
                <span>Dirección: Calle # 12-123, Ibague, Colombia</span>
              </li>
              <li className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <Phone size={18} className="text-info" />
                <span>Tel: +1 234 567 890</span>
              </li>
              <li className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <Mail size={18} className="text-info" />
                <span>Email: technologicalDevice@empresa.com</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-3 text-white">Enlaces</h5>
            <ul className="list-unstyled text-secondary fs-6 d-flex flex-column gap-2 mb-0">
              <li>
                <a href="#sobre-nosotros" className="text-secondary text-decoration-none">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-secondary text-decoration-none">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#privacidad" className="text-secondary text-decoration-none">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-3 text-white">Síguenos</h5>
            <ul className="list-unstyled text-secondary fs-6 d-flex flex-column gap-2 mb-0">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2">
                  <Share2 size={18} className="text-primary" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2">
                  <Globe size={18} className="text-info" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2">
                  <MessageSquare size={18} className="text-danger" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-4 border-secondary" />

        {/* Derechos Reservados */}
        <div className="row">
          <div className="col text-center">
            <p className="text-secondary small mb-0">
              &copy; {new Date().getFullYear()} Technological Device. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PiePagina;
