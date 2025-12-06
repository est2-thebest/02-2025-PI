ALTER TABLE profissional ADD COLUMN turno VARCHAR(20);
UPDATE profissional SET turno = 'MATUTINO' WHERE turno IS NULL;
