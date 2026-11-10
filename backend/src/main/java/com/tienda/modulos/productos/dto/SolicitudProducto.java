package com.tienda.modulos.productos.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO para capturar los datos recibidos al crear o actualizar un Producto.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudProducto {

    /**
     * ID de la categoría a la cual se asigna el producto (opcional si se envía categoriaNombre).
     */
    private Long categoriaId;

    /**
     * Nombre de la categoría a la cual se asigna el producto.
     */
    private String categoriaNombre;

    /**
     * Nombre comercial del producto.
     */
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 200, message = "El nombre del producto no puede superar los 200 caracteres")
    private String nombre;

    /**
     * Descripción detallada de las características del producto.
     */
    private String descripcion;

    /**
     * Precio de venta al público.
     */
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio no puede ser negativo")
    private BigDecimal precio;

    /**
     * Código SKU único del producto en inventario (opcional, generado automáticamente si falta).
     */
    private String sku;

    /**
     * Estado activo/inactivo del producto.
     */
    private Boolean activo = true;

    /**
     * Cantidad de stock disponible en inventario.
     */
    private Integer stock;

    /**
     * Cantidad de stock inicial asignada en el inventario al crear el producto (alias de stock).
     */
    private Integer stockInicial;

    /**
     * URL de la imagen principal del producto.
     */
    private String urlImagen;
}

