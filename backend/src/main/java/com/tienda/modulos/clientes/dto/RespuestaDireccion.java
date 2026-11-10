package com.tienda.modulos.clientes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para devolver la información de una dirección de envío en la API REST.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaDireccion {

    private Long id;
    private Long clienteId;
    private String calle;
    private String ciudad;
    private String estado;
    private String codigoPostal;
    private String pais;
    private Boolean esPredeterminada;
}
