package com.tienda.modulos.inventario;

import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import com.tienda.modulos.inventario.dto.RespuestaInventario;
import com.tienda.modulos.inventario.dto.SolicitudActualizarInventario;
import com.tienda.modulos.productos.Producto;
import com.tienda.modulos.productos.RepositorioProducto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio encargado de gestionar las operaciones de stock e inventario.
 */
@Service
@RequiredArgsConstructor
public class ServicioInventario {

    private final RepositorioInventario repositorioInventario;
    private final RepositorioProducto repositorioProducto;

    /**
     * Obtiene el inventario actual de un producto específico.
     */
    @Transactional(readOnly = true)
    public RespuestaInventario obtenerInventarioPorProductoId(Long productoId) {
        Inventario inventario = repositorioInventario.findByProductoId(productoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Inventario no encontrado para el producto con ID: " + productoId));
        return convertirADto(inventario);
    }

    /**
     * Obtiene todo el registro de inventario de productos activos en la tienda.
     */
    @Transactional(readOnly = true)
    public List<RespuestaInventario> obtenerTodoElInventario() {
        return repositorioInventario.findAll().stream()
                .filter(inv -> inv.getProducto() != null && Boolean.TRUE.equals(inv.getProducto().getActivo()))
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    /**
     * Establece o actualiza la cantidad de unidades en inventario para un producto.
     */
    @Transactional
    public RespuestaInventario actualizarInventario(Long productoId, SolicitudActualizarInventario solicitud) {
        Producto producto = repositorioProducto.findById(productoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Producto no encontrado con ID: " + productoId));

        Inventario inventario = repositorioInventario.findByProductoId(productoId)
                .orElseGet(() -> {
                    Inventario nuevoInventario = new Inventario();
                    nuevoInventario.setProducto(producto);
                    nuevoInventario.setCantidad(0);
                    return nuevoInventario;
                });

        inventario.setCantidad(solicitud.getCantidad());
        Inventario inventarioGuardado = repositorioInventario.save(inventario);

        return convertirADto(inventarioGuardado);
    }

    /**
     * Método auxiliar de negocio para descontar unidades al realizar un pedido.
     */
    @Transactional
    public void descontarStock(Long productoId, Integer cantidadADescontar) {
        Inventario inventario = repositorioInventario.findByProductoId(productoId)
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Inventario no encontrado para el producto con ID: " + productoId));

        if (inventario.getCantidad() < cantidadADescontar) {
            throw new ExcepcionSolicitudIncorrecta("Stock insuficiente para el producto '" + 
                    inventario.getProducto().getNombre() + "'. Disponible: " + inventario.getCantidad() + ", Solicitado: " + cantidadADescontar);
        }

        inventario.setCantidad(inventario.getCantidad() - cantidadADescontar);
        repositorioInventario.save(inventario);
    }

    /**
     * Convierte la entidad Inventario a su correspondiente DTO RespuestaInventario.
     */
    private RespuestaInventario convertirADto(Inventario inventario) {
        return new RespuestaInventario(
                inventario.getId(),
                inventario.getProducto().getId(),
                inventario.getProducto().getNombre(),
                inventario.getCantidad(),
                inventario.getActualizadoEn()
        );
    }
}
