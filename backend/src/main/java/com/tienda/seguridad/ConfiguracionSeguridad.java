package com.tienda.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Clase de Configuración Principal de Spring Security.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class ConfiguracionSeguridad {

    private final PuntoEntradaAutenticacionJwt puntoEntradaAutenticacion;
    private final FiltroAutenticacionJwt filtroAutenticacionJwt;

    public ConfiguracionSeguridad(PuntoEntradaAutenticacionJwt puntoEntradaAutenticacion,
                                 FiltroAutenticacionJwt filtroAutenticacionJwt) {
        this.puntoEntradaAutenticacion = puntoEntradaAutenticacion;
        this.filtroAutenticacionJwt = filtroAutenticacionJwt;
    }

    @Bean
    public static PasswordEncoder codificadorContrasena() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager administradorAutenticacion(AuthenticationConfiguration configuracion) throws Exception {
        return configuracion.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain cadenaFiltrosSeguridad(HttpSecurity http) throws Exception {
        http
            // Habilitar la configuración global de CORS para solicitudes entre orígenes (React localhost:5173 -> Spring Boot localhost:8080)
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(excepcion -> excepcion
                .authenticationEntryPoint(puntoEntradaAutenticacion)
            )
            .sessionManagement(sesion -> sesion
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(autorizar -> autorizar
                // Endpoints públicos de Autenticación
                .requestMatchers("/api/autenticacion/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // Acceso a Productos, Categorías, Pedidos, Pagos, Clientes y Archivos
                .requestMatchers("/api/productos/**").permitAll()
                .requestMatchers("/api/categorias/**").permitAll()
                .requestMatchers("/api/pedidos/**").permitAll()
                .requestMatchers("/api/pagos/**").permitAll()
                .requestMatchers("/api/clientes/**").permitAll()
                .requestMatchers("/archivos/**").permitAll()



                .anyRequest().authenticated()
            );

        http.addFilterBefore(filtroAutenticacionJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

