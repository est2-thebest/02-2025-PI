-- ============================================================
-- V1__init.sql
-- Estrutura inicial completa do banco SOS-Rota
-- ============================================================

-- Tabela de bairros (vértices do grafo)
CREATE TABLE IF NOT EXISTS bairro (
  id INTEGER PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- Tabela de arestas (ruas ligando bairros)
CREATE TABLE IF NOT EXISTS aresta (
  id INTEGER PRIMARY KEY,
  origem_id INTEGER NOT NULL REFERENCES bairro(id) ON DELETE CASCADE,
  destino_id INTEGER NOT NULL REFERENCES bairro(id) ON DELETE CASCADE,
  distancia_km NUMERIC NOT NULL
);

-- Ambulâncias
CREATE TABLE IF NOT EXISTS ambulancia (
  id SERIAL PRIMARY KEY,
  placa VARCHAR(50) UNIQUE NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  base_id INTEGER REFERENCES bairro(id)
);

-- Profissionais
CREATE TABLE IF NOT EXISTS profissional (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  funcao VARCHAR(100) NOT NULL,
  contato VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE
);

-- Equipes
CREATE TABLE IF NOT EXISTS equipe (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255),
  ambulancia_id INTEGER REFERENCES ambulancia(id)
);

-- Relação equipe-profissional
CREATE TABLE IF NOT EXISTS equipe_profissional (
  equipe_id INTEGER NOT NULL REFERENCES equipe(id) ON DELETE CASCADE,
  profissional_id INTEGER NOT NULL REFERENCES profissional(id) ON DELETE CASCADE,
  PRIMARY KEY (equipe_id, profissional_id)
);

-- Ocorrências
CREATE TABLE IF NOT EXISTS ocorrencia (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100),
  gravidade VARCHAR(20),
  bairro_id INTEGER REFERENCES bairro(id),
  data_hora_abertura TIMESTAMP,
  status VARCHAR(50),
  observacao TEXT
);

-- Atendimentos
CREATE TABLE IF NOT EXISTS atendimento (
  id SERIAL PRIMARY KEY,
  ocorrencia_id INTEGER REFERENCES ocorrencia(id),
  ambulancia_id INTEGER REFERENCES ambulancia(id),
  data_hora_despacho TIMESTAMP,
  data_hora_chegada TIMESTAMP,
  distancia_km NUMERIC
);

-- Usuários (login do sistema)
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(50)
);
