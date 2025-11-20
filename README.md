# 🚑 SOS-Rota — Sistema Inteligente de Gestão de Emergências

## 📋 Sobre o Projeto

O **SOS-Rota** é um sistema desenvolvido para a empresa fictícia **Vitalis Tech**, em parceria com a Secretaria Municipal de Saúde de Cidália, com o objetivo de **otimizar o atendimento pré-hospitalar** por meio de despacho inteligente de ambulâncias.

Projeto do período **2025-2**
📅 **Entrega:** 08/12/2025

---

## 🎯 Objetivo do Sistema

Automatizar e agilizar o despacho de ambulâncias, calculando a melhor rota por meio do **Algoritmo de Dijkstra**, garantindo que cada ocorrência seja atendida dentro do **SLA definido pela gravidade**.

---

# 🏗️ Arquitetura do Sistema

## 🧩 Visão Geral

* **Backend:** Spring Boot (REST API)
* **Frontend:** React
* **Banco de Dados:** PostgreSQL
* **Linguagem Principal:** Java

---

## 🔧 Backend — Spring Boot

```
backend/
├── src/main/java/com/sosrota/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java (CORS)
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── OcorrenciaController.java
│   │   ├── AmbulanciaController.java
│   │   ├── DespachoController.java
│   │   └── RelatorioController.java
│   ├── service/
│   │   ├── OcorrenciaService.java
│   │   ├── AmbulanciaService.java
│   │   ├── DespachoService.java
│   │   ├── DijkstraService.java       ← Algoritmo de rota
│   │   └── AuthService.java
│   ├── repository/
│   │   ├── OcorrenciaRepository.java
│   │   ├── AmbulanciaRepository.java
│   │   ├── BairroRepository.java
│   │   └── UsuarioRepository.java
│   ├── model/
│   │   ├── entity/
│   │   │   ├── Ocorrencia.java
│   │   │   ├── Ambulancia.java
│   │   │   ├── Bairro.java
│   │   │   ├── Profissional.java
│   │   │   └── Usuario.java
│   │   └── dto/
│   │       ├── OcorrenciaDTO.java
│   │       ├── DespachoRequestDTO.java
│   │       └── LoginDTO.java
│   └── exception/
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   ├── application.properties
│   └── import.sql (dados iniciais)
└── pom.xml
```

## 🎨 Frontend — React

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── ocorrencias/
│   │   │   ├── OcorrenciaList.jsx
│   │   │   ├── OcorrenciaForm.jsx
│   │   │   └── OcorrenciaDetails.jsx
│   │   ├── ambulancias/
│   │   │   ├── AmbulanciaList.jsx
│   │   │   └── AmbulanciaForm.jsx
│   │   ├── despacho/
│   │   │   └── DespachoPanel.jsx
│   │   └── relatorios/
│   │       └── Dashboard.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── OcorrenciasPage.jsx
│   │   ├── AmbulanciasPage.jsx
│   │   └── RelatoriosPage.jsx
│   ├── services/
│   │   ├── api.js (config axios)
│   │   ├── authService.js
│   │   ├── ocorrenciaService.js
│   │   └── ambulanciaService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useOcorrencias.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── vite.config.js (ou webpack)
```

---

# 🚀 Stack Tecnológica

## **Backend**

* Java 17+
* Spring Boot
* Spring Data JPA
* Spring Security + JWT
* PostgreSQL
* Maven

## **Frontend**

* React 18 (JS/TS)
* React Router
* Axios
* Material-UI (MUI)
* Context API

---

# 📊 Funcionalidades

## 🔄 Cadastros (CRUD)

* [ ] Ocorrências
* [ ] Ambulâncias
* [ ] Profissionais
* [ ] Bases

## 🧠 Inteligência do Sistema

* [ ] Cálculo de rota mínima (Dijkstra)
* [ ] Despacho automático
* [ ] Validação de SLA por gravidade
* [ ] Controle de equipes

## 📈 Relatórios

* [ ] Dashboard geral
* [ ] Histórico de atendimentos
* [ ] Tempo médio de resposta
* [ ] Mapa de ocorrências por bairro

---

# 🔐 Regras de Negócio

## ⏱️ SLAs por Gravidade

| Gravidade | SLA    | Tipo de Ambulância |
| --------- | ------ | ------------------ |
| **Alta**  | 8 min  | UTI                |
| **Média** | 15 min | Básica             |
| **Baixa** | 30 min | Básica             |

## ✔️ Validações Principais

* Ambulância só pode ser despachada se estiver **Disponível** e com **equipe completa**.
* Profissional não pode estar em duas equipes ao mesmo tempo.
* Registros vinculados a histórico **não podem ser excluídos**.

---

# 🗃️ Modelo de Dados (Resumo)

```sql
bairros (id, nome)
bases (id, nome, bairro_id)
ambulancias (id, placa, tipo, status, base_id)
profissionais (id, nome, função, contato)
equipes (id, descrição, ambulancia_id)
ocorrencias (id, tipo, gravidade, local, data_hora, status)
atendimentos (id, ocorrencia_id, ambulancia_id, data_despacho)
usuarios (id, login, senha_hash, perfil)
```

---

# 👥 Divisão de Tarefas — Equipe (4 integrantes)

## 🔧 Backend Team (2 pessoas)

### **Backend Developer 1 – “Core & Segurança”**

## 🛠️ Configurar banco local com Docker (recomendado)

Para desenvolvimento em equipe recomendamos usar Docker Compose com PostgreSQL. Isso garante que todos usem a mesma versão do banco e um ambiente reprodutível.

Passos rápidos:

1. Copie variáveis se quiser customizar e crie um `.env` a partir de `.env.example` (opcional).
2. Suba o container do banco:

```bash
docker-compose up -d
```

3. Rode a aplicação (o Spring aplicará as migrations Flyway automaticamente). Se você tiver um `.env` ele fornecerá as variáveis utilizadas pelo Docker e pela aplicação:

```bash
cd backend
./mvnw spring-boot:run
```

Nota: copie `.env.example` para `.env` e ajuste se necessário. O `docker-compose` carrega automaticamente as variáveis do `.env` na raiz do repositório.

4. Acesse a API em `http://localhost:8081`.

Observações:
- Para recriar o banco e remover dados locais execute `docker-compose down -v` (cuidado: apaga o volume).
- As migrations estão em `backend/src/main/resources/db/migration`.

### ✅ Resolver mismatch de nome do banco (ex.: `sosrota` vs `sosrota_db`)

Se ao subir o container você vir mensagens como "FATAL: database \"sosrota\" does not exist", siga uma destas opções:

Opção A — alinhar a aplicação para usar o banco existente `sosrota_db` (recomendado):

1. Garanta que `.env` contém `DB_NAME=sosrota_db` (padrão do projeto).
2. Exporte variáveis do `.env` para seu shell e rode a app:

```bash
set -a; source .env; set +a
cd backend
./mvnw spring-boot:run
```

3. Se precisar recriar o container para aplicar mudanças no `docker-compose` (sem perder o volume de dados):

```bash
docker compose up -d --force-recreate --no-deps db
```

Opção B — criar o banco `sosrota` dentro do container (rápido, se preferir):

```bash
docker compose exec db psql -U ${DB_USER:-sosrota} -d postgres -c "CREATE DATABASE sosrota;"
```

Verificações úteis:

```bash
# listar databases no container
docker compose exec db psql -U ${DB_USER:-sosrota} -d postgres -c "\l"

# ver logs do container
docker compose logs -f db

# testar endpoint do backend
curl http://localhost:8081/api/test
```

Observação: alterar `.env` após o container ter sido criado exige recriar o serviço para que o Compose passe as novas variáveis ao container.


* Configuração do projeto (dependências, CORS)
* Autenticação e JWT
* Entidades JPA
* Repositórios
* Tratamento global de erros

### **Backend Developer 2 – “Business Logic & Algoritmos”**

* Implementação do algoritmo de **Dijkstra**
* Lógica de despacho
* Regras de negócio (SLA, equipes, compatibilidade)
* Controllers REST
* Consultas complexas com JPA/@Query

---

## 🎨 Frontend Team (2 pessoas)

### **Frontend Developer 1 – “Estrutura & Navegação”**

* Setup do projeto React
* Fluxo de autenticação
* Gerenciamento de estado (Context API)
* Layout base (Header/Sidebar)
* Configuração de serviços e interceptors

### **Frontend Developer 2 – “CRUDs & UI/UX”**

* Formulários e componentes de entrada
* Listas, tabelas, paginação e filtros
* Telas de relatório e dashboards
* Responsividade e refinamento visual

---

# 🛠️ Configuração do Ambiente

## Pré-requisitos

* Java 17+
* Node.js 16+
* PostgreSQL 12+
* Git

## Backend — Primeiros Passos

```bash
cd backend

# Configurar application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sosrota_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# Executar backend
./mvnw spring-boot:run
```

## Frontend — Primeiros Passos

```bash
cd frontend

npm install
npm run dev
```

---

# 📅 Cronograma de Desenvolvimento

| Semana           | Backend                        | Frontend                       |
| ---------------- | ------------------------------ | ------------------------------ |
| **1 (17–21/11)** | Setup, entidades, autenticação | Setup, layout base, login      |
| **2 (24–28/11)** | Dijkstra, despacho, endpoints  | CRUDs principais, dashboard    |
| **3 (01–05/12)** | Relatórios, validações, testes | Telas de relatório, integração |
| **4 (08/12)**    | **Entrega final**              | **Entrega final**              |

---

# 🔄 Fluxo de Integração

```
BACKEND TEAM ──────────── FRONTEND TEAM
  ↓                              ↓
Spring Boot API          React Components
  ↓                              ↓
DTOs & Endpoints         Services + Hooks
  ↓                              ↓
Swagger/OpenAPI          Mock → Real API
```

---

# 📚 Documentação e Recursos

* Documento oficial do Projeto Integrador
* Arquivo CSV — Bairros
* Arquivo CSV — Conexões entre bairros
* Material-UI Documentation

---

# 👨‍💼 Contato

**Professor Líder:** Luiz Mário Lustosa Pascoal
📧 [luizpascoal.senai@fieg.com.br](mailto:luizpascoal.senai@fieg.com.br)

---

# 💡 Guia de Desenvolvimento

## Backend

## Dev: run everything with Docker Compose (recommended)

There's a helper script that builds the backend JAR, starts the database, applies Flyway migrations and starts the frontend in Vite dev-mode and the backend container.

Usage:

```bash
# Make script executable once
chmod +x dev/run-dev.sh

# Run the whole dev stack (this will build the backend jar locally)
./dev/run-dev.sh
```

This script will:
- build backend (`./mvnw -DskipTests package`)
- `docker compose up -d db`
- `docker compose run --rm flyway migrate` (applies migrations)
- `docker compose up --build -d backend frontend_dev`

If your user needs sudo for docker, the script will retry the Flyway step with sudo.

## Full Docker deployment (build images inside compose)

If you prefer the Docker images to be built entirely by Docker (multi-stage build), you can run:

```bash
# build and start all services (db, flyway, backend, frontend)
docker compose up --build -d
```

Notes:
- The `backend` Dockerfile supports multi-stage builds in the repo; the compose build will execute a Maven build inside the builder image. This requires network access to download Maven base images and dependencies and may take longer on first run.
- If you already built the backend JAR locally (`./mvnw -DskipTests package`), the `backend` service can also copy that JAR into the image (faster). See the Dockerfile comment.

## Troubleshooting

- If you see `permission denied` when running `docker` or `docker compose`, add your user to the docker group:

```bash
sudo usermod -aG docker $USER
# then logout/login
```

- To reset the DB and run migrations from scratch:

```bash
docker compose down -v
docker compose up -d db
docker compose run --rm flyway migrate
```


* Utilize `@RestController`
* Use DTOs para comunicação
* Documente com Swagger
* Teste Dijkstra com os CSV reais

## Frontend

* Componentize tudo o que puder
* Use Context API estrategicamente
* Implemente loading e tratamento de erros
* Mantenha padrão visual (MUI)

## Ambas as equipes

* Comunicação diária
* Commits frequentes e descritivos
* Testes de integração desde a segunda semana
* Documentem decisões importantes

---

# 🚀 Como Contribuir

```bash
# Criar branch da feature
git checkout -b feature/nova-funcionalidade

# Commit
git commit -m "feat: adiciona CRUD de ocorrências"

# Enviar branch
git push origin feature/nova-funcionalidade
```

Abra um Pull Request e aguarde revisão.

---

📌 **Última atualização:** 17/11/2025

👥 **Equipe:** Caio de Paula, Eduarda Corazza, Gabriella Pio, Luiz Gustavo

---
