package com.tienda.configuracion;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuración Web MVC para mapear y servir archivos de imágenes subidos
 * desde el sistema de archivos local como recursos estáticos a través de HTTP.
 */
@Configuration
public class ConfiguracionRecursosWeb implements WebMvcConfigurer {

    @Value("${app.directorio-imagenes:uploads}")
    private String directorioImagenes;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obtener la ruta absoluta del directorio de imágenes
        Path rutaDirectorio = Paths.get(directorioImagenes).toAbsolutePath().normalize();
        
        // Convertir la ruta del sistema de archivos a un URI accesible por Spring (file:/...)
        String ubicacionRecursos = rutaDirectorio.toUri().toString();

        // Mapear peticiones HTTP que inicien con /uploads/** a la carpeta física de imágenes
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(ubicacionRecursos.endsWith("/") ? ubicacionRecursos : ubicacionRecursos + "/");
    }
}
