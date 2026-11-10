import { Navigate } from 'react-router-dom';
import Navegacion from './Navegacion';
import PiePagina from './PiePagina';
import { ShieldAlert, LogIn, LayoutDashboard } from 'lucide-react';

/**
 * Componente RutaProtegida: Envoltorio de seguridad para React Router DOM.
 * Verifica si el usuario ha iniciado sesión y si posee el rol requerido (ROLE_CLIENTE o ROLE_ADMIN).
 * 
 * @param {Object} props
 * @param {JSX.Element} props.children - Vista a renderizar si se cumplen los permisos.
 * @param {string} props.rolRequerido - Rol necesario ('ROLE_CLIENTE' o 'ROLE_ADMIN').
 */
function RutaProtegida({ children, rolRequerido }) {
  // Obtener información del usuario almacenada tras el login
  const usuarioGuardado = localStorage.getItem('usuario_tienda');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  // 1. Caso: Usuario no autenticado ➔ Redirigir a Login
  if (!usuario) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-dark text-white">
        <Navegacion />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#121612' }}>
          <div className="container text-center" style={{ maxWidth: '500px' }}>
            <div className="card bg-dark text-white border-warning shadow-lg p-5 rounded-4">
              <div
                className="rounded-circle bg-warning bg-opacity-25 text-warning d-inline-flex align-items-center justify-content-center mb-3 mx-auto"
                style={{ width: '70px', height: '70px' }}
              >
                <LogIn size={36} />
              </div>
              <h4 className="fw-bold text-white mb-2">Inicio de Sesión Requerido</h4>
              <p className="text-secondary small mb-4">
                Para realizar compras en <span className="text-info">Technological Device</span> debes iniciar sesión con tu cuenta de cliente.
              </p>
              <Navigate to="/login" replace />
            </div>
          </div>
        </main>
        <PiePagina />
      </div>
    );
  }

  // 2. Caso: Es Administrador e intenta acceder a rutas exclusivas de Cliente
  if (rolRequerido === 'ROLE_CLIENTE' && (usuario.rol === 'ROLE_ADMIN' || usuario.esAdmin)) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-dark text-white">
        <Navegacion />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#121612' }}>
          <div className="container text-center" style={{ maxWidth: '550px' }}>
            <div className="card bg-dark text-white border-info shadow-lg p-5 rounded-4">
              <div
                className="rounded-circle bg-info bg-opacity-25 text-info d-inline-flex align-items-center justify-content-center mb-3 mx-auto"
                style={{ width: '70px', height: '70px' }}
              >
                <ShieldAlert size={36} />
              </div>
              <h4 className="fw-bold text-white mb-2">Modo Administrador Activo</h4>
              <p className="text-secondary small mb-4">
                Las cuentas de administración están destinadas a la gestión de inventario y pedidos. No pueden realizar compras como cliente retail .
              </p>
              <a href="/admin" className="btn btn-info btn-lg w-100 py-3 fw-bold text-dark d-flex align-items-center justify-content-center gap-2 shadow">
                <LayoutDashboard size={20} />
                <span>Ir al Panel de Administración</span>
              </a>
            </div>
          </div>
        </main>
        <PiePagina />
      </div>
    );
  }

  // 3. Caso: Intenta acceder a Panel Admin sin ser Administrador
  if (rolRequerido === 'ROLE_ADMIN' && usuario.rol !== 'ROLE_ADMIN' && !usuario.esAdmin) {
    return <Navigate to="/productos" replace />;
  }

  // Permiso concedido ➔ Renderizar vista protegida
  return children;
}

export default RutaProtegida;
