package com.tienda.modulos.categorias;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioCategoria extends JpaRepository<Categoria, Long> {
    
    /**
     * Devuelve solo las categorías activas para mostrar en el menú principal
     */
    List<Categoria> findByActivoTrue();
}
