package sosrota.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import sosrota.backend.entity.Aresta;
import sosrota.backend.entity.Bairro;
import sosrota.backend.repository.ArestaRepository;
import sosrota.backend.repository.BairroRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

// [Contexto - 3] Problema - Carga de dados de arquivos CSV fornecidos (Bairros e Arestas)
@Component
public class DataSeeder implements CommandLineRunner {

    private final BairroRepository bairroRepository;
    private final ArestaRepository arestaRepository;

    public DataSeeder(BairroRepository bairroRepository, ArestaRepository arestaRepository) {
        this.bairroRepository = bairroRepository;
        this.arestaRepository = arestaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedBairros();
        seedArestas();
    }

    private void seedBairros() {
        if (bairroRepository.count() > 0) {
            return; // Já populado
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("bairros.csv").getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
            reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 2) {
                    Bairro bairro = new Bairro();
                    bairro.setId(Integer.parseInt(parts[0].trim()));
                    bairro.setNome(parts[1].trim());
                    bairroRepository.save(bairro);
                }
            }
            System.out.println("Bairros populados com sucesso.");
        } catch (Exception e) {
            System.err.println("Erro ao popular bairros: " + e.getMessage());
        }
    }

    private void seedArestas() {
        if (arestaRepository.count() > 0) {
            return; // Já populado
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("ruas_conexoes.csv").getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
            reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 4) {
                    Aresta aresta = new Aresta();

                    aresta.setId(Integer.parseInt(parts[0].trim()));
                    
                    Bairro origem = new Bairro();
                    origem.setId(Integer.parseInt(parts[1].trim()));
                    
                    Bairro destino = new Bairro();
                    destino.setId(Integer.parseInt(parts[2].trim()));
                    
                    aresta.setOrigem(origem);
                    aresta.setDestino(destino);
                    aresta.setDistanciaKm(Double.parseDouble(parts[3].trim()));
                    
                    arestaRepository.save(aresta);
                }
            }
            System.out.println("Arestas populadas com sucesso.");
        } catch (Exception e) {
            System.err.println("Erro ao popular arestas: " + e.getMessage());
        }
    }
}
