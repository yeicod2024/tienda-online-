package com.tienda.modulos.productos;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

/**
 * Servicio encargado de gestionar el almacenamiento físico de imágenes en el disco local del servidor.
 */
@Service
public class ServicioAlmacenamientoImagen {

    private final Path directorioSubidas;

    public ServicioAlmacenamientoImagen(@Value("${app.directorio-imagenes:uploads}") String directorioImagenes) {
        this.directorioSubidas = Paths.get(directorioImagenes).toAbsolutePath().normalize();
        crearDirectorioSiNoExiste();
    }

    /**
     * Asegura que la carpeta de destino exista en el sistema de archivos al arrancar.
     */
    private void crearDirectorioSiNoExiste() {
        try {
            if (!Files.exists(this.directorioSubidas)) {
                Files.createDirectories(this.directorioSubidas);
            }
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio para almacenar imágenes subidas", e);
        }
    }

    /**
     * Guarda un archivo de imagen en el disco y retorna la ruta pública accesible.
     *
     * @param archivo El archivo cargado desde el controlador (MultipartFile)
     * @return Ruta relativa del archivo guardado (ej: /uploads/uuid.png)
     */
    public String guardarImagen(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("No se puede guardar un archivo vacío");
        }

        // Validar tipo de contenido básico (debe ser una imagen)
        String tipoContenido = archivo.getContentType();
        if (tipoContenido == null || !tipoContenido.startsWith("image/")) {
            throw new IllegalArgumentException("El archivo proporcionado debe ser una imagen válida (JPEG, PNG, WEBP, etc.)");
        }

        // Obtener extensión del archivo original
        String nombreOriginal = archivo.getOriginalFilename();
        String extension = "";
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        } else {
            extension = ".jpg";
        }

        // Generar nombre único usando UUID para evitar colisiones
        String nombreUnico = UUID.randomUUID().toString() + extension;

        try {
            Path destino = this.directorioSubidas.resolve(nombreUnico);
            
            try (InputStream inputStream = archivo.getInputStream()) {
                Files.copy(inputStream, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            // Devolver la URL/ruta con la que se accederá desde la web
            return "/uploads/" + nombreUnico;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo de imagen en el servidor", e);
        }
    }

    /**
     * Elimina el archivo de imagen del disco si existe.
     *
     * @param urlImagen Ruta o URL de la imagen guardada
     */
    public void eliminarImagen(String urlImagen) {
        if (urlImagen == null || urlImagen.isBlank()) {
            return;
        }

        // Extraer solo el nombre del archivo de la URL (ej: de "/uploads/abc.jpg" se obtiene "abc.jpg")
        String nombreArchivo = urlImagen.substring(urlImagen.lastIndexOf('/') + 1);
        Path rutaArchivo = this.directorioSubidas.resolve(nombreArchivo).normalize();

        try {
            if (Files.exists(rutaArchivo)) {
                Files.delete(rutaArchivo);
            }
        } catch (IOException e) {
            // Loguear o manejar el fallo al eliminar del disco de ser necesario
            System.err.println("No se pudo eliminar el archivo físico: " + rutaArchivo);
        }
    }
}
