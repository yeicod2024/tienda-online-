package com.tienda.modulos.productos;

import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.modulos.categorias.Categoria;
import com.tienda.modulos.categorias.RepositorioCategoria;
import com.tienda.modulos.categorias.dto.RespuestaCategoria;
import com.tienda.modulos.inventario.Inventario;
import com.tienda.modulos.inventario.RepositorioInventario;
import com.tienda.modulos.productos.dto.RespuestaImagenProducto;
import com.tienda.modulos.productos.dto.RespuestaProducto;
import com.tienda.modulos.productos.dto.SolicitudProducto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Negocio para la gestión de Productos e Imágenes del catálogo.
 */
@Service
public class ServicioProducto {

    private final RepositorioProducto repositorioProducto;
    private final RepositorioCategoria repositorioCategoria;
    private final RepositorioImagenProducto repositorioImagenProducto;
    private final ServicioAlmacenamientoImagen servicioAlmacenamientoImagen;
    private final RepositorioInventario repositorioInventario;

    public ServicioProducto(RepositorioProducto repositorioProducto,
            RepositorioCategoria repositorioCategoria,
            RepositorioImagenProducto repositorioImagenProducto,
            ServicioAlmacenamientoImagen servicioAlmacenamientoImagen,
            RepositorioInventario repositorioInventario) {
        this.repositorioProducto = repositorioProducto;
        this.repositorioCategoria = repositorioCategoria;
        this.repositorioImagenProducto = repositorioImagenProducto;
        this.servicioAlmacenamientoImagen = servicioAlmacenamientoImagen;
        this.repositorioInventario = repositorioInventario;
    }

    /**
     * Obtiene todos los productos activos del catálogo.
     */
    @Transactional(readOnly = true)
    public List<RespuestaProducto> obtenerTodos() {
        return repositorioProducto.findByActivoTrue()
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un producto específico por su ID.
     */
    @Transactional(readOnly = true)
    public RespuestaProducto obtenerPorId(Long id) {
        Producto producto = repositorioProducto.findById(id)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Producto no encontrado con el ID: " + id));
        return mapearADTO(producto);
    }

    /**
     * Busca productos por coincidencia en el nombre (búsqueda de la tienda).
     */
    @Transactional(readOnly = true)
    public List<RespuestaProducto> buscarPorNombre(String nombre) {
        return repositorioProducto.findByNombreContainingIgnoreCaseAndActivoTrue(nombre)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los productos activos de una categoría específica.
     */
    @Transactional(readOnly = true)
    public List<RespuestaProducto> obtenerPorCategoria(Long categoriaId) {
        return repositorioProducto.findByCategoriaIdAndActivoTrue(categoriaId)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo producto validando la existencia de su categoría y creando su
     * inventario inicial.
     */
    @Transactional
    public RespuestaProducto crear(SolicitudProducto solicitud) {
        Categoria categoria = null;
        if (solicitud.getCategoriaId() != null) {
            categoria = repositorioCategoria.findById(solicitud.getCategoriaId()).orElse(null);
        }
        if (categoria == null && solicitud.getCategoriaNombre() != null) {
            categoria = repositorioCategoria.findAll().stream()
                    .filter(c -> c.getNombre() != null && c.getNombre().equalsIgnoreCase(solicitud.getCategoriaNombre()))
                    .findFirst()
                    .orElse(null);
        }
        if (categoria == null) {
            categoria = repositorioCategoria.findAll().stream().findFirst()
                    .orElseThrow(() -> new ExcepcionRecursoNoEncontrado(
                            "No existen categorías registradas en la Base de Datos."));
        }

        Producto producto = new Producto();
        producto.setCategoria(categoria);
        producto.setNombre(solicitud.getNombre());
        producto.setDescripcion(solicitud.getDescripcion());
        producto.setPrecio(solicitud.getPrecio());
        producto.setSku(solicitud.getSku() != null ? solicitud.getSku() : "SKU-" + System.currentTimeMillis());
        producto.setActivo(solicitud.getActivo() != null ? solicitud.getActivo() : true);

        Producto productoGuardado = repositorioProducto.save(producto);

        // Crear registro inicial de inventario con el stock indicado
        Integer stockIngresado = solicitud.getStock() != null ? solicitud.getStock() : solicitud.getStockInicial();
        Inventario inventarioInicial = new Inventario();
        inventarioInicial.setProducto(productoGuardado);
        inventarioInicial.setCantidad(stockIngresado != null ? stockIngresado : 0);
        repositorioInventario.save(inventarioInicial);

        // Guardar siempre una imagen principal en la tabla imagenes_producto

        String urlImagenFinal = (solicitud.getUrlImagen() != null && !solicitud.getUrlImagen().trim().isEmpty())
                ? solicitud.getUrlImagen()
                : "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80";

        ImagenProducto img = new ImagenProducto();
        img.setProducto(productoGuardado);
        img.setUrlImagen(urlImagenFinal);
        img.setEsPrincipal(true);
        img.setOrdenVisualizacion(1);
        repositorioImagenProducto.save(img);

        return mapearADTO(productoGuardado);
    }

    /**
     * Actualiza los datos de un producto existente y sincroniza su cantidad en inventario.
     */
    @Transactional
    public RespuestaProducto actualizar(Long id, SolicitudProducto solicitud) {
        Producto producto = repositorioProducto.findById(id)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Producto no encontrado con el ID: " + id));

        Categoria categoria = null;
        if (solicitud.getCategoriaId() != null) {
            categoria = repositorioCategoria.findById(solicitud.getCategoriaId()).orElse(null);
        }
        if (categoria == null && solicitud.getCategoriaNombre() != null) {
            categoria = repositorioCategoria.findAll().stream()
                    .filter(c -> c.getNombre() != null && c.getNombre().equalsIgnoreCase(solicitud.getCategoriaNombre()))
                    .findFirst()
                    .orElse(null);
        }

        if (categoria != null) {
            producto.setCategoria(categoria);
        }

        if (solicitud.getNombre() != null) producto.setNombre(solicitud.getNombre());
        if (solicitud.getDescripcion() != null) producto.setDescripcion(solicitud.getDescripcion());
        if (solicitud.getPrecio() != null) producto.setPrecio(solicitud.getPrecio());
        if (solicitud.getSku() != null) producto.setSku(solicitud.getSku());

        if (solicitud.getActivo() != null) {
            producto.setActivo(solicitud.getActivo());
        }

        // Actualizar permanentemente el stock en la tabla de inventarios
        Integer nuevoStock = solicitud.getStock() != null ? solicitud.getStock() : solicitud.getStockInicial();
        if (nuevoStock != null) {
            Inventario inventario = repositorioInventario.findByProductoId(id)
                    .orElseGet(() -> {
                        Inventario nuevo = new Inventario();
                        nuevo.setProducto(producto);
                        return nuevo;
                    });
            inventario.setCantidad(nuevoStock);
            repositorioInventario.save(inventario);
        }

        // Actualizar o crear imagen principal en imagenes_producto
        String urlImagenActualizada = (solicitud.getUrlImagen() != null && !solicitud.getUrlImagen().trim().isEmpty())
                ? solicitud.getUrlImagen()
                : "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80";

        List<ImagenProducto> imagenesExistentes = repositorioImagenProducto.findByProductoIdOrderByOrdenVisualizacionAsc(id);
        if (imagenesExistentes != null && !imagenesExistentes.isEmpty()) {
            ImagenProducto principal = imagenesExistentes.get(0);
            principal.setUrlImagen(urlImagenActualizada);
            repositorioImagenProducto.save(principal);
        } else {
            ImagenProducto nuevaImg = new ImagenProducto();
            nuevaImg.setProducto(producto);
            nuevaImg.setUrlImagen(urlImagenActualizada);
            nuevaImg.setEsPrincipal(true);
            nuevaImg.setOrdenVisualizacion(1);
            repositorioImagenProducto.save(nuevaImg);
        }

        Producto productoActualizado = repositorioProducto.save(producto);
        return mapearADTO(productoActualizado);
    }


    /**
     * Desactiva lógicamente un producto por su ID y pone su stock en 0 en inventario.
     */
    @Transactional
    public void eliminar(Long id) {
        Producto producto = repositorioProducto.findById(id)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Producto no encontrado con el ID: " + id));

        producto.setActivo(false); // Borrado lógico
        repositorioProducto.save(producto);

        // Ajustar la cantidad de stock a 0 en la tabla de inventarios
        repositorioInventario.findByProductoId(id).ifPresent(inventario -> {
            inventario.setCantidad(0);
            repositorioInventario.save(inventario);
        });
    }

    /**
     * Sube y asocia una nueva imagen a un producto.
     */
    @Transactional
    public RespuestaImagenProducto subirImagen(Long productoId, MultipartFile archivo, Boolean esPrincipal) {
        Producto producto = repositorioProducto.findById(productoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Producto no encontrado con el ID: " + productoId));

        List<ImagenProducto> imagenesExistentes = repositorioImagenProducto
                .findByProductoIdOrderByOrdenVisualizacionAsc(productoId);

        // Si es la primera imagen o viene marcada como principal, desmarcar las
        // anteriores
        boolean marcarComoPrincipal = (esPrincipal != null && esPrincipal) || imagenesExistentes.isEmpty();

        if (marcarComoPrincipal && !imagenesExistentes.isEmpty()) {
            for (ImagenProducto img : imagenesExistentes) {
                if (Boolean.TRUE.equals(img.getEsPrincipal())) {
                    img.setEsPrincipal(false);
                    repositorioImagenProducto.save(img);
                }
            }
        }

        // Guardar archivo físico en disco
        String urlImagen = servicioAlmacenamientoImagen.guardarImagen(archivo);

        // Crear y guardar la entidad ImagenProducto en BD
        ImagenProducto nuevaImagen = new ImagenProducto();
        nuevaImagen.setProducto(producto);
        nuevaImagen.setUrlImagen(urlImagen);
        nuevaImagen.setEsPrincipal(marcarComoPrincipal);
        nuevaImagen.setOrdenVisualizacion(imagenesExistentes.size() + 1);

        ImagenProducto imagenGuardada = repositorioImagenProducto.save(nuevaImagen);

        return new RespuestaImagenProducto(
                imagenGuardada.getId(),
                imagenGuardada.getUrlImagen(),
                imagenGuardada.getEsPrincipal(),
                imagenGuardada.getOrdenVisualizacion());
    }

    /**
     * Elimina una imagen por su ID (borra el registro en BD y el archivo físico en
     * disco).
     */
    @Transactional
    public void eliminarImagen(Long imagenId) {
        ImagenProducto imagen = repositorioImagenProducto.findById(imagenId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Imagen no encontrada con el ID: " + imagenId));

        // Borrar el archivo en disco
        servicioAlmacenamientoImagen.eliminarImagen(imagen.getUrlImagen());

        // Borrar la entidad en MySQL
        repositorioImagenProducto.delete(imagen);
    }

    /**
     * Método auxiliar para convertir de Producto (Entidad JPA) a RespuestaProducto
     * (DTO)
     */
    private RespuestaProducto mapearADTO(Producto producto) {
        RespuestaCategoria dtoCategoria = null;
        String categoriaNombre = null;
        if (producto != null && producto.getCategoria() != null) {
            categoriaNombre = producto.getCategoria().getNombre();
            dtoCategoria = new RespuestaCategoria(
                    producto.getCategoria().getId(),
                    producto.getCategoria().getNombre(),
                    producto.getCategoria().getDescripcion(),
                    producto.getCategoria().getUrlImagen(),
                    producto.getCategoria().getActivo());
        }

        List<ImagenProducto> imagenesJpa = repositorioImagenProducto
                .findByProductoIdOrderByOrdenVisualizacionAsc(producto.getId());
        List<RespuestaImagenProducto> dtoListImagenes = (imagenesJpa != null) ? imagenesJpa.stream()
                .map(img -> new RespuestaImagenProducto(
                        img.getId(),
                        img.getUrlImagen(),
                        img.getEsPrincipal(),
                        img.getOrdenVisualizacion()))
                .collect(Collectors.toList()) : List.of();

        // Extraer la URL de la imagen principal o la primera disponible en la base de
        // datos
        String urlImagenPrincipal = imagenesJpa.stream()
                .filter(img -> Boolean.TRUE.equals(img.getEsPrincipal()))
                .map(ImagenProducto::getUrlImagen)
                .findFirst()
                .orElseGet(() -> (imagenesJpa != null && !imagenesJpa.isEmpty()) ? imagenesJpa.get(0).getUrlImagen()
                        : null);

        // Consultar el stock registrado en el modulo de inventarios
        Integer cantidadStock = repositorioInventario.findByProductoId(producto.getId())
                .map(Inventario::getCantidad)
                .orElse(0);

        return new RespuestaProducto(
                producto.getId(),
                dtoCategoria,
                categoriaNombre,
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getSku(),
                producto.getActivo(),
                urlImagenPrincipal,
                cantidadStock,
                dtoListImagenes,
                producto.getCreadoEn(),
                producto.getActualizadoEn());
    }

}
