package com.proyectoNinja.scNinja.factory;


import com.proyectoNinja.scNinja.model.Jutsu;
import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.model.Aldea;
public class KumogaFactory implements AldeaFactory {
    @Override
    public Ninja crearNinja(String nombre) {
        Aldea a = new Aldea("Kumoga");
        Ninja n = new Ninja(nombre, "Genin", 25, 25, 25, a);
        n.addJutsu(new Jutsu("Bunshinjutsu",40,"Neutral",10));
        return n;  
    }
    
}
