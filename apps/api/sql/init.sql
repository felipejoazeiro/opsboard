CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('manager', 'staff', 'intern')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, level)
);

INSERT INTO roles (name, level)
VALUES
  ('Manager', 'manager'),
  ('Staff', 'staff'),
  ('Intern', 'intern')
ON CONFLICT (name, level) DO NOTHING;

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role_id UUID REFERENCES roles(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  login_id UUID REFERENCES logins(id) ON DELETE CASCADE
);

ALTER TABLE employees ADD COLUMN IF NOT EXISTS role_id UUID;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'employees' AND column_name = 'role'
  ) THEN
    INSERT INTO roles (name, level)
    SELECT DISTINCT
      e.role,
      CASE
        WHEN lower(e.role) = 'manager' THEN 'manager'
        WHEN lower(e.role) = 'intern' THEN 'intern'
        ELSE 'staff'
      END
    FROM employees e
    WHERE e.role IS NOT NULL
    ON CONFLICT (name, level) DO NOTHING;

    UPDATE employees e
    SET role_id = r.id
    FROM roles r
    WHERE e.role_id IS NULL
      AND e.role IS NOT NULL
      AND r.name = e.role
      AND r.level = CASE
        WHEN lower(e.role) = 'manager' THEN 'manager'
        WHEN lower(e.role) = 'intern' THEN 'intern'
        ELSE 'staff'
      END;

    ALTER TABLE employees DROP COLUMN IF EXISTS role;
  END IF;
END $$;

INSERT INTO roles (name, level)
VALUES ('Staff', 'staff')
ON CONFLICT (name, level) DO NOTHING;

UPDATE employees
SET role_id = (SELECT id FROM roles WHERE name = 'Staff' AND level = 'staff' LIMIT 1)
WHERE role_id IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'employees_role_id_fk'
  ) THEN
    ALTER TABLE employees
    ADD CONSTRAINT employees_role_id_fk
    FOREIGN KEY (role_id) REFERENCES roles(id);
  END IF;
END $$;

ALTER TABLE employees ALTER COLUMN role_id SET NOT NULL;

-- Seed inicial para teste local.
-- Login: admin
-- Senha: admin123
INSERT INTO logins (login, password_hash)
VALUES ('admin', '$2a$12$yBNzrcGXcU6ZBrmLlPU97..EcOTZ2uU9Rl4P/hl8snbpu2afuWJBW')
ON CONFLICT (login) DO NOTHING;

INSERT INTO employees (name, email, role_id, is_active, login_id)
SELECT
  'Administrador',
  'admin@opsboard.local',
  r.id,
  TRUE,
  l.id
FROM logins l
JOIN roles r ON r.level = 'manager'
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

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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


