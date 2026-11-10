import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import sliderImg from '../assets/imagen-slider.png';
import { ChevronLeft, ChevronRight, ShoppingBag, Tag, ArrowRight, Database, AlertCircle } from 'lucide-react';
import { obtenerProductos } from '../servicios/servicioProducto';

/**
 * Vista Inicio: Página de bienvenida principal de "Technological Device".
 * Consume exclusivamente la información real de productos almacenados en la Base de Datos del Backend.
 */
function Inicio() {
  // Estado para almacenar la lista real de productos obtenidos de la Base de Datos
  const [listaProductos, setListaProductos] = useState([]);
  // Índice del producto seleccionado en el carrusel de la franja verde
  const [indiceActual, setIndiceActual] = useState(0);
  // Estado de carga inicial mientras se consulta la API REST
  const [cargando, setCargando] = useState(true);
  // Estado de error en caso de fallo de conexión con el servicio backend
  const [errorConexion, setErrorConexion] = useState(false);

  // Función para consultar la Base de Datos a través de la API REST
  const cargarProductosBaseDatos = async () => {
    setCargando(true);
    setErrorConexion(false);
    try {
      const datosBackend = await obtenerProductos();
      if (datosBackend && Array.isArray(datosBackend)) {
        setListaProductos(datosBackend);
      } else {
        setListaProductos([]);
      }
    } catch (error) {
      console.error('Error al conectar con la base de datos de productos:', error);
      setErrorConexion(true);
      setListaProductos([]);
    } finally {
      setCargando(false);
    }
  };

  // Efecto inicial: Carga de productos al montar el componente
  useEffect(() => {
    cargarProductosBaseDatos();
  }, []);

  // Función para avanzar al siguiente producto en el carrusel (navegación circular)
  const siguienteProducto = () => {
    if (listaProductos.length === 0) return;
    setIndiceActual((indicePrevio) => (indicePrevio + 1) % listaProductos.length);
  };

  // Función para retroceder al producto anterior en el carrusel (navegación circular)
  const anteriorProducto = () => {
    if (listaProductos.length === 0) return;
    setIndiceActual((indicePrevio) =>
      indicePrevio === 0 ? listaProductos.length - 1 : indicePrevio - 1
    );
  };

  // Producto activo visible en el carrusel de la franja verde
  const productoActivo = listaProductos[indiceActual] || null;

  // Extracción resiliente de la imagen, categoría y stock del producto activo
  const urlImagenActiva =
    productoActivo?.urlImagen ||
    (productoActivo?.imagenes && productoActivo.imagenes.find((img) => img.esPrincipal)?.urlImagen) ||
    (productoActivo?.imagenes && productoActivo.imagenes[0]?.urlImagen) ||
    sliderImg;

  const categoriaNombreActiva = productoActivo?.categoriaNombre || productoActivo?.categoria?.nombre;
  const stockActivo = productoActivo?.stock !== undefined ? productoActivo.stock : 0;

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {/* 1. Encabezado de Navegación */}
      <Navegacion />

      {/* 2. Sección slider Principal (Diseño institucional estático) */}
      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#121612' }}>
        <div className="container">
          <div className="row align-items-center g-5 py-4">

            {/* Columna Izquierda: Imagen Estática de Bienvenida */}
            <div className="col-12 col-lg-6">
              <div className="card bg-transparent border-0 overflow-hidden shadow-lg">
                <img
                  src={sliderImg}
                  alt="Dispositivos Tecnológicos y Trabajo"
                  className="img-fluid rounded-3 shadow"
                  style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
                />
              </div>
              {/* Indicadores visuales decorativos de la slider */}
              <div className="d-flex justify-content-center gap-2 mt-3">
                <span className="badge rounded-pill bg-secondary px-2" style={{ height: '8px', width: '20px' }}></span>
                <span className="badge rounded-pill bg-secondary px-2" style={{ height: '8px', width: '20px' }}></span>
                <span className="badge rounded-pill bg-light px-2" style={{ height: '8px', width: '30px' }}></span>
              </div>
            </div>

            {/* Columna Derecha: Título y Descripción de Bienvenida */}
            <div className="col-12 col-lg-6 text-center">
              <h1 className="fw-bold display-4 mb-4 text-white">
                Technological Device
              </h1>
              <p className="fs-5 text-light lh-lg px-2 px-md-3">
                ¡Aquí podrás ver todos los productos relacionados con dispositivos tecnológicos!
                Disfruta y asesórate con nosotros sobre tus necesidades tecnológicas, como computadoras
                portátiles, teclados, mouses, sillas de oficina, productos gamer, entre otros.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* 3. Franja Verde Bosque con Carrusel Conectado a la Base de Datos */}
      <section style={{ backgroundColor: '#486046' }} className="py-4 shadow-sm">
        <div className="container">

          {/* Barra de Controles: Flechas e Información del Carrusel */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              onClick={anteriorProducto}
              disabled={listaProductos.length <= 1}
              className="btn btn-dark btn-sm d-flex align-items-center justify-content-center p-2 px-3 shadow-sm border-0 gap-2"
              aria-label="Anterior Producto"
              title="Ver producto anterior"
            >
              <ChevronLeft size={20} className="text-white" />
              <span className="d-none d-sm-inline text-white fw-medium fs-7">Anterior</span>
            </button>

            <div className="text-center text-white">
              <span className="badge bg-dark text-success border border-success px-3 py-1 mb-1">
                <Database size={12} className="me-1" />
                Base de Datos ({listaProductos.length > 0 ? `${indiceActual + 1} de ${listaProductos.length}` : '0 productos'})
              </span>
              <h4 className="fw-bold m-0 fs-5 text-white">
                Nuestros Productos Tecnológicos
              </h4>
            </div>

            <button
              onClick={siguienteProducto}
              disabled={listaProductos.length <= 1}
              className="btn btn-dark btn-sm d-flex align-items-center justify-content-center p-2 px-3 shadow-sm border-0 gap-2"
              aria-label="Siguiente Producto"
              title="Ver siguiente producto"
            >
              <span className="d-none d-sm-inline text-white fw-medium fs-7">Siguiente</span>
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>

          {/* Renderizado Dinámico según estado de Carga, Error o Datos Reales */}
          {cargando ? (
            <div className="text-center py-4">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Consultando base de datos...</span>
              </div>
              <p className="mt-2 text-white-50 small">Cargando catálogo desde la Base de Datos...</p>
            </div>
          ) : errorConexion ? (
            <div className="alert alert-dark text-white border-warning text-center my-2 p-4 shadow">
              <AlertCircle className="text-warning mb-2" size={32} />
              <h6 className="fw-bold mb-1">Conexión en espera</h6>
              <p className="small text-secondary mb-3">
                El backend ya se encuentra en línea. Haz clic a continuación para cargar los productos.
              </p>
              <button
                onClick={cargarProductosBaseDatos}
                className="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2 px-3 py-2 shadow-sm"
              >
                <Database size={16} />
                Cargar Productos Ahora
              </button>
            </div>
          ) : listaProductos.length === 0 ? (
            <div className="alert alert-dark text-white border-secondary text-center my-2 shadow">
              <Database className="text-info mb-2" size={28} />
              <p className="fw-bold mb-1">No hay productos registrados en la Base de Datos</p>
              <p className="small text-secondary mb-0">
                Ingresa al Panel Administrativo para agregar nuevos productos tecnológicos.
              </p>
            </div>
          ) : productoActivo ? (
            <div className="card bg-dark text-white border-0 shadow-lg overflow-hidden my-2 rounded-3">
              <div className="row g-0 align-items-center">

                {/* Foto Real del Producto (almacenada en Base de Datos) */}
                <div className="col-12 col-md-4">
                  <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                    <img
                      src={urlImagenActiva}
                      alt={productoActivo.nombre}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = sliderImg;
                      }}
                    />
                    {categoriaNombreActiva && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-success shadow">
                        <Tag size={12} className="me-1" />
                        {categoriaNombreActiva}
                      </span>
                    )}
                  </div>
                </div>

                {/* Detalles y Acciones del Producto de la Base de Datos */}
                <div className="col-12 col-md-8 p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold fs-4 mb-0 text-white">
                      {productoActivo.nombre}
                    </h5>
                    <span className={`badge ${stockActivo > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {stockActivo > 0 ? `Stock: ${stockActivo}` : 'Agotado'}
                    </span>
                  </div>

                  <p className="card-text text-secondary small mb-3">
                    {productoActivo.descripcion || 'Dispositivo de alta tecnología disponible en nuestra tienda.'}
                  </p>

                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="fs-3 fw-bold text-success">
                      ${Number(productoActivo.precio).toLocaleString('es-CO')} COP
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        to={`/producto/${productoActivo.id}`}
                        className="btn btn-success d-inline-flex align-items-center gap-2 btn-sm px-3 py-2"
                      >
                        <ShoppingBag size={16} />
                        Ver Producto
                      </Link>

                      <Link
                        to="/productos"
                        className="btn btn-outline-light d-inline-flex align-items-center gap-2 btn-sm px-3 py-2"
                      >
                        Catálogo Completo
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : null}

        </div>
      </section>

      {/* 4. Pie de Página */}
      <PiePagina />
    </div>
  );
}

export default Inicio;


