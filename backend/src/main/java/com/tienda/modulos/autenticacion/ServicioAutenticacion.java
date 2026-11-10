package com.tienda.modulos.autenticacion;

import com.tienda.excepciones.ExcepcionSolicitudIncorrecta;
import com.tienda.excepciones.ExcepcionRecursoNoEncontrado;
import com.tienda.modulos.autenticacion.dto.RespuestaAutenticacion;
import com.tienda.modulos.autenticacion.dto.SolicitudLogin;
import com.tienda.modulos.autenticacion.dto.SolicitudRegistro;
import com.tienda.modulos.clientes.Cliente;
import com.tienda.modulos.clientes.RepositorioCliente;
import com.tienda.modulos.usuarios.Rol;
import com.tienda.modulos.usuarios.RepositorioRol;
import com.tienda.modulos.usuarios.Usuario;
import com.tienda.modulos.usuarios.RepositorioUsuario;
import com.tienda.seguridad.ProveedorTokenJwt;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de Negocio para el proceso de Autenticación y Registro de Usuarios.
 */
@Service
public class ServicioAutenticacion {

    private final AuthenticationManager administradorAutenticacion;
    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioRol repositorioRol;
    private final RepositorioCliente repositorioCliente;
    private final PasswordEncoder codificadorContrasena;
    private final ProveedorTokenJwt proveedorToken;

    public ServicioAutenticacion(AuthenticationManager administradorAutenticacion,
                                 RepositorioUsuario repositorioUsuario,
                                 RepositorioRol repositorioRol,
                                 RepositorioCliente repositorioCliente,
                                 PasswordEncoder codificadorContrasena,
                                 ProveedorTokenJwt proveedorToken) {
        this.administradorAutenticacion = administradorAutenticacion;
        this.repositorioUsuario = repositorioUsuario;
        this.repositorioRol = repositorioRol;
        this.repositorioCliente = repositorioCliente;
        this.codificadorContrasena = codificadorContrasena;
        this.proveedorToken = proveedorToken;
    }

    /**
     * Procesa el inicio de sesión de un usuario.
     * 
     * @param solicitudLogin DTO con el correo y contraseña enviados desde el cliente
     * @return RespuestaAutenticacion con el Token JWT generado y datos del usuario
     */
    public RespuestaAutenticacion iniciarSesion(SolicitudLogin solicitudLogin) {
        Authentication autenticacion = administradorAutenticacion.authenticate(
                new UsernamePasswordAuthenticationToken(
                        solicitudLogin.getCorreo(),
                        solicitudLogin.getContrasena()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(autenticacion);
        String token = proveedorToken.generarToken(autenticacion);

        Usuario usuario = repositorioUsuario.findByCorreo(solicitudLogin.getCorreo())
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Usuario no encontrado con el correo: " + solicitudLogin.getCorreo()));

        return new RespuestaAutenticacion(token, usuario.getCorreo(), usuario.getRol().getNombre());
    }

    /**
     * Registra un nuevo cliente en el sistema.
     * 
     * @param solicitudRegistro DTO con los datos del nuevo cliente
     * @return RespuestaAutenticacion con el Token JWT para iniciar sesión inmediatamente
     */
    @Transactional
    public RespuestaAutenticacion registrar(SolicitudRegistro solicitudRegistro) {
        if (repositorioUsuario.existsByCorreo(solicitudRegistro.getCorreo())) {
            throw new ExcepcionSolicitudIncorrecta("El correo electrónico ya se encuentra registrado en la plataforma");
        }

        Rol rolCliente = repositorioRol.findByNombre("ROLE_CLIENTE")
                .orElseThrow(() -> new ExcepcionRecursoNoEncontrado("Error del sistema: El rol ROLE_CLIENTE no existe en la base de datos"));

        Usuario usuario = new Usuario();
        usuario.setCorreo(solicitudRegistro.getCorreo());
        usuario.setContrasena(codificadorContrasena.encode(solicitudRegistro.getContrasena()));
        usuario.setActivo(true);
        usuario.setRol(rolCliente);

        Usuario usuarioGuardado = repositorioUsuario.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuarioGuardado);
        cliente.setNombre(solicitudRegistro.getNombre());
        cliente.setApellido(solicitudRegistro.getApellido());
        cliente.setTelefono(solicitudRegistro.getTelefono());

        repositorioCliente.save(cliente);

        SolicitudLogin solicitudLogin = new SolicitudLogin(solicitudRegistro.getCorreo(), solicitudRegistro.getContrasena());
        return iniciarSesion(solicitudLogin);
    }
}
