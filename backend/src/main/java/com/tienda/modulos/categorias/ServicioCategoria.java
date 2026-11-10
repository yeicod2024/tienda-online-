package com.tienda.modulos.categorias;

//import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.modulos.categorias.dto.RespuestaCategoria;
import com.tienda.modulos.categorias.dto.SolicitudCategoria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Negocio para la gestión de Categorías de productos.
 */
@Service
public class ServicioCategoria {

    private final RepositorioCategoria repositorioCategoria;

    public ServicioCategoria(RepositorioCategoria repositorioCategoria) {
        this.repositorioCategoria = repositorioCategoria;
    }

    /**
     * Obtiene la lista de todas las categorías activas.
     */
    @Transactional(readOnly = true)
    public List<RespuestaCategoria> obtenerTodas() {
        return repositorioCategoria.findByActivoTrue()
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una categoría por su ID.
     */
    @Transactional(readOnly = true)
    public RespuestaCategoria obtenerPorId(Long id) {
        Categoria categoria = repositorioCategoria.findById(id)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Categoría no encontrada con el ID: " + id));
        return mapearADTO(categoria);
    }

    /**
     * Crea una nueva categoría en la base de datos.
     */
    @Transactional
    public RespuestaCategoria crear(SolicitudCategoria solicitud) {
        Categoria categoria = new Categoria();
        categoria.setNombre(solicitud.getNombre());
        categoria.setDescripcion(solicitud.getDescripcion());
        categoria.setUrlImagen(solicitud.getUrlImagen());
        categoria.setActivo(solicitud.getActivo() != null ? solicitud.getActivo() : true);

        Categoria categoriaGuardada = repositorioCategoria.save(categoria);
        return mapearADTO(categoriaGuardada);
    }

    /**
     * Actualiza los datos de una categoría existente.
     */
    @Transactional
    public RespuestaCategoria actualizar(Long id, SolicitudCategoria solicitud) {
        Categoria categoria = repositorioCategoria.findById(id)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Categoría no encontrada con el ID: " + id));

        categoria.setNombre(solicitud.getNombre());
        categoria.setDescripcion(solicitud.getDescripcion());
        categoria.setUrlImagen(solicitud.getUrlImagen());
        if (solicitud.getActivo() != null) {
            categoria.setActivo(solicitud.getActivo());
        }

        Categoria categoriaActualizada = repositorioCategoria.save(categoria);
        return mapearADTO(categoriaActualizada);
    }

    /**
     * Desactiva lógicamente una categoría por su ID.
     */
    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = repositorioCategoria.findById(id)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Categoría no encontrada con el ID: " + id));

        categoria.setActivo(false); // Borrado lógico
        repositorioCategoria.save(categoria);
    }

    /**
     * Método auxiliar para convertir de Categoria (Entidad JPA) a
     * RespuestaCategoria (DTO)
     */
    private RespuestaCategoria mapearADTO(Categoria categoria) {
        return new RespuestaCategoria(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion(),
                categoria.getUrlImagen(),
                categoria.getActivo());
    }
}
