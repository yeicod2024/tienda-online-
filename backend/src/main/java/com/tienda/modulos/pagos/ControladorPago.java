package com.tienda.modulos.pagos;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.modulos.pagos.dto.RespuestaPago;
import com.tienda.modulos.pagos.dto.SolicitudProcesarPago;
import com.tienda.modulos.usuarios.RepositorioUsuario;
import com.tienda.modulos.usuarios.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestionar el procesamiento y consulta de cobros y pagos.
 */
@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class ControladorPago {

    private final ServicioPago servicioPago;
    private final RepositorioUsuario repositorioUsuario;

    /**
     * Procesa el cobro de un pedido.
     */
    @PostMapping("/procesar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RespuestaPago> procesarPago(
            Authentication autenticacion,
            @Valid @RequestBody SolicitudProcesarPago solicitud) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        RespuestaPago respuesta = servicioPago.procesarPago(usuarioId, solicitud);
        return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
    }

    /**
     * Obtiene la información del pago efectuado para un pedido.
     */
    @GetMapping("/pedido/{pedidoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RespuestaPago> obtenerPagoPorPedidoId(
            Authentication autenticacion,
            @PathVariable Long pedidoId) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        RespuestaPago respuesta = servicioPago.obtenerPagoPorPedidoId(usuarioId, pedidoId);
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Obtiene el ID del usuario desde la autenticación JWT.
     */
    private Long obtenerIdUsuarioAutenticado(Authentication autenticacion) {
        String correo = autenticacion.getName();
        Usuario usuario = repositorioUsuario.findByCorreo(correo)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Usuario no encontrado con el correo: " + correo));
        return usuario.getId();
    }
}
