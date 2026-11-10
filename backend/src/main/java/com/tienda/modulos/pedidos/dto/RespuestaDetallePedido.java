package com.tienda.modulos.pedidos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO para devolver la información formateada de un ítem/renglón del pedido en la API REST.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaDetallePedido {

    private Long id;
    private Long productoId;
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
