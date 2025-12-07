package sosrota.backend.config;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração de banco de dados e migrações.
 * Garante que o Flyway execute antes da inicialização do JPA.
 */
@Configuration
public class DatabaseConfig {

  /**
   * Configura e executa as migrações do Flyway.
   *
   * @param dataSource Fonte de dados
   * @return Instância do Flyway
   */
  @Bean(initMethod = "migrate")
  public Flyway flyway(DataSource dataSource) {
    return Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration")
        .schemas("public")
        .table("flyway_schema_history")
        .baselineOnMigrate(true)
        .load();
  }
}
