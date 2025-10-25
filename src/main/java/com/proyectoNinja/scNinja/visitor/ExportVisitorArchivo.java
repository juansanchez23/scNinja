package com.proyectoNinja.scNinja.visitor;

import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.model.Mision;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;


public class ExportVisitorArchivo implements Visitor {
    private final Path path;

    public ExportVisitorArchivo(String archivo) {
        this.path = Path.of(archivo);
        try{ if (!Files.exists(path)) Files.createFile(path); }
        catch (IOException e) { throw new RuntimeException(e); }
    }

    @Override
    public void exportar(Ninja ninja) {
        StringBuilder sb = new StringBuilder();
            sb.append("Ninja: ").append(ninja.getNombre()).append("\n");
            sb.append("Rango: ").append(ninja.getRango()).append("\n");
            sb.append("Ataque: ").append(ninja.getAtaque()).append("\n");
            sb.append("Defensa: ").append(ninja.getDefensa()).append("\n");
            sb.append("Chakra: ").append(ninja.getChakra()).append("\n");
            sb.append("Aldea: ").append(ninja.getAldea()!=null? ninja.getAldea().getNombre() : "N/A").append("\n");
            sb.append("Jutsus: ").append(ninja.getJutsus()).append("\n");
            sb.append("Dinero: ").append(ninja.getDinero()).append("\n");
            sb.append("------------------------\n");
            try {
                Files.writeString(path, sb.toString(), StandardOpenOption.APPEND);
            } catch (IOException e) {e.printStackTrace();}
    }
    @Override
    public void exportar(Mision mision) {
        String s = "Misión: " + mision.getNombre() + "\nRango" + mision.getRango() +
                "\nRecompensa: " + mision.getRecompensa() + "\n--------------------------\n";

        try {
            Files.writeString(path, s, StandardOpenOption.APPEND); 
        } catch (IOException e) { e.printStackTrace(); }
    }
}
