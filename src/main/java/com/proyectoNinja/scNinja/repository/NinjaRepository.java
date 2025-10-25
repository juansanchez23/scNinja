package com.proyectoNinja.scNinja.repository;

import com.proyectoNinja.scNinja.model.Ninja;
import org.springframework.data.jpa.repository.JpaRepository;
public interface NinjaRepository extends JpaRepository<Ninja, Long> {}