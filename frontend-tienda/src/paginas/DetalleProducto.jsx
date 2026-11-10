import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import { obtenerProductoPorId } from '../servicios/servicioProducto';
import { usoCarrito } from '../contexto/ContextoCarrito';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Plus, Minus, AlertCircle, Database } from 'lucide-react';

/**
 * Vista DetalleProducto: Presenta la ficha técnica y opciones de compra de un dispositivo específico.
 * Obtiene los detalles reales almacenados en la Base de Datos a través de la API REST de Spring Boot.
 */
function DetalleProducto() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { agregarAlCarrito } = usoCarrito();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState(null);

  // Carga del detalle del producto desde el servicio REST
  useEffect(() => {
    const cargarDetalle = async () => {
      setCargando(true);
      setErrorMensaje(null);
      try {
        const datosBackend = await obtenerProductoPorId(id);
        if (datosBackend) {
          setProducto(datosBackend);
        } else {
          setErrorMensaje('El producto solicitado no fue encontrado en la Base de Datos.');
        }
      } catch (error) {
        console.error('Error al obtener el detalle del producto desde el servidor:', error);
        setErrorMensaje('No se pudo establecer conexión con el servidor Backend.');
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id]);

  // Extracción resiliente de la imagen principal, categoría y stock
  const urlImagenVisible =
    producto?.urlImagen ||
    (producto?.imagenes && producto.imagenes.find((img) => img.esPrincipal)?.urlImagen) ||
    (producto?.imagenes && producto.imagenes[0]?.urlImagen) ||
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80';

  const categoriaTexto = producto?.categoriaNombre || producto?.categoria?.nombre || 'Tecnología';
  const cantidadStock = producto?.stock !== undefined ? producto.stock : 0;

  // Lectura del rol de usuario (Administrador vs Cliente)
  const usuarioGuardado = localStorage.getItem('usuario_tienda') || localStorage.getItem('usuario');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const esAdmin = usuario && (usuario.rol === 'ROLE_ADMIN' || usuario.esAdmin);

  const alDecrementarCantidad = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const alIncrementarCantidad = () => {
    if (producto && cantidad < cantidadStock) {
      setCantidad(cantidad + 1);
    }
  };

  const alManejarAgregarCarrito = () => {
    if (producto) {
      agregarAlCarrito(producto, cantidad);
      alert(`¡${cantidad} unidad(es) de "${producto.nombre}" agregada(s) al carrito!`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {/* Encabezado de Navegación */}
      <Navegacion />

      {/* Cuerpo Principal del Detalle */}
      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container">
          
          {/* Botón Volver */}
          <button
            onClick={() => navegar(-1)}
            className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center gap-2 text-white shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Volver al catálogo</span>
          </button>

          {/* Indicador de Carga */}
          {cargando && (
            <div className="text-center py-5">
              <div className="spinner-border text-info mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary">Obteniendo ficha técnica desde la Base de Datos...</p>
            </div>
          )}

          {/* Mensaje de Error / Producto No Encontrado */}
          {!cargando && errorMensaje && (
            <div className="alert alert-dark border-warning text-white text-center py-5 shadow" role="alert">
              <AlertCircle size={40} className="text-warning mb-3" />
              <h5 className="fw-bold mb-2">Producto No Disponible</h5>
              <p className="text-secondary small mb-3">{errorMensaje}</p>
              <Link to="/productos" className="btn btn-info btn-sm fw-bold">
                Ver Catálogo Completo
              </Link>
            </div>
          )}

          {/* Ficha Técnica del Producto Real */}
          {!cargando && producto && (
            <div className="card bg-dark text-white border-secondary shadow-lg overflow-hidden">
              <div className="row g-0">
                
                {/* Columna 1: Imagen del Dispositivo */}
                <div className="col-12 col-md-6 p-4 d-flex align-items-center justify-content-center bg-black rounded-start">
                  <img
                    src={urlImagenVisible}
                    alt={producto.nombre}
                    className="img-fluid rounded-3 shadow"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Columna 2: Especificaciones y Compra */}
                <div className="col-12 col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-between">
                  <div>
                    {/* Categoría e Insignia de Stock */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-info text-dark fw-bold">
                        {categoriaTexto}
                      </span>
                      {cantidadStock > 0 ? (
                        <span className="badge bg-success">
                          Disponible ({cantidadStock} en stock)
                        </span>
                      ) : (
                        <span className="badge bg-danger">Agotado</span>
                      )}
                    </div>

                    {/* Título del Producto */}
                    <h2 className="fw-bold text-white mb-3 display-6">
                      {producto.nombre}
                    </h2>

                    {/* Precio */}
                    <div className="mb-4">
                      <span className="fs-1 fw-bold text-info">
                        ${Number(producto.precio * cantidad).toLocaleString('es-CO')} COP
                      </span>
                      {cantidad > 1 && (
                        <span className="text-secondary ms-2 small">
                          (${Number(producto.precio).toLocaleString('es-CO')} c/u)
                        </span>
                      )}
                    </div>

                    {/* Descripción */}
                    <p className="text-light lh-lg mb-4 fs-6">
                      {producto.descripcion}
                    </p>

                    {/* Selector de Cantidad exclusivo para Clientes */}
                    {!esAdmin && cantidadStock > 0 && (
                      <div className="mb-4">
                        <label className="form-label text-secondary small fw-semibold">
                          Cantidad a comprar:
                        </label>
                        <div className="input-group" style={{ maxWidth: '140px' }}>
                          <button
                            onClick={alDecrementarCantidad}
                            className="btn btn-outline-light"
                            type="button"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="text"
                            className="form-control bg-dark text-white text-center border-secondary fw-bold"
                            value={cantidad}
                            readOnly
                          />
                          <button
                            onClick={alIncrementarCantidad}
                            className="btn btn-outline-light"
                            type="button"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Garantías y Botón de Agregar (Solo visible para Clientes) */}
                  <div>
                    <div className="d-flex flex-column gap-2 mb-4 text-secondary small">
                      <div className="d-flex align-items-center gap-2">
                        <Truck size={16} className="text-info" />
                        <span>Envío seguro a todo Colombia</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <ShieldCheck size={16} className="text-success" />
                        <span>Garantía directa con Technological Device</span>
                      </div>
                    </div>

                    {!esAdmin ? (
                      <button
                        onClick={alManejarAgregarCarrito}
                        disabled={cantidadStock <= 0}
                        className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3 shadow"
                      >
                        <ShoppingCart size={22} />
                        <span>Agregar al Carrito de Compras</span>
                      </button>
                    ) : (
                      <div className="alert alert-dark border-info text-info text-center py-3 mb-0">
                        <ShieldCheck size={20} className="me-2" />
                        <span>Modo Administrador Activo: Gestión de Inventario</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          )}


        </div>
      </main>

      {/* Pie de Página */}
      <PiePagina />
    </div>
  );
}

export default DetalleProducto;

