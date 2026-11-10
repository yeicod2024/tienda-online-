package com.tienda.modulos.autenticacion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO que representa la respuesta estructurada enviada al cliente tras autenticarse con éxito.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaAutenticacion {

    private String tokenAcceso;
    private String tipoToken = "Bearer";
    private String correo;
    private String rol;

    public RespuestaAutenticacion(String tokenAcceso, String correo, String rol) {
        this.tokenAcceso = tokenAcceso;
        this.correo = correo;
        this.rol = rol;
    }
}
