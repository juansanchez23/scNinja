package com.proyectoNinja.scNinja.visitor;

import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.model.Mision;

public interface Visitor {
    void exportar(Ninja ninja);
    void exportar(Mision mision);
}
