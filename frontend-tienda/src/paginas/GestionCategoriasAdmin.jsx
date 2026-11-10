import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import clienteApi from '../servicios/clienteApi';
import { Layers, Plus, Edit, Trash2, CheckCircle, AlertCircle, Image } from 'lucide-react';

/**
 * Vista GestionCategoriasAdmin: Panel del administrador para gestionar el catálogo de categorías tecnológicas.
 */
function GestionCategoriasAdmin() {
  const [listaCategorias, setListaCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensajeOperacion, setMensajeOperacion] = useState(null);

  const [categoriaFormulario, setCategoriaFormulario] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    urlImagen: '',
    activo: true,
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setCargando(true);
    try {
      const respuesta = await clienteApi.get('/api/categorias');
      setListaCategorias(respuesta.data);
    } catch (error) {
      console.warn('Cargando categorías de prueba para administración:', error);
      setListaCategorias([
        {
          id: 1,
          nombre: 'Portátiles',
          descripcion: 'Laptops y computadores portátiles de alto rendimiento para trabajo y gaming.',
          urlImagen: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60',
          activo: true,
        },
        {
          id: 2,
          nombre: 'Periféricos',
          descripcion: 'Teclados mecánicos, mouses ergonómicos y accesorios de computador.',
          urlImagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
          activo: true,
        },
        {
          id: 3,
          nombre: 'Sillas de Oficina',
          descripcion: 'Sillas gamer y ergonómicas para largas jornadas de trabajo.',
          urlImagen: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&auto=format&fit=crop&q=60',
          activo: true,
        },
        {
          id: 4,
          nombre: 'Audio',
          descripcion: 'Audífonos gamer, parlantes Bluetooth y sistemas de sonido.',
          urlImagen: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60',
          activo: true,
        },
        {
          id: 5,
          nombre: 'Monitores',
          descripcion: 'Monitores de alta tasa de refresco (165Hz) e IPS para trabajo y juego.',
          urlImagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
          activo: true,
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const alAbrirModalCrear = () => {
    setModoEdicion(false);
    setCategoriaFormulario({
      id: null,
      nombre: '',
      descripcion: '',
      urlImagen: '',
      activo: true,
    });
    setMostrarModal(true);
  };

  const alAbrirModalEditar = (cat) => {
    setModoEdicion(true);
    setCategoriaFormulario({
      id: cat.id,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      urlImagen: cat.urlImagen || '',
      activo: cat.activo !== false,
    });
    setMostrarModal(true);
  };

  const alGuardarCategoria = async (e) => {
    e.preventDefault();
    if (!categoriaFormulario.nombre) {
      alert('Por favor ingrese el nombre de la categoría.');
      return;
    }

    try {
      if (modoEdicion) {
        await clienteApi.put(`/api/categorias/${categoriaFormulario.id}`, categoriaFormulario);
        setMensajeOperacion(`¡Categoría '${categoriaFormulario.nombre}' actualizada exitosamente!`);
      } else {
        await clienteApi.post('/api/categorias', categoriaFormulario);
        setMensajeOperacion(`¡Categoría '${categoriaFormulario.nombre}' creada exitosamente!`);
      }
      cargarCategorias();
    } catch (error) {
      console.warn('Simulando guardado local en modo demostración:', error);
      if (modoEdicion) {
        setListaCategorias(listaCategorias.map((c) => (c.id === categoriaFormulario.id ? categoriaFormulario : c)));
      } else {
        const nuevaCat = { ...categoriaFormulario, id: Date.now() };
        setListaCategorias([...listaCategorias, nuevaCat]);
      }
      setMensajeOperacion(`¡Categoría guardada exitosamente (Modo Demostración)!`);
    }

    setMostrarModal(false);
    setTimeout(() => setMensajeOperacion(null), 3000);
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
                <Layers className="text-info" size={28} />
                <span>Gestión de Categorías</span>
              </h2>
              <p className="text-secondary small mb-0">Estructuración y clasificación de productos de la tienda</p>
            </div>

            <div className="d-flex gap-2">
              <button onClick={alAbrirModalCrear} className="btn btn-info fw-bold btn-sm text-dark d-flex align-items-center gap-1">
                <Plus size={16} /> Nueva Categoría
              </button>
              <Link to="/admin" className="btn btn-outline-info btn-sm">
                Panel Inventario
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

          {/* Tarjetas de Categorías */}
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary">Cargando categorías tecnológicas...</p>
            </div>
          ) : (
            <div className="row g-4 mb-5">
              {listaCategorias.map((cat) => (
                <div key={cat.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card bg-dark text-white border-secondary h-100 shadow-lg rounded-4 overflow-hidden">
                    <img
                      src={cat.urlImagen || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60'}
                      alt={cat.nombre}
                      className="card-img-top"
                      style={{ height: '160px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="fw-bold text-white mb-0">{cat.nombre}</h5>
                        <span className={`badge ${cat.activo ? 'bg-success' : 'bg-secondary'}`}>
                          {cat.activo ? 'ACTIVA' : 'INACTIVA'}
                        </span>
                      </div>
                      <p className="card-text text-secondary small flex-grow-1">
                        {cat.descripcion || 'Sin descripción asignada.'}
                      </p>
                      <button
                        onClick={() => alAbrirModalEditar(cat)}
                        className="btn btn-outline-info btn-sm w-100 mt-3 d-flex align-items-center justify-content-center gap-1"
                      >
                        <Edit size={14} /> Editar Categoría
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Modal de Creación / Edición */}
      {mostrarModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
                  <Layers size={20} className="text-info" />
                  <span>{modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}</span>
                </h5>
                <button onClick={() => setMostrarModal(false)} className="btn-close btn-close-white" type="button"></button>
              </div>

              <form onSubmit={alGuardarCategoria}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-light small fw-semibold">Nombre de la Categoría *</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Ej. Componentes PC"
                      value={categoriaFormulario.nombre}
                      onChange={(e) => setCategoriaFormulario({ ...categoriaFormulario, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small fw-semibold">Descripción *</label>
                    <textarea
                      className="form-control bg-dark text-white border-secondary"
                      rows="3"
                      placeholder="Descripción comercial de la categoría..."
                      value={categoriaFormulario.descripcion}
                      onChange={(e) => setCategoriaFormulario({ ...categoriaFormulario, descripcion: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small fw-semibold">URL de la Imagen de Portada</label>
                    <input
                      type="url"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="https://ejemplo.com/imagen-categoria.jpg"
                      value={categoriaFormulario.urlImagen}
                      onChange={(e) => setCategoriaFormulario({ ...categoriaFormulario, urlImagen: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button onClick={() => setMostrarModal(false)} type="button" className="btn btn-outline-secondary btn-sm">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-info btn-sm text-dark fw-bold px-4">
                    {modoEdicion ? 'Guardar Cambios' : 'Crear Categoría'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <PiePagina />
    </div>
  );
}

export default GestionCategoriasAdmin;
