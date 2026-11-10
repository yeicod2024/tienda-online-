package com.tienda.modulos.clientes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositorioCliente extends JpaRepository<Cliente, Long> {
    
    /**
     * Obtiene el perfil de cliente asociado a una cuenta de usuario
     */
    Optional<Cliente> findByUsuarioId(Long usuarioId);
}
