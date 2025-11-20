-- V1__init.sql - create minimal schema for SOS-Rota
-- Tables: bairros (neighborhoods), nodes (points), edges (connections), users

CREATE TABLE IF NOT EXISTS bairros (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  -- quickfix: use TEXT instead of PostGIS GEOMETRY so migrations run on plain PostgreSQL
  geom_text TEXT
);

CREATE TABLE IF NOT EXISTS nodes (
    id SERIAL PRIMARY KEY,
    bairro_id INTEGER REFERENCES bairros(id),
    name VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS edges (
    id SERIAL PRIMARY KEY,
    source_node INTEGER NOT NULL REFERENCES nodes(id),
    target_node INTEGER NOT NULL REFERENCES nodes(id),
    distance_meters DOUBLE PRECISION,
    travel_time_seconds INTEGER
);

CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER'
);

-- Flyway schema table will track these migrations automatically
-- V1__init.sql - esquema inicial SOS-Rota
-- Tabelas básicas: bairro e aresta (grafo)

CREATE TABLE IF NOT EXISTS bairro (
  id serial PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS aresta (
  id serial PRIMARY KEY,
  origem_id integer NOT NULL REFERENCES bairro(id) ON DELETE CASCADE,
  destino_id integer NOT NULL REFERENCES bairro(id) ON DELETE CASCADE,
  distancia_km numeric NOT NULL
);

-- Tabelas essenciais (esqueleto) - complementar conforme design
CREATE TABLE IF NOT EXISTS ambulancia (
  id serial PRIMARY KEY,
  placa VARCHAR(50) UNIQUE NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  base_id integer REFERENCES bairro(id)
);

CREATE TABLE IF NOT EXISTS profissional (
  id serial PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  funcao VARCHAR(100) NOT NULL,
  contato VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS equipe (
  id serial PRIMARY KEY,
  descricao VARCHAR(255),
  ambulancia_id integer REFERENCES ambulancia(id)
);

CREATE TABLE IF NOT EXISTS equipe_profissional (
  equipe_id integer NOT NULL REFERENCES equipe(id) ON DELETE CASCADE,
  profissional_id integer NOT NULL REFERENCES profissional(id) ON DELETE CASCADE,
  PRIMARY KEY (equipe_id, profissional_id)
);

CREATE TABLE IF NOT EXISTS ocorrencia (
  id serial PRIMARY KEY,
  tipo VARCHAR(100),
  gravidade VARCHAR(20),
  bairro_id integer REFERENCES bairro(id),
  data_hora_abertura timestamp,
  status VARCHAR(50),
  observacao text
);

CREATE TABLE IF NOT EXISTS atendimento (
  id serial PRIMARY KEY,
  ocorrencia_id integer REFERENCES ocorrencia(id),
  ambulancia_id integer REFERENCES ambulancia(id),
  data_hora_despacho timestamp,
  data_hora_chegada timestamp,
  distancia_km numeric
);

CREATE TABLE IF NOT EXISTS usuario (
  id serial PRIMARY KEY,
  login VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(50)
);
