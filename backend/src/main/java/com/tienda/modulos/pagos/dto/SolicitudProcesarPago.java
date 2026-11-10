package com.tienda.modulos.pagos.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para solicitar el procesamiento del pago de un pedido determinado.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudProcesarPago {

    @NotNull(message = "El ID del pedido es obligatorio")
    private Long pedidoId;

    private String metodo = "TARJETA";

    private String tokenSimulado;
}
