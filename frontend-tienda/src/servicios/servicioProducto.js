import clienteApi from './clienteApi';

/**
 * Servicio encargado de gestionar las peticiones HTTP de productos y categorías al Backend.
 */

/**
 * Obtiene la lista completa de productos activos.
 */
export const obtenerProductos = async () => {
  const respuesta = await clienteApi.get('/api/productos');
  return respuesta.data;
};

/**
 * Obtiene el detalle de un producto específico por su ID.
 */
export const obtenerProductoPorId = async (idProducto) => {
  const respuesta = await clienteApi.get(`/api/productos/${idProducto}`);
  return respuesta.data;
};

/**
 * Busca productos por coincidencia en el nombre.
 */
export const buscarProductosPorNombre = async (terminoBusqueda) => {
  const respuesta = await clienteApi.get(`/api/productos/buscar?nombre=${encodeURIComponent(terminoBusqueda)}`);
  return respuesta.data;
};

/**
 * Obtiene los productos pertenecientes a una categoría específica.
 */
export const obtenerProductosPorCategoria = async (idCategoria) => {
  const respuesta = await clienteApi.get(`/api/productos/categoria/${idCategoria}`);
  return respuesta.data;
};

/**
 * Obtiene la lista de todas las categorías disponibles.
 */
export const obtenerCategorias = async () => {
  const respuesta = await clienteApi.get('/api/categorias');
  return respuesta.data;
};

/**
 * Crea un nuevo producto en la Base de Datos a través de la API REST.
 */
export const crearProducto = async (datosProducto) => {
  const respuesta = await clienteApi.post('/api/productos', datosProducto);
  return respuesta.data;
};

/**
 * Actualiza un producto existente en la Base de Datos por su ID.
 */
export const actualizarProducto = async (idProducto, datosProducto) => {
  const respuesta = await clienteApi.put(`/api/productos/${idProducto}`, datosProducto);
  return respuesta.data;
};

/**
 * Elimina un producto de la Base de Datos por su ID.
 */
export const eliminarProducto = async (idProducto) => {
  const respuesta = await clienteApi.delete(`/api/productos/${idProducto}`);
  return respuesta.data;
};

