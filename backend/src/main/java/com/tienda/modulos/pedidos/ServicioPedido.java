package com.tienda.modulos.pedidos;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import com.tienda.modulos.clientes.Cliente;
import com.tienda.modulos.clientes.Direccion;
import com.tienda.modulos.clientes.RepositorioCliente;
import com.tienda.modulos.clientes.RepositorioDireccion;
import com.tienda.modulos.clientes.dto.RespuestaDireccion;
import com.tienda.modulos.inventario.ServicioInventario;
import com.tienda.modulos.pedidos.dto.RespuestaDetallePedido;
import com.tienda.modulos.pedidos.dto.RespuestaPedido;
import com.tienda.modulos.pedidos.dto.SolicitudCrearPedido;
import com.tienda.modulos.pedidos.dto.SolicitudDetallePedido;
import com.tienda.modulos.productos.Producto;
import com.tienda.modulos.productos.RepositorioProducto;
import com.tienda.modulos.usuarios.RepositorioUsuario;
import com.tienda.modulos.usuarios.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de negocio encargado de procesar la creación, consulta y estados de los pedidos.
 */
@Service
@RequiredArgsConstructor
public class ServicioPedido {

    private final RepositorioPedido repositorioPedido;
    private final RepositorioDetallePedido repositorioDetallePedido;
    private final RepositorioCliente repositorioCliente;
    private final RepositorioDireccion repositorioDireccion;
    private final RepositorioProducto repositorioProducto;
    private final RepositorioUsuario repositorioUsuario;
    private final ServicioInventario servicioInventario;

    /**
     * Procesa y crea un nuevo pedido para el cliente autenticado.
     */
    @Transactional
    public RespuestaPedido crearPedido(Long usuarioId, SolicitudCrearPedido solicitud) {
        // 1. Obtener el cliente o crearlo automáticamente si no existe su perfil
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    Usuario usuario = repositorioUsuario.findById(usuarioId)
                            .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Usuario no encontrado con ID: " + usuarioId));
                    Cliente nuevoCliente = new Cliente();
                    nuevoCliente.setUsuario(usuario);
                    nuevoCliente.setNombre(usuario.getCorreo().split("@")[0]);
                    nuevoCliente.setApellido("Cliente");
                    nuevoCliente.setTelefono(solicitud.getTelefonoContacto() != null ? solicitud.getTelefonoContacto() : "0000000000");
                    return repositorioCliente.save(nuevoCliente);
                });

        // 2. Resolver la Dirección de Envío (por ID o creando una nueva dirección a partir del texto ingresado)
        Direccion direccion;
        if (solicitud.getDireccionId() != null) {
            direccion = repositorioDireccion.findById(solicitud.getDireccionId())
                    .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Dirección no encontrada con ID: " + solicitud.getDireccionId()));
        } else {
            String textoDireccion = solicitud.getDireccionEnvio() != null && !solicitud.getDireccionEnvio().isBlank()
                    ? solicitud.getDireccionEnvio()
                    : "Dirección Principal de Envío";

            direccion = new Direccion();
            direccion.setCliente(cliente);
            direccion.setCalle(textoDireccion);
            direccion.setCiudad("Principal");
            direccion.setEstado("Nacional");
            direccion.setCodigoPostal("730001");
            direccion.setPais("Colombia");
            direccion.setEsPredeterminada(true);
            direccion = repositorioDireccion.save(direccion);
        }

        // 3. Crear cabecera del pedido
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccion(direccion);
        pedido.setEstado("PROCESANDO");
        pedido.setNotas(solicitud.getNotas());
        pedido.setTotal(BigDecimal.ZERO);

        Pedido pedidoGuardado = repositorioPedido.save(pedido);

        BigDecimal totalCalculado = BigDecimal.ZERO;
        List<DetallePedido> detallesGuardados = new ArrayList<>();

        // 4. Registrar los productos solicitados y descontar stock
        for (SolicitudDetallePedido item : solicitud.getDetalles()) {
            Producto producto = repositorioProducto.findById(item.getProductoId())
                    .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Producto no encontrado con ID: " + item.getProductoId()));

            if (Boolean.FALSE.equals(producto.getActivo())) {
                throw new ExcepcionSolicitudIncorrecta("El producto '" + producto.getNombre() + "' no se encuentra activo");
            }

            // Descontar existencias del inventario
            servicioInventario.descontarStock(producto.getId(), item.getCantidad());

            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(item.getCantidad()));
            totalCalculado = totalCalculado.add(subtotal);

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedidoGuardado);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(subtotal);

            detallesGuardados.add(repositorioDetallePedido.save(detalle));
        }

        pedidoGuardado.setTotal(totalCalculado);
        repositorioPedido.save(pedidoGuardado);

        return mapearAPedidoDto(pedidoGuardado, detallesGuardados);
    }

    /**
     * Obtiene el historial de pedidos de un cliente.
     */
    @Transactional(readOnly = true)
    public List<RespuestaPedido> obtenerPedidosPorCliente(Long usuarioId) {
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));

        List<Pedido> pedidos = repositorioPedido.findByClienteIdOrderByCreadoEnDesc(cliente.getId());
        return pedidos.stream()
                .map(p -> {
                    List<DetallePedido> detalles = repositorioDetallePedido.findByPedidoId(p.getId());
                    return mapearAPedidoDto(p, detalles);
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un pedido específico verificando pertenencia o rol administrativo.
     */
    @Transactional(readOnly = true)
    public RespuestaPedido obtenerPedidoPorId(Long usuarioId, Long pedidoId) {
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));

        Pedido pedido = repositorioPedido.findById(pedidoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Pedido no encontrado con ID: " + pedidoId));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ExcepcionSolicitudIncorrecta("El pedido no pertenece al cliente autenticado");
        }

        List<DetallePedido> detalles = repositorioDetallePedido.findByPedidoId(pedido.getId());
        return mapearAPedidoDto(pedido, detalles);
    }

    /**
     * Obtiene todos los pedidos del sistema (Acceso Administración).
     */
    @Transactional(readOnly = true)
    public List<RespuestaPedido> obtenerTodosLosPedidos() {
        return repositorioPedido.findAll().stream()
                .map(p -> {
                    List<DetallePedido> detalles = repositorioDetallePedido.findByPedidoId(p.getId());
                    return mapearAPedidoDto(p, detalles);
                })
                .collect(Collectors.toList());
    }

    /**
     * Cambia el estado de un pedido (ej. PENDIENTE -> PAGADO -> ENVIADO).
     */
    @Transactional
    public RespuestaPedido cambiarEstadoPedido(Long pedidoId, String nuevoEstado) {
        Pedido pedido = repositorioPedido.findById(pedidoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Pedido no encontrado con ID: " + pedidoId));

        pedido.setEstado(nuevoEstado);
        Pedido pedidoGuardado = repositorioPedido.save(pedido);

        List<DetallePedido> detalles = repositorioDetallePedido.findByPedidoId(pedidoGuardado.getId());
        return mapearAPedidoDto(pedidoGuardado, detalles);
    }

    /**
     * Convierte la entidad Pedido a RespuestaPedido DTO.
     */
    private RespuestaPedido mapearAPedidoDto(Pedido pedido, List<DetallePedido> detalles) {
        RespuestaDireccion direccionDto = new RespuestaDireccion(
                pedido.getDireccion().getId(),
                pedido.getDireccion().getCliente().getId(),
                pedido.getDireccion().getCalle(),
                pedido.getDireccion().getCiudad(),
                pedido.getDireccion().getEstado(),
                pedido.getDireccion().getCodigoPostal(),
                pedido.getDireccion().getPais(),
                pedido.getDireccion().getEsPredeterminada()
        );

        List<RespuestaDetallePedido> detallesDto = detalles.stream()
                .map(this::mapearADetalleDto)
                .collect(Collectors.toList());

        String nombreCompletoCliente = pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido();

        return new RespuestaPedido(
                pedido.getId(),
                pedido.getCliente().getId(),
                nombreCompletoCliente,
                direccionDto,
                pedido.getEstado(),
                pedido.getTotal(),
                pedido.getNotas(),
                pedido.getCreadoEn(),
                pedido.getActualizadoEn(),
                detallesDto
        );
    }

    /**
     * Convierte la entidad DetallePedido a RespuestaDetallePedido DTO.
     */
    private RespuestaDetallePedido mapearADetalleDto(DetallePedido detalle) {
        return new RespuestaDetallePedido(
                detalle.getId(),
                detalle.getProducto().getId(),
                detalle.getProducto().getNombre(),
                detalle.getCantidad(),
                detalle.getPrecioUnitario(),
                detalle.getSubtotal()
        );
    }
}

