package com.tienda.seguridad;

import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * Utilidad encargada de la generación, decodificación y validación de Tokens JWT.
 */
@Component
public class ProveedorTokenJwt {

    @Value("${app.jwt-secret}")
    private String claveSecretaJwt;

    @Value("${app.jwt-expiration-milliseconds}")
    private long tiempoExpiracionJwt;

    private Key clave() {
        return Keys.hmacShaKeyFor(claveSecretaJwt.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Genera un Token JWT firmado digitalmente para el usuario autenticado.
     * 
     * @param autenticacion Objeto que contiene los datos del usuario autenticado en Spring Security
     * @return Cadena de texto encriptada con el token JWT
     */
    public String generarToken(Authentication autenticacion) {
        String correo = autenticacion.getName(); // Obtenemos el correo del usuario

        Date fechaActual = new Date();
        Date fechaExpiracion = new Date(fechaActual.getTime() + tiempoExpiracionJwt);

        return Jwts.builder()
                .setSubject(correo)
                .setIssuedAt(new Date())
                .setExpiration(fechaExpiracion)
                .signWith(clave(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Obtiene el correo del usuario contenido dentro de un Token JWT.
     * 
     * @param token El token JWT recibido
     * @return El correo extraído del token
     */
    public String obtenerCorreoDesdeJWT(String token) {
        Claims reclamos = Jwts.parserBuilder()
                .setSigningKey(clave())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return reclamos.getSubject();
    }

    /**
     * Valida si un Token JWT es auténtico y no ha expirado.
     * 
     * @param token El token a verificar
     * @return true si el token es válido
     */
    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(clave())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException ex) {
            throw new ExcepcionSolicitudIncorrecta("Token JWT inválido o mal formado");
        } catch (ExpiredJwtException ex) {
            throw new ExcepcionSolicitudIncorrecta("El Token JWT ha expirado");
        } catch (UnsupportedJwtException ex) {
            throw new ExcepcionSolicitudIncorrecta("Token JWT no soportado");
        } catch (IllegalArgumentException ex) {
            throw new ExcepcionSolicitudIncorrecta("La clave o cadena JWT está vacía");
        }
    }
}
