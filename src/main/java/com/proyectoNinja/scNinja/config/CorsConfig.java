package com.proyectoNinja.scNinja.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Aplica CORS a todos los endpoints bajo /api
                        .allowedOrigins("http://localhost:3000", "http://frontend:3000") // Permite solicitudes desde tu frontend React
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos 
                        .allowedHeaders("*") // Permite todos los encabezados
                        .allowCredentials(true); // Si vas a usar cookies o autenticación basada en sesiones
            }
        };
    }
}
