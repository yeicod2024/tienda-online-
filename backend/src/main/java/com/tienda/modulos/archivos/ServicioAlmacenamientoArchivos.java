package com.tienda.modulos.archivos;

import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * ServicioAlmacenamientoArchivos: Gestiona el almacenamiento de imágenes en el disco local del servidor.
 */
@Service
public class ServicioAlmacenamientoArchivos {

    private final Path directorioRaizAlmacenamiento;

    public ServicioAlmacenamientoArchivos(@Value("${app.upload.dir:uploads/productos}") String rutaDirectorio) {
        this.directorioRaizAlmacenamiento = Paths.get(rutaDirectorio).toAbsolutePath().normalize();

        try {
            // Crear el directorio de uploads si no existe al arrancar la aplicación
            Files.createDirectories(this.directorioRaizAlmacenamiento);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar la carpeta para subir archivos: " + rutaDirectorio, e);
        }
    }

    /**
     * Guarda un archivo de imagen recibido en el disco y retorna su nombre generado.
     * 
     * @param archivoImagen Objeto MultipartFile recibido en la petición HTTP
     * @return Nombre único del archivo guardado (ej. "a8b9c1d2-foto.png")
     */
    public String almacenarArchivo(MultipartFile archivoImagen) {
        if (archivoImagen == null || archivoImagen.isEmpty()) {
            throw new ExcepcionSolicitudIncorrecta("No se puede almacenar un archivo vacío");
        }

        // Obtener el nombre original y sanitizar la extensión
        String nombreOriginal = archivoImagen.getOriginalFilename();
        if (nombreOriginal == null || !nombreOriginal.contains(".")) {
            throw new ExcepcionSolicitudIncorrecta("El archivo debe tener una extensión válida (.jpg, .png, .webp)");
        }

        String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf(".")).toLowerCase();
        if (!extension.matches("\\.(jpg|jpeg|png|webp|gif)$")) {
            throw new ExcepcionSolicitudIncorrecta("Formato de archivo no permitido. Solo se aceptan imágenes (.jpg, .png, .webp, .gif)");
        }

        // Generar nombre único con UUID para prevenir colisiones de nombres de archivos
        String nombreUnico = UUID.randomUUID().toString() + extension;

        try {
            Path destinoFinal = this.directorioRaizAlmacenamiento.resolve(nombreUnico);
            
            try (InputStream flujoEntrada = archivoImagen.getInputStream()) {
                Files.copy(flujoEntrada, destinoFinal, StandardCopyOption.REPLACE_EXISTING);
            }

            return nombreUnico;
        } catch (IOException excepcion) {
            throw new RuntimeException("Error al guardar el archivo de imagen en el servidor", excepcion);
        }
    }

    /**
     * Elimina una imagen del disco local por su nombre.
     * 
     * @param nombreArchivo Nombre del archivo almacenado
     * @return true si fue eliminado correctamente
     */
    public boolean eliminarArchivo(String nombreArchivo) {
        try {
            Path rutaArchivo = this.directorioRaizAlmacenamiento.resolve(nombreArchivo).normalize();
            return Files.deleteIfExists(rutaArchivo);
        } catch (IOException e) {
            return false;
        }
    }
}
