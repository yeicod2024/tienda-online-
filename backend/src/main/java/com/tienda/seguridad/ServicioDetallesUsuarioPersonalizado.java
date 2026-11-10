package com.tienda.seguridad;

import com.tienda.modulos.usuarios.Usuario;
import com.tienda.modulos.usuarios.RepositorioUsuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

/**
 * Servicio personalizado que conecta nuestro RepositorioUsuario con Spring Security.
 */
@Service
public class ServicioDetallesUsuarioPersonalizado implements UserDetailsService {

    private final RepositorioUsuario repositorioUsuario;

    public ServicioDetallesUsuarioPersonalizado(RepositorioUsuario repositorioUsuario) {
        this.repositorioUsuario = repositorioUsuario;
    }

    /**
     * Busca al usuario en MySQL por correo y lo convierte a un objeto UserDetails de Spring Security.
     * 
     * @param correo El correo enviado durante el login
     * @return UserDetails con el correo, contrasena encriptada y sus permisos/roles
     */
    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = repositorioUsuario.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el correo: " + correo));

        GrantedAuthority autoridad = new SimpleGrantedAuthority(usuario.getRol().getNombre());
        Set<GrantedAuthority> autoridades = Collections.singleton(autoridad);

        return new org.springframework.security.core.userdetails.User(
                usuario.getCorreo(),
                usuario.getContrasena(),
                usuario.getActivo(), // Habilitado
                true, // CuentaNoExpirada
                true, // CredencialesNoExpiradas
                true, // CuentaNoBloqueada
                autoridades
        );
    }
}
