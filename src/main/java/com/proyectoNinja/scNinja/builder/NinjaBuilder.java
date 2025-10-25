package com.proyectoNinja.scNinja.builder;

import com.proyectoNinja.scNinja.model.Jutsu;
import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.model.Aldea;
import java.util.ArrayList;
import java.util.List;

public class NinjaBuilder {
    private String nombre;
    private String rango = "Genin";
    private int ataque = 25;
    private int defensa = 25;
    private int chakra = 25;
    private Aldea aldea;
    private List<Jutsu> jutsus = new ArrayList<>();

    public NinjaBuilder setNombre(String nombre) { this.nombre = nombre; return this; }
    public NinjaBuilder setRango(String rango) { this.rango = rango; return this; }
    public NinjaBuilder setAtaque(int ataque) { this.ataque = ataque; return this; }
    public NinjaBuilder setDefensa(int defensa) { this.defensa = defensa; return this; }
    public NinjaBuilder setChakra(int chakra) { this.chakra = chakra; return this; }
    public NinjaBuilder setAldea(Aldea aldea) { this.aldea = aldea; return this; }
    public NinjaBuilder addJutsu(Jutsu jutsu) { this.jutsus.add(jutsu); return this; }

    public Ninja build() {
        Ninja n = new Ninja(nombre, rango, ataque, defensa, chakra, aldea);
        for (Jutsu jutsu : jutsus) n.addJutsu(jutsu);
        return n;
    }
}

