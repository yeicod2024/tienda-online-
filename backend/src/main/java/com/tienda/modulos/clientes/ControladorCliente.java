package com.tienda.modulos.clientes;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.modulos.clientes.dto.RespuestaCliente;
import com.tienda.modulos.clientes.dto.RespuestaDireccion;
import com.tienda.modulos.clientes.dto.SolicitudCliente;
import com.tienda.modulos.clientes.dto.SolicitudDireccion;
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
 * Controlador REST para gestionar el perfil del cliente y sus direcciones.
 */
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ControladorCliente {

    private final ServicioCliente servicioCliente;
    private final RepositorioUsuario repositorioUsuario;

    /**
     * Obtiene la lista completa de clientes registrados en la tienda.
     * HTTP GET /api/clientes
     */
    @GetMapping
    public ResponseEntity<List<RespuestaCliente>> obtenerTodos() {
        List<RespuestaCliente> clientes = servicioCliente.obtenerTodos();
        return ResponseEntity.ok(clientes);
    }

    /**
     * Elimina la cuenta y perfil del cliente autenticado.
     * HTTP DELETE /api/clientes/perfil
     */
    @DeleteMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> eliminarMiCuenta(Authentication autenticacion) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        servicioCliente.eliminarCuenta(usuarioId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene el perfil del cliente autenticado.
     */
    @GetMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RespuestaCliente> obtenerPerfil(Authentication autenticacion) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        RespuestaCliente respuesta = servicioCliente.obtenerPerfilPorUsuarioId(usuarioId);
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Actualiza o crea el perfil del cliente autenticado.
     */
    @PutMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RespuestaCliente> actualizarPerfil(
            Authentication autenticacion,
            @Valid @RequestBody SolicitudCliente solicitud) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        RespuestaCliente respuesta = servicioCliente.actualizarPerfil(usuarioId, solicitud);
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Obtiene todas las direcciones de envío del cliente autenticado.
     */
    @GetMapping("/direcciones")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RespuestaDireccion>> obtenerDirecciones(Authentication autenticacion) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        List<RespuestaDireccion> direcciones = servicioCliente.obtenerDirecciones(usuarioId);
        return ResponseEntity.ok(direcciones);
    }

    /**
     * Agrega una nueva dirección de envío para el cliente autenticado.
     */
    @PostMapping("/direcciones")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RespuestaDireccion> agregarDireccion(
            Authentication autenticacion,
            @Valid @RequestBody SolicitudDireccion solicitud) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        RespuestaDireccion respuesta = servicioCliente.agregarDireccion(usuarioId, solicitud);
        return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
    }

    /**
     * Elimina una dirección de envío por su ID.
     */
    @DeleteMapping("/direcciones/{direccionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> eliminarDireccion(
            Authentication autenticacion,
            @PathVariable Long direccionId) {
        Long usuarioId = obtenerIdUsuarioAutenticado(autenticacion);
        servicioCliente.eliminarDireccion(usuarioId, direccionId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene el ID del usuario desde el objeto Authentication de Spring Security.
     */
    private Long obtenerIdUsuarioAutenticado(Authentication autenticacion) {
        String correo = autenticacion.getName();
        Usuario usuario = repositorioUsuario.findByCorreo(correo)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Usuario no encontrado con el correo: " + correo));
        return usuario.getId();
    }
}
