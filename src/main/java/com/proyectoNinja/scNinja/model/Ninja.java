package com.proyectoNinja.scNinja.model;
import java.util.List;

import com.proyectoNinja.scNinja.visitor.Exportable;
import com.proyectoNinja.scNinja.visitor.Visitor;
import jakarta.persistence.*;
import java.util.ArrayList;


@Entity
@Table(name = "ninjas")
public class Ninja implements Exportable{
    @Override
    public void accept(Visitor visitor) {
        visitor.exportar(this);
    }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String rango; // Genin, Chunin, Jonin, Kage
    private int ataque;
    private int defensa;
    private int chakra;
    private int dinero = 0;


    @ManyToOne
    @JoinColumn(name = "aldea_id")
    private Aldea aldea;

     @OneToMany(mappedBy = "ninja", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Jutsu> jutsus = new ArrayList<>();


    public Ninja(String nombre, String rango, int ataque, int defensa, int chakra, Aldea aldea) {
        this.nombre = nombre;
        this.rango = rango;
        this.ataque = ataque;
        this.defensa = defensa;
        this.chakra = chakra;
        this.aldea = aldea;
        this.dinero = 0;
    }

    // Getters y setters 
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getRango() { return rango; }
    public int getAtaque() { return ataque; }
    public int getDefensa() { return defensa; }
    public int getChakra() { return chakra; }
    public Aldea getAldea() { return aldea; }
    public int getDinero() { return dinero; }
    public List<Jutsu> getJutsus() { return jutsus; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setRango(String rango) { this.rango = rango; }
    public void setAtaque(int ataque) { this.ataque = ataque; }
    public void setDefensa(int defensa) { this.defensa = defensa; }
    public void setChakra(int chakra) { this.chakra = chakra; }
    public void setAldea(Aldea aldea) { this.aldea = aldea; }

    public void addJutsu(Jutsu j) {
        j.setNinja(this);
        this.jutsus.add(j);
    }

    public void addDinero(int v) { this.dinero += v; }
    public boolean gastarDinero(int v) {
        if (this.dinero < v) return false;
        this.dinero -= v; return true;
    }

    // Mostrar info
    public void mostrarInfo() {
        System.out.println(this.toString());
    }

    @Override
    public String toString() {
        return "Ninja{" +
                "nombre='" + nombre + '\'' +
                ", rango='" + rango + '\'' +
                ", ataque=" + ataque +
                ", defensa=" + defensa +
                ", chakra=" + chakra +
                ", aldea='" + (aldea!=null?aldea.getNombre():"null") + '\'' +
                ", jutsus=" + jutsus +
                '}';
    }

    public boolean aceptarMision(Mision mision) {
    // Validamos si el rango del ninja le permite tomar la misión
    if (puedeTomarMision(this.rango, mision.getRango())) {
        System.out.println(nombre + " ha aceptado la misión: " + mision.getNombre() +
                " (Recompensa: " + mision.getRecompensa() + " ryo)");
        this.addDinero(mision.getRecompensa());
        return true;
    } else {
        System.out.println(nombre + " NO tiene rango suficiente para la misión: " + mision.getNombre());
        return false;
    }
}

// Método privado para comparar rangos
private boolean puedeTomarMision(String rangoNinja, String rangoMision) {
    String[] rangos = {"D", "C", "B", "A", "S"}; 
    int nivelNinja = -1, nivelMision = -1;

    // Definimos hasta qué nivel de misión puede llegar cada rango de ninja
    String maxRangoPermitido;
    switch (rangoNinja.toLowerCase()) {
        case "genin": maxRangoPermitido = "C"; break;   
        case "chunin": maxRangoPermitido = "B"; break; 
        case "jonin": maxRangoPermitido = "A"; break;  
        case "kage": maxRangoPermitido = "S"; break;   
        default: maxRangoPermitido = "D"; 
    }

    for (int i = 0; i < rangos.length; i++) {
        if (rangos[i].equalsIgnoreCase(maxRangoPermitido)) nivelNinja = i;
        if (rangos[i].equalsIgnoreCase(rangoMision)) nivelMision = i;
    }

    return nivelNinja >= nivelMision;
}

//private int indexOf(String[] arr, String val) {
        //for (int i=0;i<arr.length;i++) if (arr[i].equalsIgnoreCase(val)) return i;
        //return -1;
    //}

public boolean entrenar(String atributo, int coste,int mejora) {
    if (!gastarDinero(coste)) return false;
        switch (atributo.toLowerCase()) {
            case "ataque": this.ataque += mejora; break;
            case "defensa": this.defensa += mejora; break;
            case "chakra": this.chakra += mejora; break;
            default: return false;
        }
        verificarRango();
        return true;
    }

public static void combate(Ninja n1, int j1Idx, Ninja n2, int j2Idx) {
    System.out.println("\nCombate entre " + n1.getNombre() + " y " + n2.getNombre());

    Jutsu j1 = n1.getJutsus().get(j1Idx);
    Jutsu j2 = n2.getJutsus().get(j2Idx);

    int poderN1 = n1.getAtaque() + j1.getPoder() - n2.getDefensa();
    int poderN2 = n2.getAtaque() + j2.getPoder() - n1.getDefensa();

    System.out.println(n1.getNombre() + " usa " + j1 + " → Daño: " + poderN1);
    System.out.println(n2.getNombre() + " usa " + j2 + " → Daño: " + poderN2);

    if (poderN1 > poderN2) {
        System.out.println( n1.getNombre() + " gana el combate!");
        n1.entrenar("ataque", 0, 5);
    } else if (poderN2 > poderN1) {
        System.out.println( n2.getNombre() + " gana el combate!");
        n2.entrenar("ataque", 0, 5);
    } else {
        System.out.println("¡Empate!");
    }
}
public void verificarRango() {
    if (rango.equalsIgnoreCase("Genin") && ataque >= 100 && defensa >= 100 && chakra >= 100) {
        rango = "Chunin";
        System.out.println(nombre + " ha subido de rango a Chunin ");
    } else if (rango.equalsIgnoreCase("Chunin") && ataque >= 200 && defensa >= 200 && chakra >= 200) {
        rango = "Jonin";
        System.out.println(nombre + " ha subido de rango a Jonin ");
    } else if (rango.equalsIgnoreCase("Jonin") && ataque >= 300 && defensa >= 300 && chakra >= 300) {
        rango = "Kage";
        System.out.println(nombre + " ha alcanzado el rango Kage ");
    }
}
// Combate: devuelve 1 si n1 gana, -1 si pierde, 0 empate. Este método no modifica dinero (puede mejorar stats).
    public static int resolverCombate(Ninja n1, Jutsu j1, Ninja n2, Jutsu j2) {
        int dmg1 = Math.max(0, n1.getAtaque() + j1.getPoder() - n2.getDefensa());
        int dmg2 = Math.max(0, n2.getAtaque() + j2.getPoder() - n1.getDefensa());
        if (dmg1 > dmg2) return 1;
        if (dmg2 > dmg1) return -1;
        return 0;
    }

}


