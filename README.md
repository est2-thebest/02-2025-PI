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
📁 sosrota-backend/
├── src/main/java/com/sosrota/
│   ├── config/          # Configurações (Security, CORS)
│   ├── controller/      # APIs REST
│   ├── service/         # Regras de negócio
│   ├── repository/      # Acesso ao banco – JPA
│   ├── model/
│   │   ├── entity/      # Entidades
│   │   └── dto/         # Data Transfer Objects
│   └── exception/       # Tratamento de erros
```

## 🎨 Frontend — React

```
📁 sosrota-frontend/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Telas da aplicação
│   ├── services/        # Comunicação com a API
│   ├── context/         # Estado global
│   └── utils/           # Funções auxiliares
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
cd sosrota-backend

# Configurar application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sosrota_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# Executar backend
./mvnw spring-boot:run
```

## Frontend — Primeiros Passos

```bash
cd sosrota-frontend

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
