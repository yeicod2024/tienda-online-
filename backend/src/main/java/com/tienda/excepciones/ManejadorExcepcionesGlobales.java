package com.tienda.excepciones;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * ControllerAdvice Global: Intercepta cualquier excepción no controlada en los Controladores
 * y devuelve respuestas JSON limpias y estandarizadas al cliente.
 */
@RestControllerAdvice
public class ManejadorExcepcionesGlobales {

    /**
     * Captura credenciales erróneas en el Login y devuelve HTTP 401
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> manejarCredencialesErroneas(BadCredentialsException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("marcaTiempo", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.UNAUTHORIZED.value());
        respuesta.put("error", "No Autorizado");
        respuesta.put("mensaje", "La contraseña o el correo electrónico son incorrectos. Por favor verifique sus datos.");

        return new ResponseEntity<>(respuesta, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Captura ExcepcionRecursoNoEncontrado y devuelve HTTP 404
     */
    @ExceptionHandler(ExcepcionRecursoNoEncontrado.class)
    public ResponseEntity<Map<String, Object>> manejarExcepcionRecursoNoEncontrado(ExcepcionRecursoNoEncontrado ex) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("marcaTiempo", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.NOT_FOUND.value());
        respuesta.put("error", "Recurso no encontrado");
        respuesta.put("mensaje", ex.getMessage());

        return new ResponseEntity<>(respuesta, HttpStatus.NOT_FOUND);
    }

    /**
     * Captura ExcepcionSolicitudIncorrecta y devuelve HTTP 400
     */
    @ExceptionHandler(ExcepcionSolicitudIncorrecta.class)
    public ResponseEntity<Map<String, Object>> manejarExcepcionSolicitudIncorrecta(ExcepcionSolicitudIncorrecta ex) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("marcaTiempo", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.BAD_REQUEST.value());
        respuesta.put("error", "Solicitud incorrecta");
        respuesta.put("mensaje", ex.getMessage());

        return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura cualquier otra excepción imprevista y devuelve HTTP 500
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarExcepcionGlobal(Exception ex) {
        ex.printStackTrace();
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("marcaTiempo", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.INTERNAL_SERVER_ERROR.value());
        respuesta.put("error", "Error interno del servidor");
        respuesta.put("mensaje", ex.getMessage());

        return new ResponseEntity<>(respuesta, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

