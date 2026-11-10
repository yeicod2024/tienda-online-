package com.tienda.configuracion;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Clase ConfiguracionRecursosEstaticos: Expone el directorio local de archivos como recursos estáticos vía HTTP.
 */
@Configuration
public class ConfiguracionRecursosEstaticos implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads/productos}")
    private String rutaDirectorioArchivos;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registro) {
        Path directorioPath = Paths.get(rutaDirectorioArchivos).toAbsolutePath().normalize();
        String rutaAbsolutaUri = directorioPath.toUri().toString();

        // Mapear la ruta web /archivos/productos/** a la carpeta física del disco local
        registro.addResourceHandler("/archivos/productos/**")
                .addResourceLocations(rutaAbsolutaUri + "/");
    }
}
