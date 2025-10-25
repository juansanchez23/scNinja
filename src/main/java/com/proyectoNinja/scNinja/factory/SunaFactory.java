package com.proyectoNinja.scNinja.factory;

import com.proyectoNinja.scNinja.model.Jutsu;
import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.model.Aldea;

public class SunaFactory implements AldeaFactory {
    @Override
    public Ninja crearNinja(String nombre) {
        Aldea a = new Aldea("Suna");
        Ninja n = new Ninja(nombre, "Genin", 25, 25, 25, a);
        n.addJutsu(new Jutsu("Kage Bunshin", 20, "Nutral", 25));
        return n;
    }
}
