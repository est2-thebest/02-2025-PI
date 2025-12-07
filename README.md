# SOS-Rota

Sistema de Gestao de Emergencias para otimizacao de despacho de ambulancias utilizando o Algoritmo de Dijkstra. Desenvolvido para a disciplina de Projeto Integrador (2025-2).

## Tecnologias Utilizadas

**Backend**
* [Java 21](https://www.oracle.com/java/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [PostgreSQL](https://www.postgresql.org/)
* [Docker](https://www.docker.com/)

**Frontend**
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [Axios](https://axios-http.com/)

## Como Executar

### Pre-requisitos
* [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

### Execucao Rapida (Recomendado)

O projeto esta configurado para rodar inteiramente em containers (Banco de Dados, Backend e Frontend).

1. Clone o repositorio.
2. Execute o comando na raiz do projeto:

```bash
docker compose up --build
```

3. Acesse:
   * **Frontend:** http://localhost:5173
   * **Backend API:** http://localhost:8081

### Execucao Manual

Caso prefira rodar localmente sem Docker para os servicos de aplicacao:

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
*Nota: Certifique-se de ter um PostgreSQL rodando na porta 5432 com banco `sosrota_db` ou ajuste o `application.properties`.*

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades Principais

* **Gestao de Ocorrencias:** Abertura, despacho automatico e monitoramento de chamados.
* **Gestao de Frota:** Cadastro e controle de status de ambulancias e equipes.
* **Algoritmo de Rotas:** Calculo automatico da rota mais rapida utilizando o algoritmo de Dijkstra.
* **Relatorios:** Dashboard com metricas de atendimento e tempos de resposta (SLA).

## Equipe

* Caio de Paula
* Eduarda Corazza
* Gabriella Pio
* Luiz Gustavo

---
*Ultima atualizacao: 07/12/2025*
