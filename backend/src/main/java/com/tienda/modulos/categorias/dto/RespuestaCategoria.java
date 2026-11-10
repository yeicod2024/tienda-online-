package com.tienda.modulos.categorias.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO que representa la respuesta estructurada de una Categoría enviada al cliente.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaCategoria {

    /**
     * Identificador único de la categoría.
     */
    private Long id;

    /**
     * Nombre de la categoría.
     */
    private String nombre;

    /**
     * Descripción detallada de la categoría.
     */
    private String descripcion;

    /**
     * URL de la imagen de portada de la categoría.
     */
    private String urlImagen;

    /**
     * Estado activo/inactivo de la categoría.
     */
    private Boolean activo;
}
