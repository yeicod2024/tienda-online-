package com.tienda.modulos.clientes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO para devolver los datos del perfil del cliente en la API REST.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaCliente {

    private Long id;
    private Long usuarioId;
    private String correoUsuario;
    private String nombre;
    private String apellido;
    private String telefono;
    private LocalDateTime creadoEn;
}
