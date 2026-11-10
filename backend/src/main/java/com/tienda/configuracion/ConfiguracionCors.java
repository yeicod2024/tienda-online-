package com.tienda.configuracion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración Global de CORS para permitir la comunicación entre React y Spring Boot.
 */
@Configuration
public class ConfiguracionCors {

    @Bean
    public WebMvcConfigurer configuradorCors() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registro) {
                registro.addMapping("/**") // Aplica a todos los endpoints de la API
                        // Permitir solicitudes desde localhost y 127.0.0.1 en cualquier puerto de desarrollo
                        .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                        // Métodos HTTP permitidos
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                        // Encabezados permitidos (incluyendo Authorization para los tokens JWT)
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true);
            }
        };
    }
}

