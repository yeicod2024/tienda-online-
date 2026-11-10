package com.tienda.modulos.inventario;

import com.tienda.modulos.inventario.dto.RespuestaInventario;
import com.tienda.modulos.inventario.dto.SolicitudActualizarInventario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión del inventario y control del stock.
 */
@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
public class ControladorInventario {

    private final ServicioInventario servicioInventario;

    /**
     * Obtiene el registro completo de inventarios.
     * Accesible por administradores.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RespuestaInventario>> obtenerTodoElInventario() {
        List<RespuestaInventario> inventario = servicioInventario.obtenerTodoElInventario();
        return ResponseEntity.ok(inventario);
    }

    /**
     * Obtiene la disponibilidad de stock de un producto específico.
     * Accesible de forma pública o para usuarios autenticados.
     */
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<RespuestaInventario> obtenerInventarioPorProductoId(@PathVariable Long productoId) {
        RespuestaInventario respuesta = servicioInventario.obtenerInventarioPorProductoId(productoId);
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Actualiza o establece las unidades disponibles de un producto.
     * Accesible únicamente por administradores.
     */
    @PutMapping("/producto/{productoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RespuestaInventario> actualizarInventario(
            @PathVariable Long productoId,
            @Valid @RequestBody SolicitudActualizarInventario solicitud) {
        RespuestaInventario respuesta = servicioInventario.actualizarInventario(productoId, solicitud);
        return ResponseEntity.ok(respuesta);
    }
}
