package com.tienda.modulos.clientes;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import com.tienda.modulos.clientes.dto.RespuestaCliente;
import com.tienda.modulos.clientes.dto.RespuestaDireccion;
import com.tienda.modulos.clientes.dto.SolicitudCliente;
import com.tienda.modulos.clientes.dto.SolicitudDireccion;
import com.tienda.modulos.usuarios.RepositorioUsuario;
import com.tienda.modulos.usuarios.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio encargado de gestionar perfiles de cliente y sus direcciones de envío.
 */
@Service
@RequiredArgsConstructor
public class ServicioCliente {

    private final RepositorioCliente repositorioCliente;
    private final RepositorioDireccion repositorioDireccion;
    private final RepositorioUsuario repositorioUsuario;

    /**
     * Obtiene la lista completa de todos los clientes registrados en la tienda.
     * Consulta la tabla de clientes y la combina con los usuarios que poseen el rol ROLE_CLIENTE.
     */
    @Transactional(readOnly = true)
    public List<RespuestaCliente> obtenerTodos() {
        List<Cliente> clientes = repositorioCliente.findAll();
        List<RespuestaCliente> lista = new java.util.ArrayList<>();

        // 1. Agregar clientes con perfil completo
        for (Cliente cliente : clientes) {
            lista.add(mapearAClienteDto(cliente));
        }

        // 2. Agregar usuarios registrados con rol ROLE_CLIENTE que aún no tengan perfil en la tabla clientes
        List<Usuario> usuarios = repositorioUsuario.findAll();
        for (Usuario u : usuarios) {
            if (u.getRol() != null && "ROLE_CLIENTE".equalsIgnoreCase(u.getRol().getNombre())) {
                boolean yaExiste = clientes.stream()
                        .anyMatch(c -> c.getUsuario() != null && c.getUsuario().getId().equals(u.getId()));
                if (!yaExiste) {
                    lista.add(new RespuestaCliente(
                            u.getId(),
                            u.getId(),
                            u.getCorreo(),
                            u.getCorreo().split("@")[0],
                            "Cliente",
                            "N/A",
                            u.getCreadoEn()
                    ));
                }
            }
        }

        return lista;
    }

    /**
     * Elimina permanentemente la cuenta y el perfil del cliente autenticado.
     */
    @Transactional
    public void eliminarCuenta(Long usuarioId) {
        Usuario usuario = repositorioUsuario.findById(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Usuario no encontrado con ID: " + usuarioId));

        // Si existe perfil de cliente asociado, eliminar sus direcciones y el perfil
        repositorioCliente.findByUsuarioId(usuarioId).ifPresent(cliente -> {
            List<Direccion> direcciones = repositorioDireccion.findByClienteId(cliente.getId());
            repositorioDireccion.deleteAll(direcciones);
            repositorioCliente.delete(cliente);
        });

        // Eliminar el usuario de autenticación
        repositorioUsuario.delete(usuario);
    }

    /**
     * Obtiene el perfil de cliente del usuario autenticado.
     */
    @Transactional(readOnly = true)
    public RespuestaCliente obtenerPerfilPorUsuarioId(Long usuarioId) {
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));
        return mapearAClienteDto(cliente);
    }

    /**
     * Crea o actualiza la información del perfil del cliente.
     */
    @Transactional
    public RespuestaCliente actualizarPerfil(Long usuarioId, SolicitudCliente solicitud) {
        Usuario usuario = repositorioUsuario.findById(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Usuario no encontrado con ID: " + usuarioId));

        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    Cliente nuevoCliente = new Cliente();
                    nuevoCliente.setUsuario(usuario);
                    return nuevoCliente;
                });

        cliente.setNombre(solicitud.getNombre());
        cliente.setApellido(solicitud.getApellido());
        cliente.setTelefono(solicitud.getTelefono());

        Cliente clienteGuardado = repositorioCliente.save(cliente);
        return mapearAClienteDto(clienteGuardado);
    }

    /**
     * Obtiene la lista de direcciones registradas para un cliente.
     */
    @Transactional(readOnly = true)
    public List<RespuestaDireccion> obtenerDirecciones(Long usuarioId) {
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));

        return repositorioDireccion.findByClienteId(cliente.getId())
                .stream()
                .map(this::mapearADireccionDto)
                .collect(Collectors.toList());
    }

    /**
     * Agrega una nueva dirección de envío para el cliente.
     */
    @Transactional
    public RespuestaDireccion agregarDireccion(Long usuarioId, SolicitudDireccion solicitud) {
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));

        if (Boolean.TRUE.equals(solicitud.getEsPredeterminada())) {
            desmarcarDireccionesPredeterminadas(cliente.getId());
        }

        Direccion direccion = new Direccion();
        direccion.setCliente(cliente);
        direccion.setCalle(solicitud.getCalle());
        direccion.setCiudad(solicitud.getCiudad());
        direccion.setEstado(solicitud.getEstado());
        direccion.setCodigoPostal(solicitud.getCodigoPostal());
        direccion.setPais(solicitud.getPais());
        direccion.setEsPredeterminada(solicitud.getEsPredeterminada() != null ? solicitud.getEsPredeterminada() : false);

        Direccion direccionGuardada = repositorioDireccion.save(direccion);
        return mapearADireccionDto(direccionGuardada);
    }

    /**
     * Elimina una dirección de envío verificando pertenencia al cliente.
     */
    @Transactional
    public void eliminarDireccion(Long usuarioId, Long direccionId) {
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));

        Direccion direccion = repositorioDireccion.findById(direccionId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Dirección no encontrada con ID: " + direccionId));

        if (!direccion.getCliente().getId().equals(cliente.getId())) {
            throw new ExcepcionSolicitudIncorrecta("La dirección especificada no pertenece al cliente autenticado");
        }

        repositorioDireccion.delete(direccion);
    }

    /**
     * Desmarca todas las direcciones predeterminadas del cliente.
     */
    private void desmarcarDireccionesPredeterminadas(Long clienteId) {
        List<Direccion> direcciones = repositorioDireccion.findByClienteId(clienteId);
        for (Direccion d : direcciones) {
            if (Boolean.TRUE.equals(d.getEsPredeterminada())) {
                d.setEsPredeterminada(false);
                repositorioDireccion.save(d);
            }
        }
    }

    /**
     * Mapea un objeto Cliente a RespuestaCliente.
     */
    private RespuestaCliente mapearAClienteDto(Cliente cliente) {
        return new RespuestaCliente(
                cliente.getId(),
                cliente.getUsuario().getId(),
                cliente.getUsuario().getCorreo(),
                cliente.getNombre(),
                cliente.getApellido(),
                cliente.getTelefono(),
                cliente.getCreadoEn()
        );
    }

    /**
     * Mapea un objeto Direccion a RespuestaDireccion.
     */
    private RespuestaDireccion mapearADireccionDto(Direccion direccion) {
        return new RespuestaDireccion(
                direccion.getId(),
                direccion.getCliente().getId(),
                direccion.getCalle(),
                direccion.getCiudad(),
                direccion.getEstado(),
                direccion.getCodigoPostal(),
                direccion.getPais(),
                direccion.getEsPredeterminada()
        );
    }
}
