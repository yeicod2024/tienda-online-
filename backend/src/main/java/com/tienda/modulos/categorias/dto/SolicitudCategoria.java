package com.tienda.modulos.categorias.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para capturar los datos recibidos al crear o actualizar una Categoría.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCategoria {

    /**
     * Nombre de la categoría.
     * Validaciones:
     * - @NotBlank: No puede ser nulo ni estar vacío.
     * - @Size: Máximo 100 caracteres.
     */
    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(max = 100, message = "El nombre de la categoría no puede superar los 100 caracteres")
    private String nombre;

    /**
     * Descripción detallada de la categoría (opcional).
     */
    private String descripcion;

    /**
     * URL de la imagen representativa de la categoría.
     */
    @Size(max = 500, message = "La URL de la imagen no puede superar los 500 caracteres")
    private String urlImagen;

    /**
     * Estado activo/inactivo de la categoría.
     */
    private Boolean activo = true;
}
