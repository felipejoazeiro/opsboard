CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Manager', 'Staff', 'Intern')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  team_id TEXT NOT NULL,
  login_id UUID REFERENCES logins(id) ON DELETE CASCADE
);

-- Seed inicial para teste local.
-- Login: admin
-- Senha: admin123
INSERT INTO logins (login, password_hash)
VALUES ('admin', '$2a$12$yBNzrcGXcU6ZBrmLlPU97..EcOTZ2uU9Rl4P/hl8snbpu2afuWJBW')
ON CONFLICT (login) DO NOTHING;

INSERT INTO employees (name, email, role, is_active, team_id, login_id)
SELECT
  'Administrador',
  'admin@opsboard.local',
  'Manager',
  TRUE,
  'core',
  l.id
FROM logins l
WHERE l.login = 'admin'
  AND NOT EXISTS (
    SELECT 1
    FROM employees e
    WHERE e.email = 'admin@opsboard.local'
  );

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')),
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


