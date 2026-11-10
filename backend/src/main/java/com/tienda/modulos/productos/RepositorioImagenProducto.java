package com.tienda.modulos.productos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioImagenProducto extends JpaRepository<ImagenProducto, Long> {
    
    /**
     * Devuelve todas las imágenes asociadas a un producto ordenadas por ordenVisualizacion
     */
    List<ImagenProducto> findByProductoIdOrderByOrdenVisualizacionAsc(Long productoId);
}
