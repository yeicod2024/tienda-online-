package com.tienda.modulos.autenticacion;

import com.tienda.modulos.autenticacion.dto.RespuestaAutenticacion;
import com.tienda.modulos.autenticacion.dto.SolicitudLogin;
import com.tienda.modulos.autenticacion.dto.SolicitudRegistro;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para gestionar la autenticación y registro de usuarios.
 * URL base: http://localhost:8081/api/autenticacion
 */
@RestController
@RequestMapping("/api/autenticacion")
public class ControladorAutenticacion {

    private final ServicioAutenticacion servicioAutenticacion;

    public ControladorAutenticacion(ServicioAutenticacion servicioAutenticacion) {
        this.servicioAutenticacion = servicioAutenticacion;
    }

    /**
     * Endpoint para el inicio de sesión (Login).
     * HTTP Method: POST /api/autenticacion/login
     */
    @PostMapping("/login")
    public ResponseEntity<RespuestaAutenticacion> iniciarSesion(@Valid @RequestBody SolicitudLogin solicitudLogin) {
        RespuestaAutenticacion respuesta = servicioAutenticacion.iniciarSesion(solicitudLogin);
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Endpoint para el registro de un nuevo cliente.
     * HTTP Method: POST /api/autenticacion/registro
     */
    @PostMapping("/registro")
    public ResponseEntity<RespuestaAutenticacion> registrar(@Valid @RequestBody SolicitudRegistro solicitudRegistro) {
        RespuestaAutenticacion respuesta = servicioAutenticacion.registrar(solicitudRegistro);
        return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
    }
}
