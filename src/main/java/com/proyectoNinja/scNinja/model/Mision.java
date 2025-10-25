package com.proyectoNinja.scNinja.model;

import com.proyectoNinja.scNinja.visitor.Exportable;
import com.proyectoNinja.scNinja.visitor.Visitor;
import jakarta.persistence.*;

@Entity
@Table(name = "misiones")
public class Mision implements Exportable{
    @Override
    public void accept(Visitor visitor) {
        visitor.exportar(this);
    }
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String rango; // D, C, B, A, S
    private int recompensa;

    public Mision(String nombre, String rango, int recompensa) {
        this.nombre = nombre;
        this.rango = rango;
        this.recompensa = recompensa;
    }

    // getters y setters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getRango() { return rango; }
    public int getRecompensa() { return recompensa; }

    @Override
    public String toString() {
        return "Mision{" +
                "nombre='" + nombre + '\'' +
                ", rango='" + rango + '\'' +
                ", recompensa=" + recompensa +
                '}';
    }
}

