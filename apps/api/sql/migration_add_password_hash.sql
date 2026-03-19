ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_hash TEXT;

UPDATE employees
SET password_hash = 'RESET_REQUIRED'
WHERE password_hash IS NULL;

ALTER TABLE employees ALTER COLUMN password_hash SET NOT NULL;
