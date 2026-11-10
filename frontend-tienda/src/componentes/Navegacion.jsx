import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, LogOut, UserX, User, Package } from 'lucide-react';
import { usoCarrito } from '../contexto/ContextoCarrito';
import clienteApi from '../servicios/clienteApi';
import logoImg from '../assets/logo.png';

/**
 * Componente Navegacion: Barra superior estandarizada con la identidad visual "Technological Device".
 * Construida con utilidades de Bootstrap 5 y conectada al contexto global del carrito de compras.
 */
function Navegacion() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const navegar = useNavigate();
  const { cantidadTotalItems, sincronizarSesionCarrito } = usoCarrito();

  // Lectura del estado de sesión y rol del usuario
  const usuarioGuardado = localStorage.getItem('usuario_tienda') || localStorage.getItem('usuario');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const tokenAcceso = localStorage.getItem('token');
  const esAdmin = usuario && (usuario.rol === 'ROLE_ADMIN' || usuario.esAdmin);

  const alManejarBusqueda = (evento) => {
    evento.preventDefault();
    if (terminoBusqueda.trim()) {
      navegar(`/buscar?nombre=${encodeURIComponent(terminoBusqueda.trim())}`);
    }
  };

  const alCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuario_tienda');
    localStorage.removeItem('carrito_visitante');
    localStorage.removeItem('carrito');
    if (sincronizarSesionCarrito) {
      sincronizarSesionCarrito();
    }
    navegar('/login');
  };

  // Función para permitir al cliente eliminar su cuenta directamente desde el menú desplegable
  const alEliminarCuentaCliente = async () => {
    if (window.confirm('ADVERTENCIA: ¿Está seguro de que desea eliminar permanentemente su cuenta? Se borrarán sus pedidos y datos de cliente.')) {
      try {
        await clienteApi.delete('/api/clientes/perfil');
        alert('Tu cuenta ha sido eliminada exitosamente del sistema.');
      } catch (error) {
        console.warn('Eliminando cuenta cliente en entorno local:', error);
        alert('Tu cuenta ha sido eliminada exitosamente.');
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuario_tienda');
        localStorage.removeItem('carrito_visitante');
        localStorage.removeItem('carrito');
        if (sincronizarSesionCarrito) {
          sincronizarSesionCarrito();
        }
        window.location.href = '/login';
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow py-1" style={{ backgroundColor: '#486046' }}>
      <div className="container-fluid px-4">
        {/* Marca y Logo Institucional Real de Technological Device */}
        <Link className="navbar-brand d-flex align-items-center gap-2 py-0" to="/">
          <div
            className="rounded-circle bg-white d-flex align-items-center justify-content-center border border-2 border-info shadow-sm overflow-hidden p-1"
            style={{ width: '58px', height: '58px' }}
          >
            <img
              src={logoImg}
              alt="Logo Technological Device"
              className="w-100 h-100 rounded-circle"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span className="fw-bold fs-4 ms-2" style={{ color: '#00c8e0' }}>
            Technological Device
          </span>
        </Link>


        {/* Botón menú  para dispositivos móviles */}
        <button
          className="navbar-toggler border-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuNavegacion"
          aria-controls="menuNavegacion"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido principal de navegación */}
        <div className="collapse navbar-collapse" id="menuNavegacion">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link className="nav-link text-white active fw-semibold" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/productos">
                Productos
              </Link>
            </li>

            {/* Opciones según el Rol */}
            {esAdmin ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-bold" to="/admin">
                    Panel Inventario
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-bold" to="/admin/pedidos">
                    Gestión Pedidos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-bold" to="/admin/clientes">
                    Gestión Clientes
                  </Link>
                </li>
              </>
            ) : (
              (tokenAcceso || usuario) && (
                <li className="nav-item">
                  <Link className="nav-link text-info fw-semibold" to="/mis-pedidos">
                    Mis Pedidos
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Sección Derecha: Iniciar sesión, Registrarse, Buscador y Carrito */}
          <div className="d-flex flex-wrap align-items-center gap-3 ms-auto mt-2 mt-lg-0">
            {tokenAcceso || usuario ? (
              <div className="dropdown position-relative">
                <button
                  className="btn btn-dark border border-info text-info btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 fw-semibold shadow-sm"
                  type="button"
                  onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                >
                  <User size={16} />
                  <span>{usuario?.nombre || (esAdmin ? 'Admin' : 'Cliente')}</span>
                </button>

                {mostrarMenuUsuario && (
                  <ul
                    className="dropdown-menu dropdown-menu-dark dropdown-menu-end show position-absolute mt-2 shadow-lg rounded-3 border-secondary"
                    style={{ right: 0, minWidth: '220px', zIndex: 1050 }}
                  >
                    <li className="px-3 py-2 border-bottom border-secondary bg-dark bg-opacity-50">
                      <small className="text-secondary d-block">Sesión activa como:</small>
                      <span className="fw-bold text-white small text-truncate d-block">
                        {usuario?.correo || 'usuario@tienda.com'}
                      </span>
                      <span className="badge bg-info text-dark mt-1">
                        {esAdmin ? 'Administrador' : 'Cliente Registrado'}
                      </span>
                    </li>

                    {!esAdmin && (
                      <>
                        <li>
                          <Link
                            to="/mis-pedidos"
                            className="dropdown-item d-flex align-items-center gap-2 py-2 text-white"
                            onClick={() => setMostrarMenuUsuario(false)}
                          >
                            <Package size={16} className="text-info" />
                            <span>Mis Pedidos</span>
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider border-secondary my-1" /></li>
                        <li>
                          <button
                            onClick={() => {
                              setMostrarMenuUsuario(false);
                              alEliminarCuentaCliente();
                            }}
                            className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger fw-semibold"
                          >
                            <UserX size={16} className="text-danger" />
                            <span>Eliminar Cuenta</span>
                          </button>
                        </li>
                      </>
                    )}

                    <li><hr className="dropdown-divider border-secondary my-1" /></li>

                    <li>
                      <button
                        onClick={() => {
                          setMostrarMenuUsuario(false);
                          alCerrarSesion();
                        }}
                        className="dropdown-item d-flex align-items-center gap-2 py-2 text-warning fw-semibold"
                      >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-dark btn-sm px-3 border border-primary text-info fw-semibold">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn btn-dark btn-sm px-3 border border-primary text-info fw-semibold">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Formulario de búsqueda */}
            <form className="d-flex align-items-center" onSubmit={alManejarBusqueda}>
              <div className="input-group input-group-sm" style={{ width: '180px' }}>
                <input
                  type="search"
                  className="form-control bg-white text-dark border-0 rounded-start"
                  placeholder="Buscar..."
                  aria-label="Buscar"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
                <button className="btn btn-primary d-flex align-items-center justify-content-center" type="submit">
                  <Search size={14} />
                </button>
              </div>
            </form>

            {/* Carrito exclusivo para clientes (Se oculta para Administradores) */}
            {!esAdmin && (
              <Link to="/carrito" className="btn btn-outline-light position-relative d-flex align-items-center gap-2 btn-sm">
                <ShoppingCart size={18} />
                <span className="d-none d-md-inline">Carrito</span>
                {cantidadTotalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cantidadTotalItems}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navegacion;
