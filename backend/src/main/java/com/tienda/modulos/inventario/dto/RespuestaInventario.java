package com.tienda.modulos.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO para enviar la información del inventario de un producto hacia el cliente.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaInventario {

    private Long id;
    private Long productoId;
    private String nombreProducto;
    private Integer cantidad;
    private LocalDateTime actualizadoEn;
}
