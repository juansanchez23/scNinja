package com.proyectoNinja.scNinja.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
//import java.util.List;

@Entity
@Table(name = "aldeas")
public class Aldea {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    public Aldea() {}
    public Aldea(String nombre) { this.nombre = nombre; }

    // getters / setters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    @Override public String toString(){ return nombre; }
}