package sosrota.backend.config;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Database configuration that ensures Flyway migrations run before JPA
 * initialization.
 * This is critical to ensure database tables exist before Hibernate tries to
 * use them.
 */
@Configuration
public class DatabaseConfig {

  /**
   * Explicitly configure Flyway to run migrations.
   * This bean ensures migrations execute at application startup.
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
