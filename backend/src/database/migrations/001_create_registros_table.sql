-- Migration: Criação da tabela de registros
-- PostgreSQL

-- Drop table if exists (para desenvolvimento)
DROP TABLE IF EXISTS registros CASCADE;

CREATE TABLE registros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    data_nascimento DATE NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Índices para melhorar performance das buscas
CREATE INDEX idx_registros_cpf ON registros(cpf);
CREATE INDEX idx_registros_email ON registros(email);
CREATE INDEX idx_registros_cidade ON registros(cidade);
CREATE INDEX idx_registros_estado ON registros(estado);
CREATE INDEX idx_registros_status ON registros(status);
CREATE INDEX idx_registros_localizacao ON registros(cidade, estado);
CREATE INDEX idx_registros_deleted_at ON registros(deleted_at) WHERE deleted_at IS NULL;

-- Índice GIN para busca full-text em português (requer extensão)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX idx_registros_nome_trgm ON registros USING gin(nome gin_trgm_ops);

-- Índice simples para nome (alternativa sem extensão)
CREATE INDEX idx_registros_nome ON registros(nome);

-- Comentário da tabela
COMMENT ON TABLE registros IS 'Tabela principal de registros para demonstração de buscas';
