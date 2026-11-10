package com.tienda.modulos.pagos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para devolver la información formateada de una transacción de pago en la API REST.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaPago {

    private Long id;
    private Long pedidoId;
    private String idPagoStripe;
    private BigDecimal monto;
    private String moneda;
    private String estado;
    private String metodo;
    private LocalDateTime creadoEn;
}
