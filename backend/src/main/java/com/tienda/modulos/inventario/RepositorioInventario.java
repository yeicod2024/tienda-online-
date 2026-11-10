package com.tienda.modulos.inventario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositorioInventario extends JpaRepository<Inventario, Long> {
    
    /**
     * Busca el registro de inventario asociado a un producto
     */
    Optional<Inventario> findByProductoId(Long productoId);
}
