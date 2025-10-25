package com.proyectoNinja.scNinja.controller;

import com.proyectoNinja.scNinja.model.Mision;
import com.proyectoNinja.scNinja.repository.MisionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/misiones")
public class MisionController {
    private final MisionRepository repo;
    public MisionController(MisionRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Mision> listar(){ return repo.findAll(); }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Mision m){
        return ResponseEntity.ok(repo.save(m));
    }
    
}
