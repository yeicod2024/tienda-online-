package com.tienda.modulos.pedidos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDetallePedido extends JpaRepository<DetallePedido, Long> {
    
    /**
     * Obtiene el desglose de productos que pertenecen a un pedido dado
     */
    List<DetallePedido> findByPedidoId(Long pedidoId);
}
