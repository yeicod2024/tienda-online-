-- ===================================================================
-- POBLAMIENTO INICIAL DE DATOS PARA DESARROLLO (DATA.SQL)
-- ===================================================================

-- 1. Insertar Roles Principales del Sistema
INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'ROLE_ADMIN');
INSERT IGNORE INTO roles (id, nombre) VALUES (2, 'ROLE_CLIENTE');

-- 1.1. Insertar Usuario Administrador Inicial (admin@tienda.com / clave: admin123)
INSERT IGNORE INTO usuarios (id, activo, correo, contrasena, rol_id, creado_en) VALUES (1, true, 'admin@tienda.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 1, NOW());



-- 2. Insertar Categorías Tecnológicas de Technological Device
INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) 
VALUES (1, 'Portátiles', 'Laptops y computadores portátiles de alto rendimiento para trabajo y gaming.', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', true);

INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) 
VALUES (2, 'Periféricos', 'Teclados mecánicos, mouses ergonómicos y accesorios de computador.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', true);

INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) 
VALUES (3, 'Sillas de Oficina', 'Sillas gamer y ergonómicas para largas jornadas de trabajo.', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6', true);

INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) 
VALUES (4, 'Audio', 'Audífonos gamer, parlantes Bluetooth y sistemas de sonido.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b', true);

INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen, activo) 
VALUES (5, 'Monitores', 'Monitores de alta tasa de refresco (165Hz) e IPS para trabajo y juego.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', true);

-- 3. Insertar Productos Tecnológicos Iniciales (Valores en Pesos Colombianos)
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en)
VALUES (1, 1, 'Computador Portátil Gamer RTX 4060', 'Potente portátil gamer equipado con procesador Intel Core i7 de última generación, tarjeta gráfica NVIDIA GeForce RTX 4060 de 8GB, 16GB de Memoria RAM DDR5 y 1TB SSD NVMe.', 4500000.00, 'SKU-LAP-001', true, NOW(), NOW());

INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en)
VALUES (2, 2, 'Teclado Mecánico RGB Switch Blue', 'Teclado mecánico con retroiluminación RGB personalizable por tecla, switches Blue táctiles y audibles ideales para escribir y jugar.', 280000.00, 'SKU-TEC-002', true, NOW(), NOW());

INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en)
VALUES (3, 2, 'Mouse Inalámbrico Ergonómico 16000 DPI', 'Mouse inalámbrico con sensor óptico de alta precisión a 16000 DPI, diseño ergonómico para reducir la fatiga y batería recargable.', 150000.00, 'SKU-MOU-003', true, NOW(), NOW());

INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en)
VALUES (4, 3, 'Silla Gamer Ergonómica Reclinable', 'Silla gamer ergonómica con soporte lumbar regulable, reposabrazos 4D, estructura de acero y reclinación hasta 180 grados.', 890000.00, 'SKU-SIL-004', true, NOW(), NOW());

INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en)
VALUES (5, 4, 'Audífonos Gamer Sonido Envolvente 7.1', 'Audífonos supraaurales con sonido envolvente 7.1 virtual, micrófono con cancelación de ruido pasiva y almohadillas viscoelásticas.', 320000.00, 'SKU-AUD-005', true, NOW(), NOW());

INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, sku, activo, creado_en, actualizado_en)
VALUES (6, 5, 'Monitor Gamer 27" 165Hz IPS 1ms', 'Monitor de 27 pulgadas panel IPS resolución Full HD, 165Hz de frecuencia de actualización y 1ms de tiempo de respuesta.', 1250000.00, 'SKU-MON-006', true, NOW(), NOW());

