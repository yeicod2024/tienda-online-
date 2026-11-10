import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import clienteApi from '../servicios/clienteApi';
import { Users, Mail, Phone, Calendar, Search, ShieldCheck, UserCheck } from 'lucide-react';

/**
 * Vista GestionClientesAdmin: Panel del administrador para ver y gestionar la lista de clientes registrados.
 */
function GestionClientesAdmin() {
  const [listaClientes, setListaClientes] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarClientesRegistrados();
  }, []);

  const cargarClientesRegistrados = async () => {
    setCargando(true);
    try {
      const respuesta = await clienteApi.get('/api/clientes');
      const clientesBD = respuesta.data && Array.isArray(respuesta.data) ? respuesta.data : [];

      // Consolidar usuarios clientes guardados localmente para resiliencia
      let clientesLocales = [];
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('usuario_') || key === 'usuario_tienda' || key === 'usuario') {
            const u = JSON.parse(localStorage.getItem(key) || 'null');
            if (u && u.correo && (u.rol === 'ROLE_CLIENTE' || (!u.esAdmin && u.rol !== 'ROLE_ADMIN'))) {
              if (!clientesBD.some((c) => c.correo === u.correo) && !clientesLocales.some((cl) => cl.correo === u.correo)) {
                clientesLocales.push({
                  id: u.id || Date.now(),
                  nombre: u.nombre || u.correo.split('@')[0],
                  apellido: u.apellido || 'Cliente',
                  nombreCompleto: u.nombre ? `${u.nombre} ${u.apellido || ''}`.trim() : u.correo.split('@')[0],
                  correo: u.correo,
                  telefono: u.telefono || 'N/A',
                  comprasRealizadas: 0,
                });
              }
            }
          }
        });
      } catch (e) {
        console.warn('Error al consolidar usuarios locales:', e);
      }

      setListaClientes([...clientesBD, ...clientesLocales]);
    } catch (error) {
      console.error('Error al cargar clientes desde el servidor:', error);
      setListaClientes([]);
    } finally {
      setCargando(false);
    }
  };

  // Filtrado de clientes por nombre o correo electrónico
  const clientesFiltrados = listaClientes.filter((cliente) => {
    const nombreCompleto = cliente.nombreCompleto || `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim() || 'Cliente';
    const correo = cliente.correo || '';
    const termino = filtroTexto.toLowerCase();
    return nombreCompleto.toLowerCase().includes(termino) || correo.toLowerCase().includes(termino);
  });

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container">

          {/* Encabezado del Panel */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h2 className="fw-bold text-white d-flex align-items-center gap-2 mb-1">
                <Users className="text-info" size={28} />
                <span>Gestión de Clientes</span>
              </h2>
              <p className="text-secondary small mb-0">Directorio de usuarios registrados en Technological Device</p>
            </div>

            <div className="d-flex gap-2">
              <Link to="/admin" className="btn btn-outline-info btn-sm">
                Panel Inventario
              </Link>
              <Link to="/admin/pedidos" className="btn btn-outline-warning btn-sm">
                Gestión Pedidos
              </Link>
            </div>
          </div>

          {/* Buscador de Clientes */}
          <div className="card bg-dark border-secondary p-3 mb-4 rounded-4 shadow-sm">
            <div className="input-group">
              <span className="input-group-text bg-secondary text-white border-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Buscar cliente por nombre o correo..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de Clientes */}
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary">Cargando directorio de clientes...</p>
            </div>
          ) : (
            <div className="card bg-dark border-secondary rounded-4 shadow-lg overflow-hidden mb-5">
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary">
                    <tr>
                      <th scope="col" className="ps-4">ID</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Correo Electrónico</th>
                      <th scope="col">Teléfono</th>
                      <th scope="col" className="text-center">Compras</th>
                      <th scope="col" className="text-end pe-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-secondary">
                          <UserCheck size={36} className="mb-2 d-block mx-auto" />
                          No se encontraron clientes registrados con esa búsqueda.
                        </td>
                      </tr>
                    ) : (
                      clientesFiltrados.map((cli) => (
                        <tr key={cli.id} className="border-bottom border-secondary">
                          <td className="ps-4 fw-bold text-info">#{cli.id}</td>
                          <td>
                            <span className="fw-semibold text-white d-block">
                              {cli.nombreCompleto || `${cli.nombre || ''} ${cli.apellido || ''}`.trim() || 'Cliente'}
                            </span>
                            <small className="text-secondary">Cliente Registrado</small>
                          </td>
                          <td>
                            <span className="text-light d-flex align-items-center gap-1">
                              <Mail size={14} className="text-info" /> {cli.correoUsuario}
                            </span>
                          </td>
                          <td>
                            <span className="text-secondary d-flex align-items-center gap-1">
                              <Phone size={14} /> {cli.telefono}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary px-3 py-2 fw-bold">
                              {cli.pedidosRealizados || 0} pedidos
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <span className="badge bg-success px-3 py-2 fw-semibold">
                              ACTIVO
                            </span>
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

export default GestionClientesAdmin;
