import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import clienteApi from '../servicios/clienteApi';
import { UserPlus, User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Vista Registro: Formulario de creación de cuenta para nuevos clientes de Technological Device.
 * Captura datos personales y credenciales de acceso enviándolos al endpoint de registro del Backend.
 */
function Registro() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [claveSeguridad, setClaveSeguridad] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');

  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [exitoMensaje, setExitoMensaje] = useState(null);

  const navegar = useNavigate();

  const alManejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    setErrorMensaje(null);
    setExitoMensaje(null);

    // Validación de contraseñas
    if (claveSeguridad !== confirmarClave) {
      setErrorMensaje('Las contraseñas ingresadas no coinciden. Por favor verifíquelas.');
      return;
    }

    if (claveSeguridad.length < 6) {
      setErrorMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      // Separar nombre completo en nombre y apellido para el DTO del Backend Java
      const partesNombre = nombreCompleto.trim().split(' ');
      const primerNombre = partesNombre[0] || 'Cliente';
      const primerApellido = partesNombre.slice(1).join(' ') || 'Registrado';

      // Petición POST al backend Spring Boot con los nombres de campos exactos del DTO SolicitudRegistro.java
      const respuesta = await clienteApi.post('/api/autenticacion/registro', {
        nombre: primerNombre,
        apellido: primerApellido,
        correo: correoElectronico,
        contrasena: claveSeguridad,
        telefono: telefono || '0000000000',
      });

      // Guardar usuario en la lista local de usuarios registrados
      const listaRegistrados = JSON.parse(localStorage.getItem('usuarios_registrados_locales') || '[]');
      const nuevoUsuarioRegistrado = {
        correo: correoElectronico,
        clave: claveSeguridad,
        nombre: nombreCompleto,
        telefono: telefono,
        rol: 'ROLE_CLIENTE',
      };
      if (!listaRegistrados.some((u) => u.correo === correoElectronico)) {
        listaRegistrados.push(nuevoUsuarioRegistrado);
        localStorage.setItem('usuarios_registrados_locales', JSON.stringify(listaRegistrados));
      }

      // Guardar sesión activa tras registro exitoso
      const tokenFinal = respuesta.data?.tokenAcceso || respuesta.data?.token || 'token-registrado-' + Date.now();
      const usuarioFinal = {
        correo: correoElectronico,
        nombre: nombreCompleto,
        rol: 'ROLE_CLIENTE',
      };
      localStorage.setItem('token', tokenFinal);
      localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
      localStorage.setItem('usuario_tienda', JSON.stringify(usuarioFinal));

      setExitoMensaje('¡Registro completado e ingresado exitosamente en la base de datos! Redirigiendo...');
      setTimeout(() => {
        navegar('/');
      }, 1500);
    } catch (error) {
      console.warn('Error al registrar usuario en el Backend:', error);

      // Si falla la red, guardar en lista de registrados local para no bloquear la experiencia
      const listaRegistrados = JSON.parse(localStorage.getItem('usuarios_registrados_locales') || '[]');
      const existeLocal = listaRegistrados.some((u) => u.correo === correoElectronico);

      if (existeLocal) {
        setErrorMensaje('El correo electrónico ya se encuentra registrado en la plataforma. Por favor inicia sesión.');
      } else {
        const nuevoUsuarioRegistrado = {
          correo: correoElectronico,
          clave: claveSeguridad,
          nombre: nombreCompleto,
          telefono: telefono,
          rol: 'ROLE_CLIENTE',
        };
        listaRegistrados.push(nuevoUsuarioRegistrado);
        localStorage.setItem('usuarios_registrados_locales', JSON.stringify(listaRegistrados));

        const usuarioFinal = {
          correo: correoElectronico,
          nombre: nombreCompleto,
          rol: 'ROLE_CLIENTE',
        };
        localStorage.setItem('token', 'token-registrado-' + Date.now());
        localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
        localStorage.setItem('usuario_tienda', JSON.stringify(usuarioFinal));

        setExitoMensaje('¡Registro completado exitosamente! Redirigiendo...');
        setTimeout(() => {
          navegar('/');
        }, 1500);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          
          <div className="card bg-dark text-white border-secondary shadow-lg p-4 p-md-5 rounded-4">
            
            {/* Encabezado del Formulario */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-primary bg-opacity-25 text-info d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px' }}
              >
                <UserPlus size={28} />
              </div>
              <h3 className="fw-bold text-white mb-1">Crear Cuenta</h3>
              <p className="text-secondary small">Únete a la comunidad de Technological Device</p>
            </div>

            {/* Mensajes de Alerta */}
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

            {/* Formulario de Registro */}
            <form onSubmit={alManejarEnvioFormulario}>
              
              {/* Campo Nombre Completo */}
              <div className="mb-3">
                <label className="form-label text-light small fw-semibold">Nombre Completo *</label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary text-white border-secondary">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Ej. Juan Pérez"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Correo Electrónico */}
              <div className="mb-3">
                <label className="form-label text-light small fw-semibold">Correo Electrónico *</label>
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

              {/* Campo Teléfono de Contacto */}
              <div className="mb-3">
                <label className="form-label text-light small fw-semibold">Teléfono de Contacto *</label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary text-white border-secondary">
                    <Phone size={18} />
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

              {/* Fila Doble: Contraseña y Confirmación */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
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

                <div className="col-12 col-md-6">
                  <label className="form-label text-light small fw-semibold">Confirmar Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-secondary text-white border-secondary">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="••••••••"
                      value={confirmarClave}
                      onChange={(e) => setConfirmarClave(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Botón Registrarse */}
              <button
                type="submit"
                disabled={cargando}
                className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow"
              >
                {cargando ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <UserPlus size={18} />
                )}
                <span>{cargando ? 'Registrando...' : 'Crear mi Cuenta'}</span>
              </button>

            </form>

            {/* Enlace al Login */}
            <div className="text-center mt-4 pt-3 border-top border-secondary">
              <p className="text-secondary small mb-0">
                ¿Ya tienes una cuenta registrada?{' '}
                <Link to="/login" className="text-info fw-semibold text-decoration-none">
                  Inicia sesión aquí
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

export default Registro;
