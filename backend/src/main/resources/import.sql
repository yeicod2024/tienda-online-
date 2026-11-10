-- ===================================================================
-- SCRIPT DE IMPORTACIÓN AUTOMÁTICA DE HIBERNATE (IMPORT.SQL)
-- ===================================================================

-- 1. Insertar Roles Principales del Sistema
INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'ROLE_ADMIN');
INSERT IGNORE INTO roles (id, nombre) VALUES (2, 'ROLE_CLIENTE');

-- 1.1. Insertar Usuario Administrador Inicial (admin@tienda.com / clave: admin123)
INSERT IGNORE INTO usuarios (id, activo, correo, contrasena, rol_id, creado_en) VALUES (1, true, 'admin@tienda.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 1, NOW());



-- 2. Insertar Categorías Tecnológicas de Technological Device
INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) VALUES (1, 'Portátiles', 'Laptops y computadores portátiles de alto rendimiento para trabajo y gaming.', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', true);
INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) VALUES (2, 'Periféricos', 'Teclados mecánicos, mouses ergonómicos y accesorios de computador.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', true);
INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) VALUES (3, 'Sillas de Oficina', 'Sillas gamer y ergonómicas para largas jornadas de trabajo.', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80', true);
INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) VALUES (4, 'Audio', 'Audífonos gamer, parlantes Bluetooth y sistemas de sonido.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', true);
INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) VALUES (5, 'Monitores', 'Monitores de alta tasa de refresco (165Hz) e IPS para trabajo y juego.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', true);

-- 3. Insertar Productos Tecnológicos Iniciales
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en) VALUES (1, 1, 'Computador Portátil Gamer RTX 4060', 'Potente portátil gamer equipado con procesador Intel Core i7 de última generación, tarjeta gráfica NVIDIA GeForce RTX 4060 de 8GB, 16GB de Memoria RAM DDR5 y 1TB SSD NVMe.', 4500000.00, 'SKU-LAP-001', true, NOW(), NOW());
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en) VALUES (2, 2, 'Teclado Mecánico RGB Switch Blue', 'Teclado mecánico con retroiluminación RGB personalizable por tecla, switches Blue táctiles y audibles ideales para escribir y jugar.', 280000.00, 'SKU-TEC-002', true, NOW(), NOW());
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en) VALUES (3, 2, 'Mouse Inalámbrico Ergonómico 16000 DPI', 'Mouse inalámbrico con sensor óptico de alta precisión a 16000 DPI, diseño ergonómico para reducir la fatiga y batería recargable.', 150000.00, 'SKU-MOU-003', true, NOW(), NOW());
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en) VALUES (4, 3, 'Silla Gamer Ergonómica Reclinable', 'Silla gamer ergonómica con soporte lumbar regulable, reposabrazos 4D, estructura de acero y reclinación hasta 180 grados.', 890000.00, 'SKU-SIL-004', true, NOW(), NOW());
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en) VALUES (5, 4, 'Audífonos Gamer Sonido Envolvente 7.1', 'Audífonos supraaurales con sonido envolvente 7.1 virtual, micrófono con cancelación de ruido pasiva y almohadillas viscoelásticas.', 320000.00, 'SKU-AUD-005', true, NOW(), NOW());
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en) VALUES (6, 5, 'Monitor Gamer 27" 165Hz IPS 1ms', 'Monitor de 27 pulgadas panel IPS resolución Full HD, 165Hz de frecuencia de actualización y 1ms de tiempo de respuesta.', 1250000.00, 'SKU-MON-006', true, NOW(), NOW());

-- 4. Insertar Imágenes Pertinentes (Principales y Galería) en la Base de Datos
-- Producto 1: Computador Portátil Gamer RTX 4060
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (1, 1, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', true, 1);
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (7, 1, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', false, 2);

-- Producto 2: Teclado Mecánico RGB Switch Blue
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (2, 2, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', true, 1);
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (8, 2, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80', false, 2);

-- Producto 3: Mouse Inalámbrico Ergonómico 16000 DPI
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (3, 3, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', true, 1);
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (9, 3, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', false, 2);

-- Producto 4: Silla Gamer Ergonómica Reclinable
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (4, 4, 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80', true, 1);
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (10, 4, 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&auto=format&fit=crop&q=80', false, 2);

-- Producto 5: Audífonos Gamer Sonido Envolvente 7.1
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (5, 5, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', true, 1);
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (11, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', false, 2);

-- Producto 6: Monitor Gamer 27" 165Hz IPS 1ms
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (6, 6, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', true, 1);
INSERT IGNORE INTO imagenes_producto (id, producto_id, url_imagen, es_principal, orden_visualizacion) VALUES (12, 6, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', false, 2);

-- 5. Insertar Inventario Inicial de Productos
INSERT IGNORE INTO inventarios (id, producto_id, cantidad, actualizado_en) VALUES (1, 1, 10, NOW());
INSERT IGNORE INTO inventarios (id, producto_id, cantidad, actualizado_en) VALUES (2, 2, 25, NOW());
INSERT IGNORE INTO inventarios (id, producto_id, cantidad, actualizado_en) VALUES (3, 3, 30, NOW());
INSERT IGNORE INTO inventarios (id, producto_id, cantidad, actualizado_en) VALUES (4, 4, 8, NOW());
INSERT IGNORE INTO inventarios (id, producto_id, cantidad, actualizado_en) VALUES (5, 5, 15, NOW());
INSERT IGNORE INTO inventarios (id, producto_id, cantidad, actualizado_en) VALUES (6, 6, 12, NOW());



