CREATE TABLE ocorrencia_historico (
    id SERIAL PRIMARY KEY,
    ocorrencia_id INTEGER NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    observacao TEXT,
    CONSTRAINT fk_ocorrencia_historico_ocorrencia FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencia(id)
);

CREATE INDEX idx_ocorrencia_historico_ocorrencia ON ocorrencia_historico(ocorrencia_id);
