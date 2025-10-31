package com.proyectoNinja.scNinja.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactiva CSRF (para permitir POST desde frontend)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Permite todo acceso
            )
            .formLogin(form -> form.disable()) // Desactiva el formulario de login
            .httpBasic(basic -> basic.disable()); // Desactiva autenticación básica
        return http.build();
    }
}

