// src/main/java/com/sosrota/controller/TestController.java
package com.sosrota.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000") // Para o React
public class TestController {
    
    @GetMapping
    public String test() {
        return "✅ Backend SOS-Rota funcionando na porta 8081! 🚀";
    }
    
    @GetMapping("/health")
    public String health() {
        return "🚑 Sistema SOS-Rota - Status: ONLINE";
    }
}