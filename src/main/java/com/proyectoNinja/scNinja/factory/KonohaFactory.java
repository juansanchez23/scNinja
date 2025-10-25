package com.proyectoNinja.scNinja.factory;


import com.proyectoNinja.scNinja.model.Jutsu;
import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.model.Aldea;
// Fábrica concreta: Konoha
public class KonohaFactory implements AldeaFactory {
    @Override
    public Ninja crearNinja(String nombre) {
        Aldea a = new Aldea("Konoha");
        Ninja n = new Ninja(nombre, "Genin", 25, 25, 25, a);
        n.addJutsu(new Jutsu("Bunshinjutsu",40,"Neutral",10));
        return n;            
    }
}
