package com.proyectoNinja.scNinja.controller;
import com.proyectoNinja.scNinja.builder.NinjaBuilder;
import com.proyectoNinja.scNinja.model.Ninja;
import com.proyectoNinja.scNinja.service.NinjaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ninjas")
public class NinjaController {
    private final NinjaService service;
    public NinjaController(NinjaService service){
        this.service = service;
    }

    @GetMapping
    public List<Ninja> list() {return service.listarTodos();}

    @PostMapping("/factory")
    public ResponseEntity<?> createWithFactory(@RequestParam String nombre, @RequestParam String aldea){
        Ninja n = service.crearConFactory(nombre, aldea);
        return ResponseEntity.ok(n);
    }

    @PostMapping("/builder")
    public ResponseEntity<?> createWithBuilder(@RequestBody NinjaBuilder builder) {
        Ninja n = service.crearPersonalizado(builder);
        return ResponseEntity.ok(n);
    }

    @PostMapping("/{ninjaId}/aceptar/{misionId}")
    public ResponseEntity<?> aceptar(@PathVariable Long ninjaId,@PathVariable Long misionId){
        boolean ok = service.aceptarMision(ninjaId, misionId);
        if (ok) return ResponseEntity.ok("Mision completada, recompensa añadida");
        else return ResponseEntity.badRequest().body("No cumple con el rango para realizar la mision");
    }

    @PostMapping("{ninjaId}/entrenar")
    public ResponseEntity<?> entrenar(@PathVariable Long ninjaId, @RequestParam String atributo, @RequestParam int coste, @RequestParam int mejora){
        boolean ok = service.entrenar(ninjaId, atributo, coste, mejora);
        if (ok) return ResponseEntity.ok("Entrenamiento completado");
        return ResponseEntity.badRequest().body("Falta dinero o atributo invalido");
    }

    @PostMapping("/combate")
    public ResponseEntity<?> combate(@RequestParam Long n1, @RequestParam int j1, @RequestParam Long n2, @RequestParam int j2){
        String res = service.combate(n1, j1, n2, j1);
        return ResponseEntity.ok(res);
    }
}
