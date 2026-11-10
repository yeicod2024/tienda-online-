package com.tienda.modulos.pedidos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO que representa un renglón o ítem individual al crear un pedido.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudDetallePedido {

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad mínima a comprar es 1")
    private Integer cantidad;
}
