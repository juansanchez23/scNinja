package com.proyectoNinja.scNinja.service;

import com.proyectoNinja.scNinja.builder.NinjaBuilder;
import com.proyectoNinja.scNinja.factory.AldeaFactory;
import com.proyectoNinja.scNinja.factory.IwagaFactory;
import com.proyectoNinja.scNinja.factory.KirigaFactory;
import com.proyectoNinja.scNinja.factory.KonohaFactory;
import com.proyectoNinja.scNinja.factory.KumogaFactory;
import com.proyectoNinja.scNinja.factory.SunaFactory;
import com.proyectoNinja.scNinja.model.Aldea;
import com.proyectoNinja.scNinja.model.Jutsu;
import com.proyectoNinja.scNinja.model.Mision;
import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.repository.AldeaRepository;
import com.proyectoNinja.scNinja.repository.MisionRepository;
import com.proyectoNinja.scNinja.repository.NinjaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NinjaService {
    private final NinjaRepository  ninjaRepo;
    private final MisionRepository misionRepo;
    private final AldeaRepository aldeaRepo;
    
    public NinjaService(NinjaRepository ninjaRepo, MisionRepository misionRepo, AldeaRepository aldeaRepo){
        this.ninjaRepo = ninjaRepo;
        this.misionRepo = misionRepo;
        this.aldeaRepo = aldeaRepo;
    }

    // Crear por factory (elige aldea)
    public Ninja crearConFactory(String nombre, String aldeaName) {
        // Buscar o crear la aldea
        Aldea aldea = aldeaRepo.findByNombre(aldeaName)
            .orElseGet(() -> aldeaRepo.save(new Aldea(aldeaName)));
        
        // Crear ninja con stats según la aldea
        Ninja n = new Ninja(nombre, "Genin", 25, 25, 25, aldea);
        n.addJutsu(new Jutsu("Bunshinjutsu", 40, "Neutral", 10));
        
        return ninjaRepo.save(n);
    }

    // Crear personalizado con builder
    public Ninja crearPersonalizado(NinjaBuilder builder) {
        Aldea aldea = aldeaRepo.findByNombre(builder.getAldeaNombre())
        .orElseGet(() -> aldeaRepo.save(new Aldea(builder.getAldeaNombre())));
    
    // Construir el ninja con la aldea
    Ninja n = builder.build(aldea);
    return ninjaRepo.save(n);
    }

    public List<Ninja> listarTodos() { return ninjaRepo.findAll(); }
    public Optional<Ninja> buscar(Long id) { return ninjaRepo.findById(id); }
    public List<Mision> listarMisiones() { return misionRepo.findAll(); }

    // Aceptar mision: valida rango, da recompensa si ok
    public boolean aceptarMision(Long ninjaId, Long misionId) {
        Ninja n = ninjaRepo.findById(ninjaId).orElseThrow();
        Mision m = misionRepo.findById(misionId).orElseThrow();
        boolean ok = n.aceptarMision(m);
        if (ok) ninjaRepo.save(n);
        return ok;
    }

    // Entrenar (coste en dinero y mejora)
    public boolean entrenar(Long ninjaId, String atributo, int coste, int mejora) {
        Ninja n = ninjaRepo.findById(ninjaId).orElseThrow();
        boolean ok = n.entrenar(atributo, coste, mejora);
        if (ok) ninjaRepo.save(n);
        return ok;
    }

    // Combate entre dos ninjas, con indices de jutsu
    public String combate(Long id1, int j1Idx, Long id2, int j2Idx) {
        Ninja n1 = ninjaRepo.findById(id1).orElseThrow();
        Ninja n2 = ninjaRepo.findById(id2).orElseThrow();
        if (n1.getJutsus().isEmpty() || n2.getJutsus().isEmpty()) {
            throw new IllegalStateException("Ambos ninjas deben tener jutsus");
        }
        Jutsu j1 = n1.getJutsus().get(j1Idx);
        Jutsu j2 = n2.getJutsus().get(j2Idx);

        int resultado = Ninja.resolverCombate(n1, j1, n2, j2);
        if (resultado == 1) {
            n1.setAtaque(n1.getAtaque() + 5);
            n1.setChakra(n1.getChakra() + 2);
            n1.verificarRango();
            ninjaRepo.save(n1);
            return n1.getNombre() + " gana!";
        } else if (resultado == -1) {
            n2.setAtaque(n2.getAtaque() + 5);
            n2.setChakra(n2.getChakra() + 2);
            n2.verificarRango();
            ninjaRepo.save(n2);
            return n2.getNombre() + " gana!";
        } else {
            return "Empate";
        }
    }
    
}
