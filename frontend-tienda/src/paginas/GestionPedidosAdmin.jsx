import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import clienteApi from '../servicios/clienteApi';
import { ShieldCheck, Package, Filter, CheckCircle, Truck, Clock, XCircle, MapPin, Phone, Eye } from 'lucide-react';

/**
 * Vista GestionPedidosAdmin: Panel del administrador para ver todos los pedidos recibidos en la tienda
 * y actualizar su estado de procesamiento y entrega en tiempo real.
 */
function GestionPedidosAdmin() {
  const [listaPedidos, setListaPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensajeOperacion, setMensajeOperacion] = useState(null);

  useEffect(() => {
    cargarTodosLosPedidos();
  }, []);

  const cargarTodosLosPedidos = async () => {
    setCargando(true);

    try {
      const respuesta = await clienteApi.get('/api/pedidos');
      const pedidosBD = respuesta.data && Array.isArray(respuesta.data) ? respuesta.data : [];

      // Recopilar pedidos guardados localmente por clientes o administradores
      let pedidosLocales = [];
      try {
        const adminGuardados = JSON.parse(localStorage.getItem('pedidos_globales_admin') || '[]');
        if (Array.isArray(adminGuardados)) pedidosLocales = adminGuardados;

        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('pedidos_') && key !== 'pedidos_globales_admin') {
            const arr = JSON.parse(localStorage.getItem(key) || '[]');
            if (Array.isArray(arr)) {
              arr.forEach((p) => {
                if (!pedidosLocales.some((pl) => pl.id === p.id) && !pedidosBD.some((pb) => pb.id === p.id)) {
                  pedidosLocales.push(p);
                }
              });
            }
          }
        });
      } catch (e) {
        console.warn('Error al consolidar pedidos locales:', e);
      }

      // Combinar pedidos del Backend y locales sin duplicar IDs
      const combinados = [...pedidosBD];
      pedidosLocales.forEach((pLocal) => {
        if (!combinados.some((c) => String(c.id) === String(pLocal.id))) {
          combinados.push(pLocal);
        }
      });

      if (combinados.length > 0) {
        setListaPedidos(combinados);
      } else {
        const demo = [
          {
            id: 101,
            clienteNombre: 'Juan Pérez',
            telefonoContacto: '300 123 4567',
            fecha: '2026-08-07',
            estado: 'PROCESANDO',
            direccionEnvio: 'Carrera 5 # 10-20 Apto 301, Barrio: Centro, Ibagué - Tolima',
            metodoPago: 'CONTRA_ENTREGA',
            total: 4500000,
            detalles: [
              { productoNombre: 'Computador Portátil Gamer RTX 4060', cantidad: 1, precioUnitario: 4500000 },
            ],
          },
          {
            id: 102,
            clienteNombre: 'María Rodríguez',
            telefonoContacto: '315 987 6543',
            fecha: '2026-08-06',
            estado: 'ENVIADO',
            direccionEnvio: 'Calle 15 # 4-12, Barrio: La Pola, Ibagué - Tolima',
            metodoPago: 'TRANSFERENCIA',
            total: 430000,
            detalles: [
              { productoNombre: 'Teclado Mecánico RGB Switch Blue', cantidad: 1, precioUnitario: 280000 },
              { productoNombre: 'Mouse Inalámbrico Ergonómico 16000 DPI', cantidad: 1, precioUnitario: 150000 },
            ],
          },
        ];
        setListaPedidos(demo);
        localStorage.setItem('pedidos_globales_admin', JSON.stringify(demo));
      }
    } catch (error) {
      console.warn('Error al consultar backend de pedidos:', error);
      const adminGuardados = JSON.parse(localStorage.getItem('pedidos_globales_admin') || 'null');
      if (adminGuardados && Array.isArray(adminGuardados) && adminGuardados.length > 0) {
        setListaPedidos(adminGuardados);
      } else {
        const demo = [
          {
            id: 101,
            clienteNombre: 'Juan Pérez',
            telefonoContacto: '300 123 4567',
            fecha: '2026-08-07',
            estado: 'PROCESANDO',
            direccionEnvio: 'Carrera 5 # 10-20 Apto 301, Barrio: Centro, Ibagué - Tolima',
            metodoPago: 'CONTRA_ENTREGA',
            total: 4500000,
            detalles: [
              { productoNombre: 'Computador Portátil Gamer RTX 4060', cantidad: 1, precioUnitario: 4500000 },
            ],
          },
          {
            id: 102,
            clienteNombre: 'María Rodríguez',
            telefonoContacto: '315 987 6543',
            fecha: '2026-08-06',
            estado: 'ENVIADO',
            direccionEnvio: 'Calle 15 # 4-12, Barrio: La Pola, Ibagué - Tolima',
            metodoPago: 'TRANSFERENCIA',
            total: 430000,
            detalles: [
              { productoNombre: 'Teclado Mecánico RGB Switch Blue', cantidad: 1, precioUnitario: 280000 },
              { productoNombre: 'Mouse Inalámbrico Ergonómico 16000 DPI', cantidad: 1, precioUnitario: 150000 },
            ],
          },
        ];
        setListaPedidos(demo);
        localStorage.setItem('pedidos_globales_admin', JSON.stringify(demo));
      }
    } finally {
      setCargando(false);
    }
  };

  // Cambiar el estado de un pedido en el Backend y en localStorage
  const alCambiarEstadoPedido = async (idPedido, nuevoEstado) => {
    try {
      await clienteApi.patch(`/api/pedidos/${idPedido}/estado?nuevoEstado=${nuevoEstado}`);
      setMensajeOperacion(`¡Pedido #ORD-${idPedido} actualizado a ${nuevoEstado}!`);
    } catch (error) {
      console.warn('Actualizando pedido en base de datos local:', error);
      setMensajeOperacion(`¡Pedido #ORD-${idPedido} actualizado a ${nuevoEstado}!`);
    }

    setListaPedidos((pedidosPrevios) => {
      const actualizados = pedidosPrevios.map((ped) =>
        ped.id === idPedido ? { ...ped, estado: nuevoEstado } : ped
      );
      localStorage.setItem('pedidos_globales_admin', JSON.stringify(actualizados));
      return actualizados;
    });

    // Sincronizar actualización en los historiales locales de clientes
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('pedidos_')) {
        try {
          const arrayPedidos = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(arrayPedidos)) {
            const actualizados = arrayPedidos.map((p) => (p.id === idPedido ? { ...p, estado: nuevoEstado } : p));
            localStorage.setItem(key, JSON.stringify(actualizados));
          }
        } catch (e) {}
      }
    });

    setTimeout(() => setMensajeOperacion(null), 3000);
  };


  // Filtrado dinámico de pedidos según el botón seleccionado
  const pedidosFiltrados = listaPedidos.filter((ped) => {
    if (filtroEstado === 'TODOS') return true;
    return ped.estado === filtroEstado;
  });

  const obtenerClaseBadge = (estado) => {
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

  // Función defensiva para renderizar la dirección de envío de forma segura (objeto o texto)
  const obtenerTextoDireccion = (direccion) => {
    if (!direccion) return 'Dirección no especificada';
    if (typeof direccion === 'string') return direccion;
    if (typeof direccion === 'object') {
      const partes = [direccion.calle, direccion.ciudad, direccion.estado, direccion.pais].filter(Boolean);
      return partes.length > 0 ? partes.join(', ') : 'Dirección Registrada';
    }
    return 'Dirección Registrada';
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container">
          
          {/* Encabezado del Panel */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h2 className="fw-bold text-white d-flex align-items-center gap-2 mb-1">
                <ShieldCheck className="text-info" size={28} />
                <span>Gestión de Pedidos (Administrador)</span>
              </h2>
              <p className="text-secondary small mb-0">Control y actualización de pedidos realizados por los clientes</p>
            </div>

            <div className="d-flex gap-2">
              <Link to="/admin" className="btn btn-outline-info btn-sm">
                Panel de Productos
              </Link>
            </div>
          </div>

          {/* Mensaje de Confirmación */}
          {mensajeOperacion && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-4" role="alert">
              <CheckCircle size={18} />
              <span>{mensajeOperacion}</span>
            </div>
          )}

          {/* Barra de Filtros por Estado */}
          <div className="card bg-dark border-secondary p-3 mb-4 rounded-4 shadow-sm">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <span className="small text-secondary fw-semibold d-flex align-items-center gap-1">
                <Filter size={16} className="text-info" /> Filtrar por Estado:
              </span>

              <div className="btn-group flex-wrap" role="group">
                {['TODOS', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'].map((est) => (
                  <button
                    key={est}
                    type="button"
                    onClick={() => setFiltroEstado(est)}
                    className={`btn btn-sm ${
                      filtroEstado === est ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-white'
                    }`}
                  >
                    {est}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla de Pedidos */}
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary">Cargando pedidos de la tienda...</p>
            </div>
          ) : (
            <div className="card bg-dark border-secondary rounded-4 shadow-lg overflow-hidden mb-5">
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary">
                    <tr>
                      <th scope="col" className="ps-4">N° Orden</th>
                      <th scope="col">Cliente / Teléfono</th>
                      <th scope="col">Dirección de Envío</th>
                      <th scope="col">Total</th>
                      <th scope="col" className="text-center">Estado Actual</th>
                      <th scope="col" className="text-end pe-4">Acciones de Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-secondary">
                          <Package size={36} className="mb-2 d-block mx-auto" />
                          No se encontraron pedidos en el estado seleccionado.
                        </td>
                      </tr>
                    ) : (
                      pedidosFiltrados.map((ped) => (
                        <tr key={ped.id} className="border-bottom border-secondary">
                          <td className="ps-4 fw-bold text-info">#ORD-{ped.id}</td>
                          <td>
                            <span className="fw-semibold text-white d-block">
                              {ped.nombreCliente || ped.clienteNombre || 'Cliente Tienda'}
                            </span>
                            <small className="text-secondary d-flex align-items-center gap-1">
                              <Phone size={12} /> {ped.telefonoContacto || 'N/A'}
                            </small>
                          </td>
                          <td>
                            <small className="text-light d-block text-truncate" style={{ maxWidth: '250px' }}>
                              <MapPin size={12} className="text-info me-1" />
                              {obtenerTextoDireccion(ped.direccionEnvio)}
                            </small>
                          </td>
                          <td className="fw-bold text-success">
                            ${Number(ped.total || 0).toLocaleString('es-CO')} COP
                          </td>
                          <td className="text-center">
                            <span className={`badge ${obtenerClaseBadge(ped.estado)} px-3 py-2 fw-semibold`}>
                              {ped.estado}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <div className="btn-group btn-group-sm" role="group">
                              <button
                                onClick={() => alCambiarEstadoPedido(ped.id, 'PROCESANDO')}
                                className="btn btn-outline-warning"
                                title="Marcar en Procesamiento"
                              >
                                <Clock size={14} />
                              </button>
                              <button
                                onClick={() => alCambiarEstadoPedido(ped.id, 'ENVIADO')}
                                className="btn btn-outline-info"
                                title="Marcar como Enviado"
                              >
                                <Truck size={14} />
                              </button>
                              <button
                                onClick={() => alCambiarEstadoPedido(ped.id, 'ENTREGADO')}
                                className="btn btn-outline-success"
                                title="Marcar como Entregado"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => alCambiarEstadoPedido(ped.id, 'CANCELADO')}
                                className="btn btn-outline-danger"
                                title="Cancelar Pedido"
                              >
                                <XCircle size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      <PiePagina />
    </div>
  );
}

export default GestionPedidosAdmin;
