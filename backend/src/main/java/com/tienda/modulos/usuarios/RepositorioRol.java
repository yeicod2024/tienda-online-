package com.tienda.modulos.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad Rol.
 */
@Repository
public interface RepositorioRol extends JpaRepository<Rol, Long> {
    
    /**
     * Busca un rol por su nombre (ej: "ROLE_ADMIN" o "ROLE_CLIENTE")
     */
    Optional<Rol> findByNombre(String nombre);
}
