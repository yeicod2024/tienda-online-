package com.tienda.modulos.inventario.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para la solicitud de actualización del stock de inventario.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudActualizarInventario {

    @NotNull(message = "La cantidad no puede ser nula")
    @Min(value = 0, message = "La cantidad de inventario no puede ser negativa")
    private Integer cantidad;
}
