package com.tienda.modulos.productos.dto;

import com.tienda.modulos.categorias.dto.RespuestaCategoria;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO que representa la respuesta estructurada de un Producto enviada al cliente.
 * Incluye atributos de conveniencia directa (categoriaNombre, urlImagen, stock)
 * para facilitar el renderizado directo en la plataforma React.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaProducto {

    private Long id;
    private RespuestaCategoria categoria;
    private String categoriaNombre;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String sku;
    private Boolean activo;
    private String urlImagen;
    private Integer stock;
    private List<RespuestaImagenProducto> imagenes;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}

