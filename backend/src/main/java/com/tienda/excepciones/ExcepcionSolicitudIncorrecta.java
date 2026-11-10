package com.tienda.excepciones;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción personalizada para errores del cliente o validaciones de negocio (400 Bad Request)
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ExcepcionSolicitudIncorrecta extends RuntimeException {

    public ExcepcionSolicitudIncorrecta(String mensaje) {
        super(mensaje);
    }
}
