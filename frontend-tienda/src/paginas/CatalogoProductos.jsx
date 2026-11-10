import { useState, useEffect } from 'react';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import TarjetaProducto from '../componentes/TarjetaProducto';
import { obtenerProductos } from '../servicios/servicioProducto';
import { Package, RefreshCw, AlertCircle, Database } from 'lucide-react';

/**
 * Vista CatalogoProductos: Muestra la lista completa de dispositivos tecnológicos disponibles.
 * Consume exclusivamente la API REST del Backend Spring Boot conectado a la Base de Datos.
 */
function CatalogoProductos() {
  // Estado para la lista real de productos
  const [listaProductos, setListaProductos] = useState([]);
  // Estado de carga mientras se realiza la consulta HTTP
  const [cargando, setCargando] = useState(true);
  // Estado de error en caso de fallo de conexión con el backend
  const [errorMensaje, setErrorMensaje] = useState(null);

  // Función para obtener los productos desde la Base de Datos
  const cargarProductos = async () => {
    setCargando(true);
    setErrorMensaje(null);
    try {
      const datosBackend = await obtenerProductos();
      if (datosBackend && Array.isArray(datosBackend)) {
        setListaProductos(datosBackend);
      } else {
        setListaProductos([]);
      }
    } catch (error) {
      console.error('Error al conectar con la API de productos:', error);
      setErrorMensaje('No se pudo establecer conexión con el servidor Backend o la Base de Datos.');
      setListaProductos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Manejador para agregar productos al carrito de compras
  const alAgregarAlCarrito = (producto) => {
    console.log('Producto agregado al carrito:', producto);
    alert(`¡${producto.nombre} agregado al carrito!`);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {/* Encabezado de Navegación */}
      <Navegacion />

      {/* Cuerpo Principal del Catálogo */}
      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container">
          
          {/* Título del Catálogo y Botón de Actualizar */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h2 className="fw-bold text-white d-flex align-items-center gap-2 mb-1">
                <Package className="text-info" size={28} />
                <span>Catálogo de Dispositivos</span>
              </h2>
              <p className="text-secondary small mb-0">
                Explora los mejores productos tecnológicos registrados en la Base de Datos oficial.
              </p>
            </div>

            <button
              onClick={cargarProductos}
              className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 shadow-sm"
              disabled={cargando}
              title="Refrescar catálogo desde la Base de Datos"
            >
              <RefreshCw size={16} className={cargando ? 'spin' : ''} />
              <span>Actualizar</span>
            </button>
          </div>

          {/* Indicador de Carga */}
          {cargando && (
            <div className="text-center py-5">
              <div className="spinner-border text-info mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary">Consultando productos en la Base de Datos...</p>
            </div>
          )}

          {/* Mensaje de Error de Conexión */}
          {!cargando && errorMensaje && (
            <div className="alert alert-dark border-warning text-white d-flex align-items-center gap-3 p-3 shadow" role="alert">
              <AlertCircle size={24} className="text-warning flex-shrink-0" />
              <div>
                <h6 className="fw-bold mb-1">Error de Conexión</h6>
                <span className="small text-secondary">{errorMensaje}</span>
              </div>
            </div>
          )}

          {/* Estado sin productos en Base de Datos */}
          {!cargando && !errorMensaje && listaProductos.length === 0 && (
            <div className="alert alert-dark border-secondary text-white text-center py-5 shadow" role="alert">
              <Database size={40} className="text-info mb-3" />
              <h5 className="fw-bold">No hay productos disponibles</h5>
              <p className="text-secondary small mb-0">
                No se encontraron productos registrados en la Base de Datos actualmente.
              </p>
            </div>
          )}

          {/* Cuadrícula Responsiva de Productos Reales */}
          {!cargando && listaProductos.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {listaProductos.map((producto) => (
                <div key={producto.id} className="col">
                  <TarjetaProducto
                    producto={producto}
                    alAgregarAlCarrito={alAgregarAlCarrito}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Pie de Página */}
      <PiePagina />
    </div>
  );
}

export default CatalogoProductos;

