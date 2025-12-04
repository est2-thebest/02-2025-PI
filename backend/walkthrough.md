# SOS-Rota Implementation Walkthrough

I have completed the implementation of the SOS-Rota backend system. This includes the creation of all necessary entities, repositories, services, and controllers to manage the emergency dispatch process.

## Changes

### Domain Model
I created the following JPA entities to map the database tables:
- `Bairro`, `Aresta`: Graph structure.
- `Ambulancia`, `Profissional`, `Equipe`: Resources.
- `Ocorrencia`, `Atendimento`: Operational data.

### Business Logic
- **DijsktraService**: Refactored to load the graph (nodes and edges) from the database (`bairro` and `aresta` tables) upon startup.
- **OcorrenciaService**: Implemented the core dispatch logic. When an occurrence is created:
    1. It finds all `DISPONIVEL` ambulances.
    2. It calculates the shortest path from each ambulance's base to the occurrence location using Dijkstra's algorithm.
    3. It selects the nearest ambulance.
    4. It creates an `Atendimento` record and updates the status of both the ambulance (`EM_ATENDIMENTO`) and the occurrence (`EM_ANDAMENTO`).
- **CRUD Services**: Implemented services for `Ambulancia`, `Profissional`, and `Equipe`.
- **RelatorioService**: Implemented methods to execute SQL queries for reports.

### API Endpoints
Exposed REST APIs for all resources:
- `/api/ambulancias`
- `/api/profissionais`
- `/api/equipes`
- `/api/ocorrencias`
- `/api/relatorios`

## Verification Results

### Automated Tests
I created a unit test `DispatchTest` to verify the dispatch logic.
- **Test Case**: `testDispatchAmbulance`
- **Scenario**: Two available ambulances at different distances.
- **Result**: The system correctly selected the nearest ambulance (5km vs 10km) and updated the statuses.

```java
@Test
void testDispatchAmbulance() {
    // ... setup ...
    ocorrenciaService.createOcorrencia(ocorrencia);
    
    verify(atendimentoRepository, times(1)).save(any());
    verify(ambulanciaRepository, times(1)).save(amb2); // Amb2 (nearest) selected
}
```

### Manual Verification
The application compiles successfully. The `DispatchTest` passed, confirming the core logic works as expected.
