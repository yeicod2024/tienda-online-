package com.tienda.modulos.categorias;

import com.tienda.modulos.categorias.dto.RespuestaCategoria;
import com.tienda.modulos.categorias.dto.SolicitudCategoria;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de Categorías.
 * Ruta base: http://localhost:8080/api/categorias
 */
@RestController
@RequestMapping("/api/categorias")
public class ControladorCategoria {

    private final ServicioCategoria servicioCategoria;

    public ControladorCategoria(ServicioCategoria servicioCategoria) {
        this.servicioCategoria = servicioCategoria;
    }

    /**
     * Obtiene la lista de todas las categorías activas.
     * Acceso: Público
     * HTTP GET /api/categorias
     */
    @GetMapping
    public ResponseEntity<List<RespuestaCategoria>> obtenerTodas() {
        List<RespuestaCategoria> categorias = servicioCategoria.obtenerTodas();
        return ResponseEntity.ok(categorias);
    }

    /**
     * Obtiene los detalles de una categoría por su ID.
     * Acceso: Público
     * HTTP GET /api/categorias/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<RespuestaCategoria> obtenerPorId(@PathVariable Long id) {
        RespuestaCategoria categoria = servicioCategoria.obtenerPorId(id);
        return ResponseEntity.ok(categoria);
    }

    /**
     * Crea una nueva categoría.
     * Acceso: Solo Administradores (ROLE_ADMIN)
     * HTTP POST /api/categorias
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RespuestaCategoria> crear(@Valid @RequestBody SolicitudCategoria solicitud) {
        RespuestaCategoria nuevaCategoria = servicioCategoria.crear(solicitud);
        return new ResponseEntity<>(nuevaCategoria, HttpStatus.CREATED);
    }

    /**
     * Actualiza una categoría existente.
     * Acceso: Solo Administradores (ROLE_ADMIN)
     * HTTP PUT /api/categorias/{id}
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RespuestaCategoria> actualizar(@PathVariable Long id,
                                                          @Valid @RequestBody SolicitudCategoria solicitud) {
        RespuestaCategoria categoriaActualizada = servicioCategoria.actualizar(id, solicitud);
        return ResponseEntity.ok(categoriaActualizada);
    }

    /**
     * Desactiva lógicamente una categoría.
     * Acceso: Solo Administradores (ROLE_ADMIN)
     * HTTP DELETE /api/categorias/{id}
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicioCategoria.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
