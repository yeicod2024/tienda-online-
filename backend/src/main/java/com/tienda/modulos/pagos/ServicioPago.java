package com.tienda.modulos.pagos;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import com.tienda.modulos.clientes.Cliente;
import com.tienda.modulos.clientes.RepositorioCliente;
import com.tienda.modulos.pagos.dto.RespuestaPago;
import com.tienda.modulos.pagos.dto.SolicitudProcesarPago;
import com.tienda.modulos.pedidos.Pedido;
import com.tienda.modulos.pedidos.RepositorioPedido;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Servicio encargado del procesamiento y simulación de pagos de pedidos.
 */
@Service
@RequiredArgsConstructor
public class ServicioPago {

    private final RepositorioPago repositorioPago;
    private final RepositorioPedido repositorioPedido;
    private final RepositorioCliente repositorioCliente;

    /**
     * Procesa el cobro de un pedido y cambia su estado a PAGADO.
     */
    @Transactional
    public RespuestaPago procesarPago(Long usuarioId, SolicitudProcesarPago solicitud) {
        if (solicitud == null || solicitud.getPedidoId() == null) {
            throw new ExcepcionSolicitudIncorrecta("La solicitud o el ID del pedido no pueden ser nulos");
        }

        Long pedidoId = solicitud.getPedidoId();

        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));

        Pedido pedido = repositorioPedido.findById(pedidoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Pedido no encontrado con ID: " + pedidoId));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ExcepcionSolicitudIncorrecta("El pedido no pertenece al cliente autenticado");
        }

        if ("PAGADO".equalsIgnoreCase(pedido.getEstado())) {
            throw new ExcepcionSolicitudIncorrecta("El pedido ya se encuentra procesado y pagado");
        }

        String idPagoTransaccion = "TX_STRIPE_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Pago pago = repositorioPago.findByPedidoId(pedido.getId())
                .orElseGet(() -> {
                    Pago nuevoPago = new Pago();
                    nuevoPago.setPedido(pedido);
                    return nuevoPago;
                });

        pago.setIdPagoStripe(idPagoTransaccion);
        pago.setMonto(pedido.getTotal());
        pago.setMoneda("COP");
        pago.setEstado("COMPLETADO");
        pago.setMetodo(solicitud.getMetodo() != null ? solicitud.getMetodo() : "TARJETA_STRIPE");

        Pago pagoGuardado = repositorioPago.save(pago);

        // Actualizar el estado del pedido a PAGADO
        pedido.setEstado("PAGADO");
        repositorioPedido.save(pedido);

        return mapearAPagoDto(pagoGuardado);
    }

    /**
     * Consulta el comprobante de pago de un pedido específico.
     */
    @Transactional(readOnly = true)
    public RespuestaPago obtenerPagoPorPedidoId(Long usuarioId, Long pedidoId) {
        Cliente cliente = repositorioCliente.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Perfil de cliente no encontrado para el usuario con ID: " + usuarioId));

        Pedido pedido = repositorioPedido.findById(pedidoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Pedido no encontrado con ID: " + pedidoId));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ExcepcionSolicitudIncorrecta("El pedido no pertenece al cliente autenticado");
        }

        Pago pago = repositorioPago.findByPedidoId(pedidoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("No se encontró ningún registro de pago para el pedido con ID: " + pedidoId));

        return mapearAPagoDto(pago);
    }

    /**
     * Mapea un objeto Pago a RespuestaPago DTO.
     */
    private RespuestaPago mapearAPagoDto(Pago pago) {
        return new RespuestaPago(
                pago.getId(),
                pago.getPedido().getId(),
                pago.getIdPagoStripe(),
                pago.getMonto(),
                pago.getMoneda(),
                pago.getEstado(),
                pago.getMetodo(),
                pago.getCreadoEn()
        );
    }
}
