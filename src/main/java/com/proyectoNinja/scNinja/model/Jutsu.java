package com.proyectoNinja.scNinja.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "jutsus")
public class Jutsu {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private int poder;
    private String tipo; 
    private int chakraCost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ninja_id")
    @JsonIgnoreProperties({"jutsus", "aldea"}) // ✅ Evitar referencia circular
    private Ninja ninja;

    // ✅ Constructor vacío requerido por JPA
    public Jutsu() {}

    public Jutsu(String nombre, int poder, String tipo, int chakraCost) {
        this.nombre = nombre;
        this.poder = poder;
        this.tipo = tipo;
        this.chakraCost = chakraCost;
    }

    // getters y setters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public int getPoder() {return poder;}
    public String getTipo() { return tipo; }
    public int getChakraCost() { return chakraCost; }
    public Ninja getNinja() { return ninja; }
    public void setNinja(Ninja ninja) { this.ninja = ninja; }

    @Override
    public String toString() {
        return nombre + " (" + tipo + ", poder:"+ poder + ", coste:" + chakraCost + ")";
    }
}