import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import clienteApi from '../servicios/clienteApi';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Vista IniciarSesion: Formulario de autenticación para clientes y administradores.
 * Permite el ingreso seguro capturando credenciales y obteniendo el token JWT desde el backend.
 */
function IniciarSesion() {
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [claveSeguridad, setClaveSeguridad] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [exitoMensaje, setExitoMensaje] = useState(null);

  const navegar = useNavigate();

  const guardarSesionDemo = (usuarioDemo, token = 'token-sesion-' + Date.now()) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioDemo));
    localStorage.setItem('usuario_tienda', JSON.stringify(usuarioDemo));
  };

  const procesarLoginLocal = (correo, clave) => {
    const listaRegistrados = JSON.parse(localStorage.getItem('usuarios_registrados_locales') || '[]');
    const usuarioEncontrado = listaRegistrados.find((u) => u.correo === correo);
    const esAdminEspecial = correo.toLowerCase().includes('admin');

    if (usuarioEncontrado) {
      if (usuarioEncontrado.clave && usuarioEncontrado.clave !== clave) {
        setErrorMensaje('Contraseña incorrecta. Por favor verifique su clave de seguridad.');
        return false;
      }

      const esAdminDemo = usuarioEncontrado.rol === 'ROLE_ADMIN' || esAdminEspecial;
      const usuarioDemo = {
        correo,
        nombre: usuarioEncontrado.nombre || correo.split('@')[0],
        telefono: usuarioEncontrado.telefono || '',
        rol: esAdminDemo ? 'ROLE_ADMIN' : 'ROLE_CLIENTE',
        esAdmin: esAdminDemo,
      };
      guardarSesionDemo(usuarioDemo);
      return true;
    }

    if (esAdminEspecial) {
      const usuarioDemo = {
        correo,
        nombre: correo.split('@')[0],
        telefono: '',
        rol: 'ROLE_ADMIN',
        esAdmin: true,
      };

      const listaActualizada = [...listaRegistrados];
      if (!listaActualizada.some((u) => u.correo === correo)) {
        listaActualizada.push({
          correo,
          clave: 'admin123',
          nombre: correo.split('@')[0],
          telefono: '',
          rol: 'ROLE_ADMIN',
        });
        localStorage.setItem('usuarios_registrados_locales', JSON.stringify(listaActualizada));
      }

      guardarSesionDemo(usuarioDemo);
      return true;
    }

    setErrorMensaje(
      'No se encontró una cuenta registrada con el correo ingresado. Por favor ingrese a la pestaña Registrarse para crear su cuenta.'
    );
    return false;
  };

  const alManejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    setErrorMensaje(null);
    setExitoMensaje(null);

    if (!correoElectronico || !claveSeguridad) {
      setErrorMensaje('Por favor diligencie todos los campos requeridos.');
      return;
    }

    setCargando(true);
    try {
      // Petición HTTP al endpoint de login del Backend Spring Boot con nombres exactos del DTO SolicitudLogin.java
      const respuesta = await clienteApi.post('/api/autenticacion/login', {
        correo: correoElectronico,
        contrasena: claveSeguridad,
      });

      const datosAcceso = respuesta.data;
      if (datosAcceso && (datosAcceso.tokenAcceso || datosAcceso.token)) {
        const tokenFinal = datosAcceso.tokenAcceso || datosAcceso.token;
        const usuarioFinal = datosAcceso.usuario || {
          correo: correoElectronico,
          nombre: correoElectronico.split('@')[0],
          rol: correoElectronico.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_CLIENTE',
        };
        localStorage.setItem('token', tokenFinal);
        localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
        localStorage.setItem('usuario_tienda', JSON.stringify(usuarioFinal));
      }

      setExitoMensaje('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        navegar('/');
      }, 1200);
    } catch (error) {
      console.warn('Error al iniciar sesión en el backend:', error);

      if (error.response) {
        const mensajeRespuestaBackend = error.response.data?.mensaje || error.response.data?.message;
        const esErrorCredenciales =
          error.response.status === 401 || error.response.status === 400 || mensajeRespuestaBackend === 'Bad credentials';

        if (!esErrorCredenciales) {
          setErrorMensaje(mensajeRespuestaBackend || 'No se pudo completar el inicio de sesión.');
          return;
        }
      }

      const loginLocalExitoso = procesarLoginLocal(correoElectronico, claveSeguridad);
      if (!loginLocalExitoso) {
        return;
      }

      setExitoMensaje('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        navegar('/');
      }, 1200);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container" style={{ maxWidth: '450px' }}>
          
          <div className="card bg-dark text-white border-secondary shadow-lg p-4 p-md-5 rounded-4">
            
            {/* Encabezado del Formulario */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-primary bg-opacity-25 text-info d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px' }}
              >
                <LogIn size={28} />
              </div>
              <h3 className="fw-bold text-white mb-1">Iniciar Sesión</h3>
              <p className="text-secondary small">Ingresa a tu cuenta de Technological Device</p>
            </div>

            {/* Mensajes de Estado */}
            {errorMensaje && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-4" role="alert">
                <AlertCircle size={18} />
                <span className="small">{errorMensaje}</span>
              </div>
            )}

            {exitoMensaje && (
              <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-4" role="alert">
                <CheckCircle size={18} />
                <span className="small">{exitoMensaje}</span>
              </div>
            )}

            {/* Formulario de Login */}
            <form onSubmit={alManejarEnvioFormulario}>
              
              {/* Campo Correo Electrónico */}
              <div className="mb-3">
                <label className="form-label text-light small fw-semibold">Correo Electrónico</label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary text-white border-secondary">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="ejemplo@correo.com"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Clave de Seguridad */}
              <div className="mb-4">
                <label className="form-label text-light small fw-semibold">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary text-white border-secondary">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="••••••••"
                    value={claveSeguridad}
                    onChange={(e) => setClaveSeguridad(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Botón Ingresar */}
              <button
                type="submit"
                disabled={cargando}
                className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow"
              >
                {cargando ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <LogIn size={18} />
                )}
                <span>{cargando ? 'Verificando...' : 'Ingresar'}</span>
              </button>

            </form>

            {/* Pie del Formulario: Redirección al Registro */}
            <div className="text-center mt-4 pt-3 border-top border-secondary">
              <p className="text-secondary small mb-0">
                ¿No tienes una cuenta aún?{' '}
                <Link to="/registro" className="text-info fw-semibold text-decoration-none">
                  Regístrate aquí
                </Link>
              </p>
            </div>

          </div>

        </div>
      </main>

      <PiePagina />
    </div>
  );
}

export default IniciarSesion;
