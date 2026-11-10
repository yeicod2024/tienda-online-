package com.tienda.modulos.pagos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositorioPago extends JpaRepository<Pago, Long> {
    
    /**
     * Busca la información de pago asociada a un pedido
     */
    Optional<Pago> findByPedidoId(Long pedidoId);

    /**
     * Busca un pago utilizando el ID de transacción de Stripe
     */
    Optional<Pago> findByIdPagoStripe(String idPagoStripe);
}
