package com.tienda.modulos.productos;

import com.tienda.modulos.productos.dto.RespuestaImagenProducto;
import com.tienda.modulos.productos.dto.RespuestaProducto;
import com.tienda.modulos.productos.dto.SolicitudProducto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controlador REST para la gestión del catálogo de Productos y sus Imágenes.
 * Ruta base: http://localhost:8080/api/productos
 */
@RestController
@RequestMapping("/api/productos")
public class ControladorProducto {

    private final ServicioProducto servicioProducto;

    public ControladorProducto(ServicioProducto servicioProducto) {
        this.servicioProducto = servicioProducto;
    }

    /**
     * Obtiene la lista de todos los productos activos.
     * Acceso: Público
     * HTTP GET /api/productos
     */
    @GetMapping
    public ResponseEntity<List<RespuestaProducto>> obtenerTodos() {
        List<RespuestaProducto> productos = servicioProducto.obtenerTodos();
        return ResponseEntity.ok(productos);
    }

    /**
     * Obtiene el detalle de un producto por su ID.
     * Acceso: Público
     * HTTP GET /api/productos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<RespuestaProducto> obtenerPorId(@PathVariable Long id) {
        RespuestaProducto producto = servicioProducto.obtenerPorId(id);
        return ResponseEntity.ok(producto);
    }

    /**
     * Busca productos por coincidencia parcial en el nombre.
     * Acceso: Público
     * HTTP GET /api/productos/buscar?nombre=laptop
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<RespuestaProducto>> buscarPorNombre(@RequestParam String nombre) {
        List<RespuestaProducto> productos = servicioProducto.buscarPorNombre(nombre);
        return ResponseEntity.ok(productos);
    }

    /**
     * Obtiene todos los productos de una categoría específica.
     * Acceso: Público
     * HTTP GET /api/productos/categoria/{categoriaId}
     */
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<RespuestaProducto>> obtenerPorCategoria(@PathVariable Long categoriaId) {
        List<RespuestaProducto> productos = servicioProducto.obtenerPorCategoria(categoriaId);
        return ResponseEntity.ok(productos);
    }

    /**
     * Crea un nuevo producto en el catálogo.
     * HTTP POST /api/productos
     */
    @PostMapping
    public ResponseEntity<RespuestaProducto> crear(@Valid @RequestBody SolicitudProducto solicitud) {
        RespuestaProducto nuevoProducto = servicioProducto.crear(solicitud);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    /**
     * Actualiza los datos de un producto existente.
     * HTTP PUT /api/productos/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<RespuestaProducto> actualizar(@PathVariable Long id,
                                                         @Valid @RequestBody SolicitudProducto solicitud) {
        RespuestaProducto productoActualizado = servicioProducto.actualizar(id, solicitud);
        return ResponseEntity.ok(productoActualizado);
    }

    /**
     * Desactiva lógicamente un producto del catálogo.
     * HTTP DELETE /api/productos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicioProducto.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Sube y asocia una nueva imagen a un producto existente.
     * HTTP POST /api/productos/{id}/imagenes
     */
    @PostMapping("/{id}/imagenes")
    public ResponseEntity<RespuestaImagenProducto> subirImagen(
            @PathVariable Long id,
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam(value = "esPrincipal", required = false, defaultValue = "false") Boolean esPrincipal) {
        
        RespuestaImagenProducto nuevaImagen = servicioProducto.subirImagen(id, archivo, esPrincipal);
        return new ResponseEntity<>(nuevaImagen, HttpStatus.CREATED);
    }

    /**
     * Elimina una imagen por su ID.
     * HTTP DELETE /api/productos/imagenes/{imagenId}
     */
    @DeleteMapping("/imagenes/{imagenId}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long imagenId) {
        servicioProducto.eliminarImagen(imagenId);
        return ResponseEntity.noContent().build();
    }

}
