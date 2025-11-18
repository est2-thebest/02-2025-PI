# 🚑 SOS-Rota - Sistema Inteligente de Gestão de Emergências

## 📋 Sobre o Projeto

Sistema desenvolvido para a **Vitalis Tech** (empresa fictícia) em parceria com a Secretaria Municipal de Saúde de Cidália. O **SOS-Rota** é uma solução tecnológica para otimizar o atendimento pré-hospitalar através de roteamento inteligente de ambulâncias.

**Período:** 2025-2 | **Entrega:** 08/12/2025

## 🎯 Objetivo

Automatizar e otimizar o processo de despacho de ambulâncias em emergências médicas, calculando a melhor rota usando o algoritmo de Dijkstra e respeitando SLAs baseados na gravidade dos casos.

## 🏗️ Arquitetura do Sistema

### **Backend** - Spring Boot (REST API)
```
📁 sosrota-backend/
├── 📂 src/main/java/com/sosrota/
│   ├── config/          # Configurações (Security, CORS)
│   ├── controller/      # APIs REST (@RestController)
│   ├── service/         # Lógica de negócio
│   ├── repository/      # Acesso a dados (JPA)
│   ├── model/
│   │   ├── entity/      # Entidades JPA
│   │   └── dto/         # Objetos de transferência
│   └── exception/       # Tratamento de erros
```

### **Frontend** - React
```
📁 sosrota-frontend/
├── 📂 src/
│   ├── components/      # Componentes React
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Comunicação com API
│   ├── context/         # Gerenciamento de estado
│   └── utils/           # Funções auxiliares
```

## 🚀 Stack Tecnológica

### **Backend**
- **Java 17+** com Spring Boot
- **Spring Data JPA** para persistência
- **Spring Security** para autenticação
- **PostgreSQL** banco de dados
- **Maven** para gerenciamento de dependências

### **Frontend**
- **React 18** com JavaScript/TypeScript
- **React Router** para navegação
- **Axios** para chamadas HTTP
- **Material-UI** para componentes visuais
- **Context API** para gerenciamento de estado

## 📊 Funcionalidades Principais

### ✅ Cadastros (CRUD)
- [ ] **Ocorrências** - Emergências e acidentes
- [ ] **Ambulâncias** - Frota veicular (Básica/UTI)
- [ ] **Profissionais** - Equipes de saúde
- [ ] **Bases** - Pontos de partida das ambulâncias

### 🧠 Lógica Inteligente
- [ ] **Algoritmo de Dijkstra** - Cálculo de rotas ótimas
- [ ] **Despacho Automático** - Seleção de ambulância mais adequada
- [ ] **Validação de SLA** - Tempo máximo por gravidade
- [ ] **Gestão de Equipes** - Alocação de profissionais

### 📈 Relatórios
- [ ] Dashboard com métricas
- [ ] Histórico de atendimentos
- [ ] Tempo médio de resposta
- [ ] Mapa de ocorrências por bairro

## 🔐 Regras de Negócio

### **SLAs por Gravidade**
- **Alta**: 8 minutos → Ambulância UTI
- **Média**: 15 minutos → Ambulância Básica
- **Baixa**: 30 minutos → Ambulância Básica

### **Validações**
- Ambulância só despachada se estiver **Disponível** e com **equipe completa**
- Profissional não pode estar em duas equipes simultaneamente
- Não é permitido excluir registros com histórico

## 🗃️ Modelo de Dados

```sql
-- Entidades principais:
bairros (id, nome)
bases (id, nome, bairro_id)  
ambulancias (id, placa, tipo, status, base_id)
profissionais (id, nome, função, contato)
equipes (id, descrição, ambulancia_id)
ocorrencias (id, tipo, gravidade, local, data_hora, status)
atendimentos (id, ocorrencia_id, ambulancia_id, data_despacho)
usuarios (id, login, senha_hash, perfil)
```

👥 DIVISÃO DE TAREFAS - EQUIPE 4 PESSOAS
🔧 BACKEND TEAM (2 PESSOAS)
Backend Developer 1 - "Core & Segurança"

    Configuração Spring Boot (projeto, dependências, CORS)

    Spring Security (autenticação JWT, hash de senhas BCrypt)

    Entidades JPA (mapeamento completo do banco)

    Repositories (JPA queries básicas)

    Validações e Exceptions (tratamento de erros global)

Backend Developer 2 - "Lógica de Negócio & Algoritmos"

    Algoritmo de Dijkstra (cálculo de rotas - CORE do projeto)

    Serviços de Despacho (lógica de seleção de ambulâncias)

    Regras de Negócio (SLA, validações de equipes, compatibilidade)

    Controllers REST (endpoints da API)

    Consultas Complexas (@Query, joins, relatórios)

🎨 FRONTEND TEAM (2 PESSOAS)
Frontend Developer 1 - "Estrutura & Navegação"

    Configuração React (projeto, router, estrutura)

    Sistema de Autenticação (login, proteção de rotas)

    Context/State Management (AuthContext, AppContext)

    Layout Principal (Header, Sidebar, Dashboard)

    Configuração API (axios, interceptors, services)

Frontend Developer 2 - "CRUDs & Interface"

    Componentes de Formulário (todos os CRUDs)

    Listas e Tabelas (data grids, filtros, paginação)

    UI/UX e Estilização (Material-UI, CSS, temas)

    Telas de Relatório (gráficos, dashboards, métricas)

    Responsividade (mobile friendly)

🗃️ Modelo de Dados
sql

-- Entidades principais:
bairros (id, nome)
bases (id, nome, bairro_id)  
ambulancias (id, placa, tipo, status, base_id)
profissionais (id, nome, função, contato)
equipes (id, descrição, ambulancia_id)
ocorrencias (id, tipo, gravidade, local, data_hora, status)
atendimentos (id, ocorrencia_id, ambulancia_id, data_despacho)
usuarios (id, login, senha_hash, perfil)

🛠️ Configuração do Ambiente
Pré-requisitos

    Java 17 ou superior

    Node.js 16+ e npm

    PostgreSQL 12+

    Git

Backend - Primeiros Passos
bash

cd sosrota-backend

# Configurar application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sosrota_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# Executar
./mvnw spring-boot:run

Frontend - Primeiros Passos
bash

cd sosrota-frontend

# Instalar dependências
npm install

# Executar
npm run dev

📅 Cronograma de Desenvolvimento
Semana 1 (17-21/11) - Setup & Base
Backend Team	Frontend Team
✅ Setup Spring Boot + BD	✅ Setup React + Router
✅ Entidades JPA	✅ Componentes base
✅ Autenticação JWT	✅ Sistema de login
Semana 2 (24-28/11) - Funcionalidades Core
Backend Team	Frontend Team
✅ Algoritmo Dijkstra	✅ CRUD Ocorrências
✅ Serviços de Despacho	✅ CRUD Ambulâncias
✅ Endpoints REST	✅ Dashboard principal
Semana 3 (01-05/12) - Polimento & Relatórios
Backend Team	Frontend Team
✅ Relatórios + Consultas	✅ Telas de relatório
✅ Validações finais	✅ Integração completa
✅ Testes de performance	✅ Polimento UI/UX
Semana 4 (08/12) - Entrega

| ✅ Apresentação final | ✅ Documentação | ✅ Deploy |
🔄 Fluxo de Integração
text

BACKEND TEAM (2) ────────────────────── FRONTEND TEAM (2)
     ↓                                        ↓
Spring Boot API                       React Components
     ↓                                        ↓
DTOs + Endpoints                      Services + Hooks
     ↓                                        ↓
Swagger Documentation                 Mock Data → Real API

📚 Documentação e Recursos

    📄 Documento do Projeto Integrador

    🗃️ Dados dos Bairros (CSV)

    🛣️ Conexões entre Bairros (CSV)

    🎨 Material-UI Documentation

👨‍💼 Contatos

Professor Líder: Luiz Mário Lustosa Pascoal
Email: luizpascoal.senai@fieg.com.br

💡 Guia de Desenvolvimento
Para o BACKEND:

    Use @RestController para todos os endpoints

    Implemente DTOs para transferência de dados

    Documente APIs com Swagger/OpenAPI

    Teste o algoritmo de Dijkstra com dados reais dos CSV

Para o FRONTEND:

    Siga componentização e reutilização

    Use Context API para estado global

    Implemente loading states e tratamento de erros

    Mantenha consistência visual com Material-UI

Para AMBAS EQUIPES:

    Comunique-se diariamente sobre progresso e bloqueios

    Faça commits frequentes com mensagens descritivas

    Testem integração front/back desde a semana 2

    Documentem decisões técnicas importantes

🚀 Como Contribuir

    Faça fork do repositório

    Crie branch para sua feature: git checkout -b feature/nova-funcionalidade

    Commit suas mudanças: git commit -m 'feat: adiciona CRUD de ocorrências'

    Push para a branch: git push origin feature/nova-funcionalidade

    Abra um Pull Request

📞 Vamos construir um sistema incrível juntos!

Última atualização: 17/11/25
Equipe: Caio de Paula, Eduarda Corazza, Gabriella Pio, Luiz Gustavo
