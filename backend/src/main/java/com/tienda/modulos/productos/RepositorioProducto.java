package com.tienda.modulos.productos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioProducto extends JpaRepository<Producto, Long> {
    
    /**
     * Busca productos pertenecientes a una categoría específica
     */
    List<Producto> findByCategoriaIdAndActivoTrue(Long categoriaId);

    /**
     * Busca productos por coincidencia parcial de nombre (insensible a mayúsculas/minúsculas)
     */
    List<Producto> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);

    /**
     * Devuelve solo los productos activos para los clientes
     */
    @Query("SELECT p FROM Producto p")
    List<Producto> findByActivoTrue();
}
