package com.tienda.modulos.clientes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para la creación o actualización de una dirección de envío.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudDireccion {

    @NotBlank(message = "La calle es obligatoria")
    @Size(max = 255, message = "La calle no puede superar los 255 caracteres")
    private String calle;

    @NotBlank(message = "La ciudad es obligatoria")
    @Size(max = 100, message = "La ciudad no puede superar los 100 caracteres")
    private String ciudad;

    @NotBlank(message = "El estado o provincia es obligatorio")
    @Size(max = 100, message = "El estado no puede superar los 100 caracteres")
    private String estado;

    @NotBlank(message = "El código postal es obligatorio")
    @Size(max = 20, message = "El código postal no puede superar los 20 caracteres")
    private String codigoPostal;

    @NotBlank(message = "El país es obligatorio")
    @Size(max = 100, message = "El país no puede superar los 100 caracteres")
    private String pais;

    private Boolean esPredeterminada = false;
}
