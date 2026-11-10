package com.tienda.modulos.pedidos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO principal para la solicitud de creación de un pedido (cabecera + renglones).
 * Permite recibir tanto un ID de dirección previa como la dirección en texto ingresada en el checkout.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCrearPedido {

    // ID opcional de una dirección guardada previamente en la base de datos
    private Long direccionId;

    // Dirección formateada ingresada directamente por el cliente en el formulario
    private String direccionEnvio;

    // Método de pago seleccionado (CONTRA_ENTREGA, TRANSFERENCIA, etc.)
    private String metodoPago;

    // Teléfono de contacto ingresado en la orden
    private String telefonoContacto;

    // Notas adicionales para la entrega
    private String notas;

    // Lista de productos solicitados con sus cantidades
    @NotEmpty(message = "El pedido debe contener al menos un producto")
    @Valid
    private List<SolicitudDetallePedido> detalles;
}

