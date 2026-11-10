import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './paginas/Inicio';
import CatalogoProductos from './paginas/CatalogoProductos';
import DetalleProducto from './paginas/DetalleProducto';
import IniciarSesion from './paginas/IniciarSesion';
import Registro from './paginas/Registro';
import Carrito from './paginas/Carrito';
import ConfirmarCompra from './paginas/ConfirmarCompra';
import MisPedidos from './paginas/MisPedidos';
import PanelAdmin from './paginas/PanelAdmin';
import GestionPedidosAdmin from './paginas/GestionPedidosAdmin';
import GestionClientesAdmin from './paginas/GestionClientesAdmin';
import GestionCategoriasAdmin from './paginas/GestionCategoriasAdmin';
import RutaProtegida from './componentes/RutaProtegida';

/**
 * Componente Principal App: Configura el enrutador de la aplicación "Technological Device".
 * Registra las rutas públicas y las rutas protegidas por roles (ROLE_CLIENTE y ROLE_ADMIN).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz de bienvenida principal */}
        <Route path="/" element={<Inicio />} />
        {/* Ruta del catálogo de productos */}
        <Route path="/productos" element={<CatalogoProductos />} />
        {/* Ruta detallada de un producto específico por su ID */}
        <Route path="/producto/:id" element={<DetalleProducto />} />
        {/* Ruta para el formulario de inicio de sesión */}
        <Route path="/login" element={<IniciarSesion />} />
        {/* Ruta para el registro de nuevos usuarios */}
        <Route path="/registro" element={<Registro />} />
        {/* Ruta del carrito de compras */}
        <Route path="/carrito" element={<Carrito />} />

        {/* RUTAS PROTEGIDAS PARA CLIENTES (Solo compras e historial de cliente) */}
        <Route
          path="/confirmar-compra"
          element={
            <RutaProtegida rolRequerido="ROLE_CLIENTE">
              <ConfirmarCompra />
            </RutaProtegida>
          }
        />
        <Route
          path="/mis-pedidos"
          element={
            <RutaProtegida rolRequerido="ROLE_CLIENTE">
              <MisPedidos />
            </RutaProtegida>
          }
        />

        {/* RUTAS PROTEGIDAS PARA ADMINISTRADORES (Solo gestión de catálogo y pedidos) */}
        <Route
          path="/admin"
          element={
            <RutaProtegida rolRequerido="ROLE_ADMIN">
              <PanelAdmin />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <RutaProtegida rolRequerido="ROLE_ADMIN">
              <GestionPedidosAdmin />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <RutaProtegida rolRequerido="ROLE_ADMIN">
              <GestionClientesAdmin />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <RutaProtegida rolRequerido="ROLE_ADMIN">
              <GestionCategoriasAdmin />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;







