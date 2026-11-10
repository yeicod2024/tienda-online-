import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usoCarrito } from '../contexto/ContextoCarrito';

/**
 * Componente TarjetaProducto: Renderiza la información individual de un dispositivo tecnológico.
 * Diseñado con componentes y utilidades puras de Bootstrap 5 y conectado al contexto del carrito.
 * 
 * Props:
 * - producto: Objeto con los detalles (id, nombre, precio, stock, urlImagen, categoriaNombre).
 * - alAgregarAlCarrito: (Opcional) Función callback para notificar al componente padre.
 */
function TarjetaProducto({ producto, alAgregarAlCarrito }) {
  const { id, nombre, precio } = producto;
  const { agregarAlCarrito } = usoCarrito();

  // Lectura del rol de usuario (Administrador vs Cliente)
  const usuarioGuardado = localStorage.getItem('usuario_tienda') || localStorage.getItem('usuario');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const esAdmin = usuario && (usuario.rol === 'ROLE_ADMIN' || usuario.esAdmin);

  // Resolución resiliente de la imagen principal
  const urlImagenVisible =
    producto.urlImagen ||
    (producto.imagenes && producto.imagenes.find((img) => img.esPrincipal)?.urlImagen) ||
    (producto.imagenes && producto.imagenes[0]?.urlImagen) ||
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60';

  // Resolución de la categoría y del stock disponible
  const categoriaTexto = producto.categoriaNombre || producto.categoria?.nombre;
  const cantidadStock = producto.stock !== undefined ? producto.stock : 0;

  const alManejarBotonAgregar = () => {
    agregarAlCarrito(producto);
    if (alAgregarAlCarrito) {
      alAgregarAlCarrito(producto);
    }
  };

  return (
    <div className="card h-100 bg-dark text-white border-secondary shadow-sm">
      {/* Insignia de categoría e imagen del dispositivo */}
      <div className="position-relative">
        <img
          src={urlImagenVisible}
          className="card-img-top p-3 rounded-4"
          alt={nombre}
          style={{ height: '220px', objectFit: 'contain', backgroundColor: '#1a201a' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60';
          }}
        />
        {categoriaTexto && (
          <span className="position-absolute top-0 start-0 m-3 badge bg-info text-dark fw-semibold">
            {categoriaTexto}
          </span>
        )}
        {cantidadStock <= 0 && (
          <span className="position-absolute top-0 end-0 m-3 badge bg-danger fw-semibold">
            Agotado
          </span>
        )}
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title text-white fw-bold mb-2 text-truncate" title={nombre}>
            {nombre}
          </h5>
          <p className="card-text text-info fs-5 fw-bold mb-3">
            ${Number(precio).toLocaleString('es-CO')} COP
          </p>
        </div>

        {/* Acciones de la tarjeta */}
        <div className="d-flex gap-2 mt-auto">
          <Link
            to={`/producto/${id}`}
            className="btn btn-outline-light btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
          >
            <Eye size={16} />
            <span>Detalle</span>
          </Link>

          {/* Botón de Agregar exclusivo para Clientes (se oculta a Administradores) */}
          {!esAdmin && (
            <button
              onClick={alManejarBotonAgregar}
              disabled={cantidadStock <= 0}
              className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 fw-semibold"
            >
              <ShoppingCart size={16} />
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export default TarjetaProducto;
