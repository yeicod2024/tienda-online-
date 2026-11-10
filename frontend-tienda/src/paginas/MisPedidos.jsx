import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import clienteApi from '../servicios/clienteApi';
import { Package, Clock, MapPin, CreditCard, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';

/**
 * Vista MisPedidos: Muestra el historial de pedidos de compra realizados por el cliente autenticado.
 * Consulta los datos desde el endpoint `/api/pedidos/mis-pedidos` y maqueta los resultados en Bootstrap 5.
 */
function MisPedidos() {
  const [listaPedidos, setListaPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState(null);

  useEffect(() => {
    cargarHistorialPedidos();
  }, []);

  const cargarHistorialPedidos = async () => {
    setCargando(true);
    setErrorMensaje(null);

    const usuarioGuardado = localStorage.getItem('usuario_tienda') || localStorage.getItem('usuario');
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    const correoUsuario = usuario?.correo || 'invitado@tienda.com';

    // Cargar pedidos persitidos en localStorage para este usuario específico
    const pedidosLocalesCliente = JSON.parse(localStorage.getItem(`pedidos_${correoUsuario}`) || '[]');

    try {
      const respuesta = await clienteApi.get('/api/pedidos/mis-pedidos');
      if (respuesta.data && respuesta.data.length > 0) {
        setListaPedidos(respuesta.data);
      } else {
        setListaPedidos(pedidosLocalesCliente);
      }
    } catch (error) {
      console.warn('Cargando historial de pedidos específicos del cliente logueado:', error);
      setListaPedidos(pedidosLocalesCliente);
    } finally {
      setCargando(false);
    }
  };

  // Función para asignar color al badge según el estado del pedido
  const obtenerClaseBadgeEstado = (estado) => {
    switch (estado) {
      case 'ENTREGADO':
        return 'bg-success';
      case 'ENVIADO':
        return 'bg-info text-dark';
      case 'PROCESANDO':
        return 'bg-warning text-dark';
      case 'CANCELADO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          {/* Encabezado de la Sección */}
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary">
            <h2 className="fw-bold text-white d-flex align-items-center gap-2 mb-0">
              <Package className="text-info" size={28} />
              <span>Mis Pedidos</span>
            </h2>
            <Link to="/productos" className="btn btn-outline-secondary btn-sm text-white">
              Volver a la Tienda
            </Link>
          </div>

          {/* Estado de Carga */}
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary">Consultando tu historial de compras...</p>
            </div>
          ) : errorMensaje ? (
            <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
              <AlertCircle size={18} />
              <span>{errorMensaje}</span>
            </div>
          ) : listaPedidos.length === 0 ? (
            /* Sin Pedidos Registrados */
            <div className="card bg-dark text-white border-secondary text-center p-5 rounded-4 shadow-sm">
              <div
                className="rounded-circle bg-secondary bg-opacity-25 text-secondary d-inline-flex align-items-center justify-content-center mb-3 mx-auto"
                style={{ width: '80px', height: '80px' }}
              >
                <ShoppingBag size={38} />
              </div>
              <h4 className="fw-bold text-white mb-2">Aún no has realizado pedidos</h4>
              <p className="text-secondary mb-4">Explora nuestro catálogo y realiza tu primera compra tecnológica.</p>
              <Link to="/productos" className="btn btn-primary btn-lg fw-semibold mx-auto px-4 shadow">
                Ver Catálogo de Productos
              </Link>
            </div>
          ) : (
            /* Lista de Pedidos */
            <div className="d-flex flex-column gap-4">
              {listaPedidos.map((pedido) => (
                <div key={pedido.id} className="card bg-dark text-white border-secondary shadow-lg rounded-4 overflow-hidden">
                  
                  {/* Encabezado de la Tarjeta del Pedido */}
                  <div className="card-header bg-secondary bg-opacity-10 border-bottom border-secondary p-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-bold text-info">#ORD-{pedido.id}</span>
                      <span className="small text-secondary d-flex align-items-center gap-1">
                        <Clock size={14} /> {pedido.fecha || 'Reciente'}
                      </span>
                    </div>

                    <div>
                      <span className={`badge ${obtenerClaseBadgeEstado(pedido.estado)} px-3 py-2 fw-bold`}>
                        {pedido.estado}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta del Pedido */}
                  <div className="card-body p-4">
                    
                    {/* Lista de Productos Comprados */}
                    <div className="mb-3">
                      {pedido.detalles && pedido.detalles.map((item, index) => (
                        <div key={index} className="d-flex align-items-center justify-content-between py-2 border-bottom border-secondary last-border-0">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.urlImagen || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60'}
                              alt={item.productoNombre}
                              className="rounded-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <span className="fw-semibold text-white d-block">{item.productoNombre}</span>
                              <span className="small text-secondary">Cantidad: {item.cantidad} un.</span>
                            </div>
                          </div>
                          <span className="fw-bold text-info">$ {item.precioUnitario * item.cantidad}</span>
                        </div>
                      ))}
                    </div>

                    {/* Datos de Envío y Pago */}
                    <div className="row g-3 pt-2 text-secondary small">
                      <div className="col-12 col-md-8">
                        <span className="d-block fw-semibold text-white mb-1 d-flex align-items-center gap-1">
                          <MapPin size={14} className="text-info" /> Dirección de Entrega:
                        </span>
                        <span className="text-light">{pedido.direccionEnvio}</span>
                      </div>

                      <div className="col-12 col-md-4 text-md-end">
                        <span className="d-block fw-semibold text-white mb-1 d-flex align-items-center justify-content-md-end gap-1">
                          <CreditCard size={14} className="text-info" /> Método de Pago:
                        </span>
                        <span className="badge bg-secondary">{pedido.metodoPago || 'CONTRA_ENTREGA'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Pie de la Tarjeta con Total */}
                  <div className="card-footer bg-dark border-top border-secondary p-3 d-flex justify-content-between align-items-center">
                    <span className="text-secondary small">Total del Pedido:</span>
                    <span className="fs-5 fw-bold text-success">$ {pedido.total}</span>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <PiePagina />
    </div>
  );
}

export default MisPedidos;
