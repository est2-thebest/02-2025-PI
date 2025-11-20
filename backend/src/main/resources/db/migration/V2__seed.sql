-- V2__seed.sql - minimal seed data for testing

INSERT INTO bairros (nome) VALUES ('Centro') ON CONFLICT DO NOTHING;
INSERT INTO bairros (nome) VALUES ('Bela Vista') ON CONFLICT DO NOTHING;

-- Add two nodes and an edge between them (for quick Dijkstra smoke test)
INSERT INTO nodes (bairro_id, name, latitude, longitude)
SELECT b.id, 'Node A', -23.55052, -46.633308
FROM bairros b WHERE b.nome='Centro'
ON CONFLICT DO NOTHING;

INSERT INTO nodes (bairro_id, name, latitude, longitude)
SELECT b.id, 'Node B', -23.551, -46.634
FROM bairros b WHERE b.nome='Centro'
ON CONFLICT DO NOTHING;

-- Insert an edge with a small distance
WITH a AS (
  SELECT id FROM nodes WHERE name='Node A' LIMIT 1
), b AS (
  SELECT id FROM nodes WHERE name='Node B' LIMIT 1
)
INSERT INTO edges (source_node, target_node, distance_meters, travel_time_seconds)
SELECT a.id, b.id, 120.0, 90 FROM a, b
ON CONFLICT DO NOTHING;
