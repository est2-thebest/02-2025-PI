-- ============================================================
-- V3__add_enabled_to_usuario.sql
-- Add enabled column to usuario table for account activation support
-- ============================================================

ALTER TABLE usuario ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT TRUE;
