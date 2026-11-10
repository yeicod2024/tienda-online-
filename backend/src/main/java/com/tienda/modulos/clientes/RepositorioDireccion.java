package com.tienda.modulos.clientes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDireccion extends JpaRepository<Direccion, Long> {
    
    /**
     * Devuelve todas las direcciones de envío asociadas a un cliente específico
     */
    List<Direccion> findByClienteId(Long clienteId);
}
