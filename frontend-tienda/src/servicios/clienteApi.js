import axios from 'axios';

/**
 * Instancia centralizada de Axios configurada para comunicarse con el Backend Spring Boot.
 * Utiliza preferentemente la IP local IPv4 (http://127.0.0.1:8080) para evitar problemas de resolución DNS de localhost (::1) en Windows.
 */
const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});


/**
 * Interceptor de Peticiones:
 * Se ejecuta automáticamente antes de que cualquier solicitud salga hacia el servidor.
 * Si existe un token JWT en localStorage, lo adjunta en la cabecera 'Authorization'.
 */
clienteApi.interceptors.request.use(
  (configuracion) => {
    const tokenAcceso = localStorage.getItem('token');
    if (tokenAcceso) {
      configuracion.headers.Authorization = `Bearer ${tokenAcceso}`;
    }
    return configuracion;
  },
  (errorPeticion) => {
    return Promise.reject(errorPeticion);
  }
);

/**
 * Interceptor de Respuestas:
 * Maneja respuestas de error globales como 401 Unauthorized.
 */
clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (errorRespuesta) => {
    if (errorRespuesta.response && errorRespuesta.response.status === 401) {
      // Si la sesión expiró o es inválida, se limpia el almacenamiento local
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    return Promise.reject(errorRespuesta);
  }
);

export default clienteApi;
