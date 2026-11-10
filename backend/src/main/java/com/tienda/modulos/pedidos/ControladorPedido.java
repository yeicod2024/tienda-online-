package com.tienda.modulos.pedidos;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.modulos.pedidos.dto.RespuestaPedido;
import com.tienda.modulos.pedidos.dto.SolicitudCrearPedido;
import com.tienda.modulos.usuarios.RepositorioUsuario;
import com.tienda.modulos.usuarios.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión y creación de pedidos de compra.
 */
@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class ControladorPedido {

    private final ServicioPedido servicioPedido;
    private final RepositorioUsuario repositorioUsuario;

    /**
     * Crea un nuevo pedido para el usuario cliente autenticado.
     */
    @PostMapping
    public ResponseEntity<RespuestaPedido> crearPedido(
            Authentication autenticacion,
            @Valid @RequestBody SolicitudCrearPedido solicitud) {
        Long usuarioId = autenticacion != null ? obtenerIdUsuarioAutenticado(autenticacion) : 1L;
        RespuestaPedido respuesta = servicioPedido.crearPedido(usuarioId, solicitud);
        return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
    }

    /**
     * Obtiene el historial de pedidos del cliente autenticado.
     */
    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<RespuestaPedido>> obtenerMisPedidos(Authentication autenticacion) {
        Long usuarioId = autenticacion != null ? obtenerIdUsuarioAutenticado(autenticacion) : 1L;
        List<RespuestaPedido> misPedidos = servicioPedido.obtenerPedidosPorCliente(usuarioId);
        return ResponseEntity.ok(misPedidos);
    }

    /**
     * Obtiene un pedido específico por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RespuestaPedido> obtenerPedidoPorId(
            Authentication autenticacion,
            @PathVariable Long id) {
        Long usuarioId = autenticacion != null ? obtenerIdUsuarioAutenticado(autenticacion) : 1L;
        RespuestaPedido respuesta = servicioPedido.obtenerPedidoPorId(usuarioId, id);
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Obtiene todos los pedidos realizados en la tienda (Acceso exclusivo Administrador).
     */
    @GetMapping
    public ResponseEntity<List<RespuestaPedido>> obtenerTodosLosPedidos() {
        List<RespuestaPedido> pedidos = servicioPedido.obtenerTodosLosPedidos();
        return ResponseEntity.ok(pedidos);
    }

    /**
     * Cambia el estado de un pedido (Acceso exclusivo Administrador).
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<RespuestaPedido> cambiarEstadoPedido(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        RespuestaPedido respuesta = servicioPedido.cambiarEstadoPedido(id, nuevoEstado);
        return ResponseEntity.ok(respuesta);
    }


    /**
     * Método auxiliar para extraer el ID del usuario desde la autenticación JWT.
     */
    private Long obtenerIdUsuarioAutenticado(Authentication autenticacion) {
        String correo = autenticacion.getName();
        Usuario usuario = repositorioUsuario.findByCorreo(correo)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Usuario no encontrado con el correo: " + correo));
        return usuario.getId();
    }
}
