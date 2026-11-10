package com.tienda.modulos.pedidos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioPedido extends JpaRepository<Pedido, Long> {
    
    /**
     * Obtiene todos los pedidos realizados por un cliente específico
     */
    List<Pedido> findByClienteIdOrderByCreadoEnDesc(Long clienteId);
}
