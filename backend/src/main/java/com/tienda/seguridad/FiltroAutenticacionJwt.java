package com.tienda.seguridad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de Seguridad HTTP que intercepta cada solicitud entrante para extraer y validar el Token JWT.
 */
@Component
public class FiltroAutenticacionJwt extends OncePerRequestFilter {

    private final ProveedorTokenJwt proveedorToken;
    private final ServicioDetallesUsuarioPersonalizado servicioDetallesUsuario;

    public FiltroAutenticacionJwt(ProveedorTokenJwt proveedorToken,
                                  ServicioDetallesUsuarioPersonalizado servicioDetallesUsuario) {
        this.proveedorToken = proveedorToken;
        this.servicioDetallesUsuario = servicioDetallesUsuario;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest solicitud,
                                    HttpServletResponse respuesta,
                                    FilterChain cadenaFiltros) throws ServletException, IOException {

        String token = obtenerJwtDeSolicitud(solicitud);

        if (StringUtils.hasText(token) && proveedorToken.validarToken(token)) {
            String correo = proveedorToken.obtenerCorreoDesdeJWT(token);
            UserDetails detallesUsuario = servicioDetallesUsuario.loadUserByUsername(correo);

            UsernamePasswordAuthenticationToken tokenAutenticacion = new UsernamePasswordAuthenticationToken(
                    detallesUsuario,
                    null,
                    detallesUsuario.getAuthorities()
            );

            tokenAutenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(solicitud));
            SecurityContextHolder.getContext().setAuthentication(tokenAutenticacion);
        }

        cadenaFiltros.doFilter(solicitud, respuesta);
    }

    private String obtenerJwtDeSolicitud(HttpServletRequest solicitud) {
        String tokenBearer = solicitud.getHeader("Authorization");
        if (StringUtils.hasText(tokenBearer) && tokenBearer.startsWith("Bearer ")) {
            return tokenBearer.substring(7);
        }
        return null;
    }
}
