package com.tienda.modulos.archivos;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST ControladorArchivos: Endpoint para recibir y procesar la subida de imágenes al servidor.
 */
@RestController
@RequestMapping("/api/archivos")
public class ControladorArchivos {

    private final ServicioAlmacenamientoArchivos servicioAlmacenamientoArchivos;

    public ControladorArchivos(ServicioAlmacenamientoArchivos servicioAlmacenamientoArchivos) {
        this.servicioAlmacenamientoArchivos = servicioAlmacenamientoArchivos;
    }

    /**
     * Subir imagen de producto al servidor.
     * HTTP Method: POST /api/archivos/subir
     * 
     * @param archivo Objeto MultipartFile de la imagen recibida
     * @return Map JSON con urlImagen, nombreArchivo y mensaje de éxito
     */
    @PostMapping("/subir")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> subirImagenProducto(@RequestParam("archivo") MultipartFile archivo) {
        String nombreArchivoGenerado = servicioAlmacenamientoArchivos.almacenarArchivo(archivo);

        // Construir la URL pública de la imagen basada en la dirección actual del servidor
        String urlImagenCompleta = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/archivos/productos/")
                .path(nombreArchivoGenerado)
                .toUriString();

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Imagen subida exitosamente al servidor");
        respuesta.put("nombreArchivo", nombreArchivoGenerado);
        respuesta.put("urlImagen", urlImagenCompleta);

        return ResponseEntity.ok(respuesta);
    }
}
