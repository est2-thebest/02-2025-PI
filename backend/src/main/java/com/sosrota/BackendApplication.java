// src/main/java/com/sosrota/BackendApplication.java
package com.sosrota;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		System.out.println("🚀 SOS-Rota Backend iniciado com sucesso!");
		System.out.println("📡 API disponível em: http://localhost:8081");
		System.out.println("🗃️  H2 Console em: http://localhost:8081/h2-console");
	}
}