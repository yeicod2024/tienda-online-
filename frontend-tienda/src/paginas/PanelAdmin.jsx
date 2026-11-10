import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from '../componentes/Navegacion';
import PiePagina from '../componentes/PiePagina';
import {
  obtenerProductos,
  obtenerCategorias,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../servicios/servicioProducto';
import { Plus, Edit, Trash2, Package, ShieldCheck, Save, Upload, Users, ShoppingBag } from 'lucide-react';

import sliderImg from '../assets/imagen-slider.png';

/**
 * Vista PanelAdmin: Interfaz de gestión administrativa para crear, editar y eliminar dispositivos del inventario.
 * Maquetada exclusivamente con utilidades de Bootstrap 5.
 */
function PanelAdmin() {
  const [listaProductos, setListaProductos] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estado del formulario de creación/edición
  const [productoFormulario, setProductoFormulario] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: null,
    categoriaNombre: 'Portátiles',
    urlImagen: '',
  });

  // Consulta el inventario real desde la API REST
  const cargarInventario = async () => {
    setCargando(true);
    try {
      const datosBackend = await obtenerProductos();
      if (datosBackend && Array.isArray(datosBackend)) {
        setListaProductos(datosBackend);
      } else {
        setListaProductos([]);
      }
    } catch (error) {
      console.error('Error al cargar inventario en el Panel de Administración:', error);
      setListaProductos([]);
    } finally {
      setCargando(false);
    }
  };

  // Carga la lista de categorías registradas desde el Backend
  const cargarCategorias = async () => {
    try {
      const categoriasBackend = await obtenerCategorias();
      if (categoriasBackend && Array.isArray(categoriasBackend)) {
        setListaCategorias(categoriasBackend);
      }
    } catch (error) {
      console.error('Error al cargar categorías en el Panel de Administración:', error);
    }
  };

  useEffect(() => {
    cargarInventario();
    cargarCategorias();
  }, []);

  // Abrir Modal en modo Creación
  const alAbrirModalCrear = () => {
    setModoEdicion(false);
    const primeraCategoria = listaCategorias.length > 0 ? listaCategorias[0] : null;
    setProductoFormulario({
      id: null,
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoriaId: primeraCategoria ? primeraCategoria.id : null,
      categoriaNombre: primeraCategoria ? primeraCategoria.nombre : 'Portátiles',
      urlImagen: '',
    });
    setMostrarModal(true);
  };

  // Abrir Modal en modo Edición
  const alAbrirModalEditar = (prod) => {
    setModoEdicion(true);
    const catNombre = prod.categoriaNombre || prod.categoria?.nombre || 'Portátiles';
    const catId = prod.categoriaId || prod.categoria?.id || null;

    setProductoFormulario({
      id: prod.id,
      nombre: prod.nombre,
      descripcion: prod.descripcion || '',
      precio: prod.precio,
      stock: prod.stock !== undefined ? prod.stock : 0,
      categoriaId: catId,
      categoriaNombre: catNombre,
      urlImagen: prod.urlImagen || (prod.imagenes && prod.imagenes[0]?.urlImagen) || '',
    });
    setMostrarModal(true);
  };

  // Guardar Cambios (Crear o Editar) en la Base de Datos
  const alGuardarProducto = async (e) => {
    e.preventDefault();
    if (!productoFormulario.nombre || !productoFormulario.precio || productoFormulario.stock === '') {
      alert('Por favor diligencie todos los campos obligatorios.');
      return;
    }

    const precioNumero = parseFloat(productoFormulario.precio);
    const stockNumero = parseInt(productoFormulario.stock, 10);

    const objetoEnvio = {
      nombre: productoFormulario.nombre,
      descripcion: productoFormulario.descripcion,
      precio: precioNumero,
      stock: stockNumero,
      stockInicial: stockNumero,
      categoriaId: productoFormulario.categoriaId,
      categoriaNombre: productoFormulario.categoriaNombre,
      urlImagen: productoFormulario.urlImagen || sliderImg,
      sku: 'SKU-' + (productoFormulario.id || Date.now()),
    };

    try {
      if (modoEdicion && productoFormulario.id) {
        await actualizarProducto(productoFormulario.id, objetoEnvio);
        alert('¡Producto y stock actualizados exitosamente en la Base de Datos!');
      } else {
        await crearProducto(objetoEnvio);
        alert('¡Nuevo producto registrado exitosamente en la Base de Datos!');
      }
      setMostrarModal(false);
      await cargarInventario();
    } catch (error) {
      console.error('Error al guardar el producto en la Base de Datos:', error);
      alert('No se pudo guardar en el servidor. Por favor verifique la conexión con el Backend.');
    }
  };

  // Eliminar Producto de la Base de Datos (Borrado lógico en Backend)
  const alEliminarProducto = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto de la Base de Datos?')) {
      try {
        await eliminarProducto(id);
        alert('Producto eliminado exitosamente del catálogo.');
        await cargarInventario();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Ocurrió un error al intentar eliminar el producto en el servidor.');
        await cargarInventario();
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navegacion />

      <main className="flex-grow-1 py-4" style={{ backgroundColor: '#121612' }}>
        <div className="container">
          
          {/* Encabezado Principal del Panel Administrativo */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary gap-3">
            <div>
              <h2 className="fw-bold text-white d-flex align-items-center gap-2 mb-1">
                <ShieldCheck className="text-info" size={28} />
                <span>Panel de Administración</span>
              </h2>
              <p className="text-secondary small mb-0">
                Gestión de inventario de dispositivos tecnológicos conectados a la Base de Datos.
              </p>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <Link to="/admin/pedidos" className="btn btn-outline-warning btn-sm fw-semibold d-flex align-items-center gap-1">
                <ShoppingBag size={14} />
                <span>Gestión Pedidos</span>
              </Link>
              <Link to="/admin/clientes" className="btn btn-outline-info btn-sm fw-semibold d-flex align-items-center gap-1">
                <Users size={14} />
                <span>Gestión Clientes</span>
              </Link>
              <button
                onClick={alAbrirModalCrear}
                className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 shadow"
              >
                <Plus size={18} />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          {/* Tabla de Gestión de Inventario */}
          <div className="card bg-dark text-white border-secondary shadow-lg overflow-hidden">

            <div className="card-header bg-dark border-secondary py-3">
              <h5 className="fw-bold m-0 text-white d-flex align-items-center gap-2">
                <Package className="text-info" size={20} />
                <span>Inventario Completo de Productos</span>
              </h5>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="table-active border-bottom border-secondary text-secondary small">
                    <th scope="col" className="ps-4">ID</th>
                    <th scope="col">Imagen</th>
                    <th scope="col">Nombre del Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col" className="text-center">Precio Directo</th>
                    <th scope="col" className="text-center">Stock</th>
                    <th scope="col" className="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-secondary">
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Cargando inventario de productos...
                      </td>
                    </tr>
                  ) : listaProductos.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-secondary">
                        <Package size={36} className="mb-2 d-block mx-auto" />
                        No hay productos registrados en la Base de Datos.
                      </td>
                    </tr>
                  ) : (
                    listaProductos.map((prod) => (
                      <tr key={prod.id} className="border-bottom border-secondary">
                        <td className="ps-4 fw-bold text-secondary">#{prod.id}</td>
                        <td>
                          <img
                            src={
                              prod.urlImagen ||
                              (prod.imagenes && prod.imagenes[0]?.urlImagen) ||
                              sliderImg
                            }
                            alt={prod.nombre}
                            className="rounded-3"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = sliderImg;
                            }}
                          />
                        </td>
                        <td>
                          <span className="fw-bold text-white d-block">{prod.nombre}</span>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark fw-semibold">
                            {prod.categoriaNombre || prod.categoria?.nombre || 'Tecnología'}
                          </span>
                        </td>
                        <td className="text-center fw-bold text-info fs-6">
                          ${Number(prod.precio).toLocaleString('es-CO')} COP
                        </td>
                        <td className="text-center">
                          {(prod.stock !== undefined ? prod.stock : 0) > 0 ? (
                            <span className="badge bg-success">{prod.stock} un.</span>
                          ) : (
                            <span className="badge bg-danger">Agotado</span>
                          )}
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              onClick={() => alAbrirModalEditar(prod)}
                              className="btn btn-outline-info btn-sm p-2"
                              title="Editar producto"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => alEliminarProducto(prod.id)}
                              className="btn btn-outline-danger btn-sm p-2"
                              title="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Modal de Creación / Edición */}
      {mostrarModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg">
              
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
                  {modoEdicion ? <Edit size={20} className="text-info" /> : <Plus size={20} className="text-info" />}
                  <span>{modoEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}</span>
                </h5>
                <button onClick={() => setMostrarModal(false)} className="btn-close btn-close-white" type="button"></button>
              </div>

              <form onSubmit={alGuardarProducto}>
                <div className="modal-body">
                  <div className="row g-3">
                    
                    {/* Nombre del Producto */}
                    <div className="col-12 col-md-8">
                      <label className="form-label text-light small fw-semibold">Nombre del Dispositivo *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. Monitor Gamer 27 pulgadas"
                        value={productoFormulario.nombre}
                        onChange={(e) => setProductoFormulario({ ...productoFormulario, nombre: e.target.value })}
                        required
                      />
                    </div>

                    {/* Categoría Dinámica */}
                    <div className="col-12 col-md-4">
                      <label className="form-label text-light small fw-semibold">Categoría *</label>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        value={productoFormulario.categoriaNombre}
                        onChange={(e) => {
                          const catSeleccionada = listaCategorias.find((c) => c.nombre === e.target.value);
                          setProductoFormulario({
                            ...productoFormulario,
                            categoriaNombre: e.target.value,
                            categoriaId: catSeleccionada ? catSeleccionada.id : null,
                          });
                        }}
                      >
                        {listaCategorias.length > 0 ? (
                          listaCategorias.map((cat) => (
                            <option key={cat.id} value={cat.nombre}>
                              {cat.nombre}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Portátiles">Portátiles</option>
                            <option value="Periféricos">Periféricos</option>
                            <option value="Sillas de Oficina">Sillas de Oficina</option>
                            <option value="Audio">Audio</option>
                            <option value="Monitores">Monitores</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Precio Directo en Pesos Colombianos */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">
                        Precio Directo en Pesos Colombianos (COP) *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-secondary text-white border-secondary">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="form-control bg-dark text-white border-secondary"
                          placeholder="Ej. 1250000"
                          value={productoFormulario.precio}
                          onChange={(e) => {
                            const valorLimpio = e.target.value.replace(/\D/g, '');
                            setProductoFormulario({ ...productoFormulario, precio: valorLimpio });
                          }}
                          required
                        />
                        <span className="input-group-text bg-secondary text-white border-secondary">COP</span>
                      </div>
                      {productoFormulario.precio && (
                        <small className="text-info d-block mt-1 fw-semibold">
                          Valor en pesos colombianos: ${Number(productoFormulario.precio).toLocaleString('es-CO')} COP
                        </small>
                      )}
                    </div>

                    {/* Stock Disponible */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small fw-semibold">Stock Disponible (Unidades) *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ej. 15"
                        value={productoFormulario.stock}
                        onChange={(e) => {
                          const valorLimpio = e.target.value.replace(/\D/g, '');
                          setProductoFormulario({ ...productoFormulario, stock: valorLimpio });
                        }}
                        required
                      />
                    </div>

                    {/* Selección y Carga de Imagen del Producto */}
                    <div className="col-12">
                      <div className="card bg-dark text-white border-secondary p-3 shadow-sm mb-2">
                        
                        {/* 1. Cargar Archivo de Imagen desde el Dispositivo Local */}
                        <div className="mb-3">
                          <label className="form-label text-light small fw-semibold d-flex align-items-center gap-2">
                            <Upload size={16} className="text-info" />
                            <span>Cargar Imagen desde el Equipo (Local)</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control bg-dark text-white border-secondary"
                            onChange={(e) => {
                              const archivo = e.target.files[0];
                              if (archivo) {
                                const lector = new FileReader();
                                lector.onloadend = () => {
                                  setProductoFormulario({
                                    ...productoFormulario,
                                    urlImagen: lector.result,
                                  });
                                };
                                lector.readAsDataURL(archivo);
                              }
                            }}
                          />
                          <small className="text-secondary d-block mt-1">
                            Selecciona una imagen de tu equipo (.png, .jpg, .webp). Se cargará directamente en el sistema.
                          </small>
                        </div>

                        <div className="text-center my-1 text-secondary small fw-bold">- O BIEN -</div>

                        {/* 2. Pegar URL Web Externa (Opcional) */}
                        <div>
                          <label className="form-label text-secondary small">
                            Pegar enlace de URL web externa (Opcional):
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-secondary text-white border-secondary">URL</span>
                            <input
                              type="url"
                              className="form-control bg-dark text-white border-secondary"
                              placeholder="https://ejemplo.com/foto-producto.jpg (opcional)"
                              value={
                                productoFormulario.urlImagen && !productoFormulario.urlImagen.startsWith('data:')
                                  ? productoFormulario.urlImagen
                                  : ''
                              }
                              onChange={(e) =>
                                setProductoFormulario({ ...productoFormulario, urlImagen: e.target.value })
                              }
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Previsualización en Vivo de la Imagen */}
                    {productoFormulario.urlImagen && (
                      <div className="col-12 text-center py-2">
                        <span className="d-block small text-info fw-semibold mb-2">Vista Previa de la Imagen Cargada:</span>
                        <img
                          src={productoFormulario.urlImagen}
                          alt="Previsualización"
                          className="rounded-3 border border-info shadow"
                          style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.src = sliderImg;
                          }}
                        />
                      </div>
                    )}

                    {/* Descripción Técnica */}
                    <div className="col-12">
                      <label className="form-label text-light small fw-semibold">Descripción Técnica</label>
                      <textarea
                        className="form-control bg-dark text-white border-secondary"
                        rows="3"
                        placeholder="Especificaciones técnicas del producto..."
                        value={productoFormulario.descripcion}
                        onChange={(e) => setProductoFormulario({ ...productoFormulario, descripcion: e.target.value })}
                      ></textarea>
                    </div>

                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button onClick={() => setMostrarModal(false)} type="button" className="btn btn-outline-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-1 fw-semibold">
                    <Save size={16} />
                    <span>Guardar Producto</span>
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

export default PanelAdmin;

