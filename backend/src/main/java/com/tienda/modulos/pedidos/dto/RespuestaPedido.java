package com.tienda.modulos.pedidos.dto;

import com.tienda.modulos.clientes.dto.RespuestaDireccion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para enviar la información completa del pedido al cliente o administrador.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaPedido {

    private Long id;
    private Long clienteId;
    private String nombreCliente;
    private RespuestaDireccion direccionEnvio;
    private String estado;
    private BigDecimal total;
    private String notas;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
    private List<RespuestaDetallePedido> detalles;
}
