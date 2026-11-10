package com.tienda.seguridad;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Manejador de excepciones no autorizadas (HTTP 401 Unauthorized).
 */
@Component
public class PuntoEntradaAutenticacionJwt implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest solicitud,
                         HttpServletResponse respuesta,
                         AuthenticationException excepcionAutenticacion) throws IOException, ServletException {

        respuesta.setContentType("application/json;charset=UTF-8");
        respuesta.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String respuestaJson = String.format(
                "{\"marcaTiempo\":\"%s\",\"estado\":401,\"error\":\"No Autorizado\",\"mensaje\":\"Acceso denegado. No está autenticado o el token JWT es inválido.\"}",
                java.time.LocalDateTime.now()
        );

        respuesta.getWriter().write(respuestaJson);
    }
}
