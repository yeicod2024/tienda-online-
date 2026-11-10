import { Link, useNavigate } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import { usoCarrito } from '../contexto/ContextoCarrito';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag } from 'lucide-react';

/**
 * Vista Carrito: Gestiona los productos seleccionados por el cliente antes de procesar la compra.
 * Conectada en tiempo real al contexto global del carrito (usoCarrito) y a localStorage.
 */
function Carrito() {
  const {
    listaCarrito,
    agregarAlCarrito,
    decrementarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    calcularPrecioTotal,
  } = usoCarrito();

  const navegar = useNavigate();

  const alManejarVaciar = () => {
    if (window.confirm('¿Está seguro de que desea vaciar el carrito de compras?')) {
      vaciarCarrito();
    }
  };

  const alProcederPago = () => {
    navegar('/confirmar-compra');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container">

          {/* Encabezado del Carrito */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
            <h2 className="fw-bold text-white d-flex align-items-center gap-2 mb-0">
              <ShoppingCart className="text-info" size={28} />
              <span>Carrito de Compras</span>
            </h2>

            <Link to="/productos" className="btn btn-outline-secondary btn-sm text-white d-flex align-items-center gap-1">
              <ArrowLeft size={16} />
              <span>Seguir comprando</span>
            </Link>
          </div>

          {/* Carrito Vacío */}
          {listaCarrito.length === 0 ? (
            <div className="text-center py-5 my-5">
              <div
                className="rounded-circle bg-secondary bg-opacity-25 text-secondary d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px' }}
              >
                <ShoppingBag size={40} />
              </div>
              <h4 className="fw-bold text-white mb-2">Tu carrito está vacío</h4>
              <p className="text-secondary mb-4">Aún no has agregado ningún dispositivo tecnológico a tu lista.</p>
              <Link to="/productos" className="btn btn-primary px-4 py-2 fw-semibold">
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="row g-4">

              {/* Tabla de Productos Seleccionados */}
              <div className="col-12 col-lg-8">
                <div className="card bg-dark text-white border-secondary shadow-lg overflow-hidden">
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead>
                        <tr className="table-active border-bottom border-secondary">
                          <th scope="col" className="ps-4">Producto</th>
                          <th scope="col" className="text-center">Precio Unitario</th>
                          <th scope="col" className="text-center">Cantidad</th>
                          <th scope="col" className="text-center">Subtotal</th>
                          <th scope="col" className="text-end pe-4">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaCarrito.map((item) => (
                          <tr key={item.id} className="border-bottom border-secondary">
                            <td className="ps-4 py-3">
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={item.urlImagen || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60'}
                                  alt={item.nombre}
                                  className="rounded-3"
                                  style={{ width: '55px', height: '55px', objectFit: 'cover' }}
                                />
                                <div>
                                  <h6 className="mb-0 text-white fw-bold">{item.nombre}</h6>
                                </div>
                              </div>
                            </td>
                            <td className="text-center fw-semibold text-info">
                              $ {item.precio}
                            </td>
                            <td className="text-center">
                              <div className="input-group input-group-sm justify-content-center mx-auto" style={{ maxWidth: '110px' }}>
                                <button
                                  onClick={() => decrementarCantidad(item.id)}
                                  className="btn btn-outline-light"
                                  type="button"
                                >
                                  <Minus size={12} />
                                </button>
                                <input
                                  type="text"
                                  className="form-control bg-dark text-white text-center border-secondary fw-bold px-1"
                                  value={item.cantidad}
                                  readOnly
                                />
                                <button
                                  onClick={() => agregarAlCarrito(item, 1)}
                                  className="btn btn-outline-light"
                                  type="button"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </td>
                            <td className="text-center fw-bold text-white">
                              $ {item.precio * item.cantidad}
                            </td>
                            <td className="text-end pe-4">
                              <button
                                onClick={() => eliminarDelCarrito(item.id)}
                                className="btn btn-outline-danger btn-sm p-2"
                                title="Eliminar ítem"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Acciones de Limpieza */}
                  <div className="card-footer bg-dark border-top border-secondary p-3 d-flex justify-content-between">
                    <button
                      onClick={alManejarVaciar}
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    >
                      <Trash2 size={14} />
                      <span>Vaciar Carrito</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarjeta Resumen de la Orden */}
              <div className="col-12 col-lg-4">
                <div className="card bg-dark text-white border-secondary shadow-lg p-4 rounded-4">
                  <h4 className="fw-bold text-white mb-4 pb-2 border-bottom border-secondary">
                    Resumen del Pedido
                  </h4>

                  <div className="d-flex justify-content-between mb-3 text-secondary">
                    <span>Subtotal:</span>
                    <span className="fw-bold text-white">$ {calcularPrecioTotal()}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3 text-secondary">
                    <span>Envío a domicilio:</span>
                    <span className="text-success fw-bold">GRATIS</span>
                  </div>

                  <hr className="border-secondary my-3" />

                  <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-info">$ {calcularPrecioTotal()}</span>
                  </div>

                  <button
                    onClick={alProcederPago}
                    className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3 shadow"
                  >
                    <CreditCard size={20} />
                    <span>Proceder al Pago</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <PiePagina />
    </div>
  );
}

export default Carrito;
