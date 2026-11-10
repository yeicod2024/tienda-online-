package com.tienda.modulos.productos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO que representa los datos de la imagen de un producto enviados al cliente.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaImagenProducto {

    private Long id;
    private String urlImagen;
    private Boolean esPrincipal;
    private Integer ordenVisualizacion;
}
