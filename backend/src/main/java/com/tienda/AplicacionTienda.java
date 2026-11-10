package com.tienda;

// Importaciones de Spring Boot necesarias para arrancar la aplicación
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase Principal de la aplicación Spring Boot.
 * 
 * ¿QUÉ ES ESTO?
 * Es el punto de inicio (entry point) de todo nuestro Backend.
 * Al ejecutar esta clase, Spring Boot inicia el servidor web interno (Tomcat),
 * se conecta a la base de datos MySQL `tienda_es` y activa los controladores REST
 * en el puerto 8081.
 */
@SpringBootApplication
public class AplicacionTienda {

    /**
     * Método principal (main) estándar de Java.
     * 
     * @param args Argumentos recibidos por línea de comandos (opcionales)
     */
    public static void main(String[] args) {
        // SpringApplication.run() realiza el arranque completo de Spring:
        // 1. Carga application.properties
        // 2. Conecta la base de datos MySQL (tienda_es)
        // 3. Inicia el servidor web en el puerto 8081
        SpringApplication.run(AplicacionTienda.class, args);
    }

}
