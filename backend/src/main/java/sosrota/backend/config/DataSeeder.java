package sosrota.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import sosrota.backend.entity.Bairro;
import sosrota.backend.entity.Conexao;
import sosrota.backend.repository.BairroRepository;
import sosrota.backend.repository.ConexaoRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BairroRepository bairroRepository;
    private final ConexaoRepository conexaoRepository;

    public DataSeeder(BairroRepository bairroRepository, ConexaoRepository conexaoRepository) {
        this.bairroRepository = bairroRepository;
        this.conexaoRepository = conexaoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedBairros();
        seedConexoes();
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
            System.out.println("Bairros seeded successfully.");
        } catch (Exception e) {
            System.err.println("Error seeding bairros: " + e.getMessage());
        }
    }

    private void seedConexoes() {
        if (conexaoRepository.count() > 0) {
            return; // Já populado
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("ruas_conexoes.csv").getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
            reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 4) {
                    Conexao conexao = new Conexao();
                    // Use ID from CSV as 'aresta' table might expect it or we want consistency
                    conexao.setId(Integer.parseInt(parts[0].trim()));
                    
                    Bairro origem = new Bairro();
                    origem.setId(Integer.parseInt(parts[1].trim()));
                    
                    Bairro destino = new Bairro();
                    destino.setId(Integer.parseInt(parts[2].trim()));
                    
                    conexao.setBairroOrigem(origem);
                    conexao.setBairroDestino(destino);
                    conexao.setDistanciaKm(Double.parseDouble(parts[3].trim()));
                    
                    conexaoRepository.save(conexao);
                }
            }
            System.out.println("Conexoes seeded successfully.");
        } catch (Exception e) {
            System.err.println("Error seeding conexoes: " + e.getMessage());
        }
    }
}
