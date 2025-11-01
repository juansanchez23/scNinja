package com.proyectoNinja.scNinja.repository;

import com.proyectoNinja.scNinja.model.Aldea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AldeaRepository extends JpaRepository<Aldea, Long> {
    Optional<Aldea> findByNombre(String nombre);
}