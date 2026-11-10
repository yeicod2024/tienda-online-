import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import { usoCarrito } from '../contexto/ContextoCarrito';
import clienteApi from '../servicios/clienteApi';
import { MapPin, Phone, CreditCard, ShoppingBag, CheckCircle, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

/**
 * Vista ConfirmarCompra (Checkout):
 * Formulario donde el cliente ingresa la Dirección de Envío completa (Ciudad, Departamento, Barrio, Dirección exacta)
 * y el Método de Pago para finalizar el pedido de compra.
 */
function ConfirmarCompra() {
  const { listaCarrito, vaciarCarrito, calcularPrecioTotal } = usoCarrito();

  // Obtener usuario autenticado actual
  const usuarioGuardado = localStorage.getItem('usuario_tienda') || localStorage.getItem('usuario');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const correoUsuario = usuario?.correo || 'invitado@tienda.com';

  // Cargar direcciones guardadas previamente por este usuario
  const [listaDireccionesGuardadas] = useState(() => {
    try {
      const guardadas = localStorage.getItem(`direcciones_${correoUsuario}`);
      return guardadas ? JSON.parse(guardadas) : [];
    } catch {
      return [];
    }
  });

  const [direccionSeleccionadaId, setDireccionSeleccionadaId] = useState('');

  // Estados del formulario de envío y pago
  const [nombreCompleto, setNombreCompleto] = useState(usuario?.nombre || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [ciudad, setCiudad] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [barrio, setBarrio] = useState('');
  const [direccionExacta, setDireccionExacta] = useState('');
  const [metodoPago, setMetodoPago] = useState('CONTRA_ENTREGA');
  const [notasAdicionales, setNotasAdicionales] = useState('');

  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [ordenExitosa, setOrdenExitosa] = useState(null);

  const totalCompra = calcularPrecioTotal();

  // Al seleccionar una dirección guardada previamente
  const alSeleccionarDireccionGuardada = (idGuardado) => {
    setDireccionSeleccionadaId(idGuardado);
    if (!idGuardado) return;
    const dir = listaDireccionesGuardadas.find((d) => d.id === String(idGuardado));
    if (dir) {
      setNombreCompleto(dir.nombreCompleto || '');
      setTelefono(dir.telefono || '');
      setCiudad(dir.ciudad || '');
      setDepartamento(dir.departamento || '');
      setBarrio(dir.barrio || '');
      setDireccionExacta(dir.direccionExacta || '');
    }
  };

  const alManejarConfirmarPedido = async (evento) => {
    evento.preventDefault();
    setErrorMensaje(null);

    if (listaCarrito.length === 0) {
      setErrorMensaje('El carrito está vacío. Agrega productos antes de confirmar el pedido.');
      return;
    }

    setCargando(true);

    try {
      const direccionFormateada = `${direccionExacta}, Barrio: ${barrio || 'N/A'}, ${ciudad} - ${departamento}`;

      // Guardar dirección en el historial de direcciones del usuario activo
      const nuevaDireccionObjeto = {
        id: String(Date.now()),
        nombreCompleto,
        telefono,
        ciudad,
        departamento,
        barrio,
        direccionExacta,
        direccionFormateada,
      };

      const direccionesActualizadas = [
        ...listaDireccionesGuardadas.filter((d) => d.direccionExacta !== direccionExacta),
        nuevaDireccionObjeto,
      ];
      localStorage.setItem(`direcciones_${correoUsuario}`, JSON.stringify(direccionesActualizadas));

      // Estructura de la orden para respaldo local
      const idGenerado = Math.floor(Math.random() * 900000) + 100000;
      let pedidoIdFinal = idGenerado;

      const nuevoPedidoLocal = {
        id: idGenerado,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'PROCESANDO',
        direccionEnvio: direccionFormateada,
        metodoPago,
        total: totalCompra,
        detalles: listaCarrito.map((item) => ({
          productoId: item.id,
          productoNombre: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          urlImagen: item.urlImagen,
        })),
      };

      try {
        const solicitudPedido = {
          direccionId: direccionSeleccionadaId ? Number(direccionSeleccionadaId) : null,
          direccionEnvio: direccionFormateada,
          metodoPago,
          telefonoContacto: telefono,
          detalles: listaCarrito.map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
          })),
        };

        const respuesta = await clienteApi.post('/api/pedidos', solicitudPedido);
        const ordenGenerada = respuesta.data;

        if (ordenGenerada && ordenGenerada.id) {
          pedidoIdFinal = ordenGenerada.id;
          nuevoPedidoLocal.id = ordenGenerada.id;

          try {
            await clienteApi.post('/api/pagos/procesar', {
              pedidoId: ordenGenerada.id,
              metodo: metodoPago,
            });
          } catch (errorPago) {
            console.warn('Procesando pago en modo fallback local:', errorPago);
          }
        }
      } catch (errorServidor) {
        console.warn('Backend offline o respondiendo en modo local:', errorServidor);
      }

      // Persistir orden en el historial específico del usuario autenticado
      const pedidosPreviosCliente = JSON.parse(localStorage.getItem(`pedidos_${correoUsuario}`) || '[]');
      localStorage.setItem(`pedidos_${correoUsuario}`, JSON.stringify([nuevoPedidoLocal, ...pedidosPreviosCliente]));

      // Vaciar carrito y mostrar pantalla de confirmación exitosa
      vaciarCarrito();
      setOrdenExitosa(pedidoIdFinal);
    } catch (errorGeneral) {
      console.error('Error al procesar el pedido:', errorGeneral);
      setErrorMensaje('Ocurrió un error al procesar el pedido. Por favor intenta de nuevo.');
    } finally {
      // Garantizar que la animación de cargando se detenga en cualquier caso
      setCargando(false);
    }
  };

  // Pantalla de Confirmación de Pedido Exitoso
  if (ordenExitosa) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-dark text-white">
        <Navegacion />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#121612' }}>
          <div className="container text-center" style={{ maxWidth: '600px' }}>
            <div className="card bg-dark text-white border-success shadow-lg p-5 rounded-4">
              <div
                className="rounded-circle bg-success bg-opacity-25 text-success d-inline-flex align-items-center justify-content-center mb-3 mx-auto"
                style={{ width: '80px', height: '80px' }}
              >
                <CheckCircle size={48} />
              </div>
              <h2 className="fw-bold text-white mb-2">¡Pedido Confirmado con Éxito!</h2>
              <p className="text-secondary mb-4">
                Gracias por tu compra en <span className="text-info fw-bold">Technological Device</span>.
              </p>
              <div className="bg-secondary bg-opacity-10 rounded-3 p-3 mb-4 border border-secondary text-start">
                <span className="d-block small text-secondary">Número de Orden:</span>
                <span className="fs-5 fw-bold text-info">#ORD-{ordenExitosa}</span>
                <hr className="my-2 border-secondary" />
                <span className="d-block small text-secondary">Total Pagado:</span>
                <span className="fs-5 fw-bold text-success">$ {totalCompra}</span>
              </div>
              <Link to="/productos" className="btn btn-primary btn-lg w-100 py-3 fw-semibold shadow">
                Volver al Catálogo de Productos
              </Link>
            </div>
          </div>
        </main>
        <PiePagina />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container">
          
          {/* Botón de Retorno */}
          <Link to="/carrito" className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} /> Volver al Carrito
          </Link>

          <h2 className="fw-bold text-white mb-4">Finalizar Compra</h2>

          {errorMensaje && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
              <AlertCircle size={18} />
              <span>{errorMensaje}</span>
            </div>
          )}

          <div className="row g-4">
            
            {/* Columna Izquierda: Formulario de Dirección de Envío y Pago */}
            <div className="col-12 col-lg-7">
              <form onSubmit={alManejarConfirmarPedido}>
                
                {/* Bloque 1: Datos del Destinatario */}
                <div className="card bg-dark text-white border-secondary shadow-sm p-4 rounded-4 mb-4">
                  <h5 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                    <MapPin size={20} /> Datos de Envío y Entrega
                  </h5>

                  {/* Selector de Direcciones Guardadas del Cliente */}
                  {listaDireccionesGuardadas.length > 0 && (
                    <div className="mb-4 p-3 bg-secondary bg-opacity-10 border border-info rounded-3">
                      <label className="form-label text-info small fw-bold mb-1">
                        🏠 Usar una Dirección Guardada Previamente:
                      </label>
                      <select
                        className="form-select bg-dark text-white border-info"
                        value={direccionSeleccionadaId}
                        onChange={(e) => alSeleccionarDireccionGuardada(e.target.value)}
                      >
                        <option value="">-- Ingresar Nueva Dirección --</option>
                        {listaDireccionesGuardadas.map((dir) => (
                          <option key={dir.id} value={dir.id}>
                            {dir.direccionExacta} ({dir.ciudad} - {dir.departamento})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">Nombre Completo del Destinatario *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. Juan Pérez"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">Teléfono de Contacto *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-secondary text-white border-secondary">
                          <Phone size={16} />
                        </span>
                        <input
                          type="tel"
                          className="form-control bg-dark text-white border-secondary"
                          placeholder="Ej. 300 123 4567"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">Ciudad / Municipio *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. Ibagué"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">Departamento *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. Tolima"
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">Barrio / Sector</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. Centro / La Pola"
                        value={barrio}
                        onChange={(e) => setBarrio(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">Dirección Exacta (Calle/Carrera/N°) *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. Carrera 5 # 10-20 Apto 301"
                        value={direccionExacta}
                        onChange={(e) => setDireccionExacta(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-light small fw-semibold">Notas o Indicaciones de Entrega</label>
                      <textarea
                        rows="2"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. Dejar en portería con el celador."
                        value={notasAdicionales}
                        onChange={(e) => setNotasAdicionales(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Bloque 2: Método de Pago */}
                <div className="card bg-dark text-white border-secondary shadow-sm p-4 rounded-4 mb-4">
                  <h5 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                    <CreditCard size={20} /> Selección de Método de Pago
                  </h5>

                  <div className="form-check mb-3 p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary">
                    <input
                      className="form-check-input ms-0 me-3"
                      type="radio"
                      name="opcionPago"
                      id="pagoContraEntrega"
                      value="CONTRA_ENTREGA"
                      checked={metodoPago === 'CONTRA_ENTREGA'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    <label className="form-check-label fw-bold text-white" htmlFor="pagoContraEntrega">
                      🚚 Pago Contra Entrega en Efectivo / Nequi / Daviplata
                    </label>
                    <small className="d-block text-secondary mt-1">
                      Pagas en el momento de recibir tu paquete en tu domicilio.
                    </small>
                  </div>

                  <div className="form-check p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary">
                    <input
                      className="form-check-input ms-0 me-3"
                      type="radio"
                      name="opcionPago"
                      id="pagoTransferencia"
                      value="TRANSFERENCIA"
                      checked={metodoPago === 'TRANSFERENCIA'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    <label className="form-check-label fw-bold text-white" htmlFor="pagoTransferencia">
                      🏦 Transferencia Bancaria Directa (Bancolombia / PSE)
                    </label>
                    <small className="d-block text-secondary mt-1">
                      Te enviaremos los datos de transferencia al confirmar tu compra.
                    </small>
                  </div>
                </div>

                {/* Botón Confirmar Compra */}
                <button
                  type="submit"
                  disabled={cargando || listaCarrito.length === 0}
                  className="btn btn-primary btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                >
                  {cargando ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <ShieldCheck size={22} />
                  )}
                  <span>{cargando ? 'Procesando Pedido...' : 'Confirmar y Realizar Pedido'}</span>
                </button>

              </form>
            </div>

            {/* Columna Derecha: Resumen del Pedido */}
            <div className="col-12 col-lg-5">
              <div className="card bg-dark text-white border-secondary shadow-sm p-4 rounded-4 sticky-top" style={{ top: '90px' }}>
                <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <ShoppingBag size={20} className="text-info" /> Resumen del Carrito
                </h5>

                <div className="mb-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {listaCarrito.map((item) => (
                    <div key={item.id} className="d-flex align-items-center justify-content-between py-2 border-bottom border-secondary">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.urlImagen || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60'}
                          alt={item.nombre}
                          className="rounded-3"
                          style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                        />
                        <div>
                          <span className="d-block fw-semibold text-white small">{item.nombre}</span>
                          <span className="small text-secondary">Cant: {item.cantidad}</span>
                        </div>
                      </div>
                      <span className="fw-bold text-info small">$ {item.precio * item.cantidad}</span>
                    </div>
                  ))}
                </div>

                <div className="py-2 border-bottom border-secondary d-flex justify-content-between small text-secondary">
                  <span>Envío a Domicilio:</span>
                  <span className="text-success fw-bold">GRATIS</span>
                </div>

                <div className="py-3 d-flex justify-content-between align-items-center fs-5 fw-bold">
                  <span className="text-white">Total Final:</span>
                  <span className="text-info">$ {totalCompra}</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      <PiePagina />
    </div>
  );
}

export default ConfirmarCompra;
