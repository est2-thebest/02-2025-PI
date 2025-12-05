# SOS-Rota Implementation Plan

The goal is to complete the SOS-Rota system by implementing the missing backend components required to manage emergency dispatches in Cidália. This includes mapping database tables to Java entities, creating CRUD services, implementing the core dispatch logic using Dijkstra's algorithm (loading data from the DB), and generating reports.

## User Review Required
> [!IMPORTANT]
> I will be refactoring `DijsktraService` to load graph data from the database (`bairro` and `aresta` tables) instead of using hardcoded values. This ensures the graph reflects the actual data seeded from CSVs.

## Proposed Changes

### Domain Layer (Entities)
Create JPA Entities to map existing database tables.
#### [NEW] [Bairro.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/entity/Bairro.java)
- Maps to `bairro` table.
#### [NEW] [Aresta.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/entity/Aresta.java)
- Maps to `aresta` table.
#### [NEW] [Ambulancia.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/entity/Ambulancia.java)
- Maps to `ambulancia` table.
#### [NEW] [Profissional.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/entity/Profissional.java)
- Maps to `profissional` table.
#### [NEW] [Equipe.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/entity/Equipe.java)
- Maps to `equipe` table.
#### [NEW] [Ocorrencia.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/entity/Ocorrencia.java)
- Maps to `ocorrencia` table.
#### [NEW] [Atendimento.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/entity/Atendimento.java)
- Maps to `atendimento` table.

### Repository Layer
Create repositories for the new entities.
#### [NEW] [BairroRepository.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/repository/BairroRepository.java)
#### [NEW] [ArestaRepository.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/repository/ArestaRepository.java)
#### [NEW] [AmbulanciaRepository.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/repository/AmbulanciaRepository.java)
#### [NEW] [ProfissionalRepository.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/repository/ProfissionalRepository.java)
#### [NEW] [EquipeRepository.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/repository/EquipeRepository.java)
#### [NEW] [OcorrenciaRepository.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/repository/OcorrenciaRepository.java)
#### [NEW] [AtendimentoRepository.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/repository/AtendimentoRepository.java)

### Service Layer
Implement business logic.
#### [MODIFY] [DijsktraService.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/service/DijsktraService.java)
- Inject `BairroRepository` and `ArestaRepository`.
- Load graph from DB in `@PostConstruct`.
#### [NEW] [AmbulanciaService.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/service/AmbulanciaService.java)
- CRUD for Ambulances.
#### [NEW] [ProfissionalService.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/service/ProfissionalService.java)
- CRUD for Professionals.
#### [NEW] [EquipeService.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/service/EquipeService.java)
- CRUD for Teams.
#### [NEW] [OcorrenciaService.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/service/OcorrenciaService.java)
- Create Occurrence.
- **Dispatch Logic**: Find nearest available ambulance using `DijsktraService`, create `Atendimento`, update status.
#### [NEW] [RelatorioService.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/service/RelatorioService.java)
- Execute custom SQL queries for reports.

### Controller Layer
Expose REST endpoints.
#### [NEW] [AmbulanciaController.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/controller/AmbulanciaController.java)
#### [NEW] [ProfissionalController.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/controller/ProfissionalController.java)
#### [NEW] [EquipeController.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/controller/EquipeController.java)
#### [NEW] [OcorrenciaController.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/controller/OcorrenciaController.java)
#### [NEW] [RelatorioController.java](file:///c:/Users/CaioBrito/Projetos/02-2025-PI/backend/src/main/java/sosrota/backend/controller/RelatorioController.java)

## Verification Plan

### Automated Tests
- I will run `mvn test` to ensure the context loads and basic tests pass.
- I will create a new test `DispatchTest` to verify that an ambulance is correctly assigned to an occurrence based on distance.

### Manual Verification
- I will verify that the application starts without errors.
- I will verify that the graph is loaded correctly from the DB by logging the node/edge count on startup.
