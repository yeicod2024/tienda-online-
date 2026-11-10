import { createContext, useContext, useState, useEffect } from 'react';

// 1. Creación del contexto global del carrito
const ContextoCarrito = createContext();

/**
 * Obtiene la clave dinámica de localStorage según el usuario actualmente autenticado.
 * Si hay usuario autenticado (ej: usuario@correo.com) -> 'carrito_usuario@correo.com'
 * Si es visitante no autenticado -> null (sin carrito previo)
 */
const obtenerClaveCarrito = () => {
  try {
    const usuarioGuardado = localStorage.getItem('usuario_tienda') || localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      const correo = usuario?.correo || usuario?.email;
      if (correo) {
        return `carrito_${correo}`;
      }
    }
  } catch (error) {
    console.warn('Error al identificar usuario para el carrito:', error);
  }
  return null;
};

/**
 * Carga la lista de productos almacenada en localStorage para la clave especificada.
 * Si no hay clave de usuario autenticado (visitante), limpia residuos y retorna un arreglo vacío [].
 */
const cargarCarritoDesdeStorage = (clave) => {
  if (!clave) {
    // Si no hay sesión iniciada, nos aseguramos de no cargar nada
    try {
      localStorage.removeItem('carrito_visitante');
      localStorage.removeItem('carrito');
    } catch (e) {
      // Ignorar errores de localStorage
    }
    return [];
  }
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : [];
  } catch (error) {
    console.warn(`Error al cargar carrito [${clave}] desde localStorage:`, error);
    return [];
  }
};

/**
 * Proveedor del Contexto del Carrito de Compras.
 * Administra el estado global de los productos seleccionados aislándolos estrictamente por usuario.
 */
export function ProveedorCarrito({ children }) {
  const [claveCarrito, setClaveCarrito] = useState(obtenerClaveCarrito);
  const [listaCarrito, setListaCarrito] = useState(() => cargarCarritoDesdeStorage(claveCarrito));

  // Escuchar cambios de sesión/usuario para actualizar la clave y recargar el carrito correspondiente
  useEffect(() => {
    const verificarCambioSesion = () => {
      const nuevaClave = obtenerClaveCarrito();
      if (nuevaClave !== claveCarrito) {
        setClaveCarrito(nuevaClave);
        setListaCarrito(cargarCarritoDesdeStorage(nuevaClave));
      }
    };

    // Verificar en cada render o cambio de foco
    verificarCambioSesion();
    window.addEventListener('storage', verificarCambioSesion);
    const intervalo = setInterval(verificarCambioSesion, 500);

    return () => {
      window.removeEventListener('storage', verificarCambioSesion);
      clearInterval(intervalo);
    };
  }, [claveCarrito]);

  // Guardar en localStorage bajo la clave del usuario activo cada vez que cambia la lista
  useEffect(() => {
    if (!claveCarrito) return;
    try {
      localStorage.setItem(claveCarrito, JSON.stringify(listaCarrito));
    } catch (error) {
      console.warn(`Error al guardar carrito [${claveCarrito}] en localStorage:`, error);
    }
  }, [listaCarrito, claveCarrito]);

  /**
   * Agrega un producto al carrito del usuario activo o incrementa su cantidad.
   */
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setListaCarrito((carritoPrevio) => {
      const existeIndex = carritoPrevio.findIndex((item) => item.id === producto.id);
      if (existeIndex >= 0) {
        return carritoPrevio.map((item, index) =>
          index === existeIndex ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      } else {
        return [...carritoPrevio, { ...producto, cantidad }];
      }
    });
  };

  /**
   * Decrementa en 1 la cantidad de un ítem en el carrito.
   */
  const decrementarCantidad = (idProducto) => {
    setListaCarrito((carritoPrevio) => {
      return carritoPrevio
        .map((item) => {
          if (item.id === idProducto) {
            return { ...item, cantidad: item.cantidad - 1 };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0);
    });
  };

  /**
   * Elimina un ítem específico del carrito por su ID.
   */
  const eliminarDelCarrito = (idProducto) => {
    setListaCarrito((carritoPrevio) => carritoPrevio.filter((item) => item.id !== idProducto));
  };

  /**
   * Vacía completamente el carrito de compras del usuario activo.
   */
  const vaciarCarrito = () => {
    setListaCarrito([]);
    try {
      localStorage.removeItem(claveCarrito);
    } catch (e) {
      console.warn('Error al vaciar carrito en localStorage:', e);
    }
  };

  /**
   * Fuerza la actualización/sincronización del carrito al iniciar o cerrar sesión.
   */
  const sincronizarSesionCarrito = () => {
    const nuevaClave = obtenerClaveCarrito();
    setClaveCarrito(nuevaClave);
    setListaCarrito(cargarCarritoDesdeStorage(nuevaClave));
  };

  // Cantidad total acumulada de artículos en el carrito
  const cantidadTotalItems = listaCarrito.reduce((suma, item) => suma + item.cantidad, 0);

  // Precio total acumulado del carrito
  const calcularPrecioTotal = () => {
    return listaCarrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  };

  return (
    <ContextoCarrito.Provider
      value={{
        listaCarrito,
        agregarAlCarrito,
        decrementarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        sincronizarSesionCarrito,
        cantidadTotalItems,
        calcularPrecioTotal,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
}

/**
 * Hook personalizado para acceder al Contexto del Carrito.
 */
export function usoCarrito() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error('usoCarrito debe utilizarse dentro de un ProveedorCarrito');
  }
  return contexto;
}

