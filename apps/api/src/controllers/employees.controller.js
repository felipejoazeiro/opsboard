import { EmployeeSchema } from "../../../../packages/schemas/EmployeeSchema.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getDbPool } from "../db/client.js";
import { env } from "../config/env.js";

const CreateEmployeeSchema = EmployeeSchema.omit({ id: true, createdAt: true });
const EmployeeListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});
const EmployeeIdSchema = z.string().uuid();

function normalizeLoginBase(name) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return normalized || "user";
}

async function createUniqueLogin(client, baseLogin, passwordHash) {
  for (let i = 0; i < 100; i += 1) {
    const suffix = i === 0 ? "" : String(i + 1);
    const candidate = `${baseLogin}${suffix}`;

    const { rows } = await client.query(
      `INSERT INTO logins (login, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (login) DO NOTHING
       RETURNING id, login`,
      [candidate, passwordHash],
    );

    if (rows.length > 0) {
      return rows[0];
    }
  }

  throw new Error("Nao foi possivel gerar um login unico para o funcionario.");
}

export async function getEmployeeById(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = EmployeeIdSchema.safeParse(id);

    if (!parsedId.success) {
      return res.status(400).json({
        message: "ID do funcionario invalido.",
        errors: parsedId.error.flatten(),
      });
    }

    const response = await getDbPool().query(
      `SELECT
         e.id,
         e.name,
         e.email,
         e.role,
         e.is_active AS "isActive",
         e.created_at AS "createdAt",
         COALESCE(string_agg(DISTINCT t.name, ', '), '') AS "teamName"
       FROM employees e
       LEFT JOIN team_members tm ON e.id = tm.employee_id
       LEFT JOIN teams t ON tm.team_id = t.id
       WHERE e.id = $1
       GROUP BY e.id, e.name, e.email, e.role, e.is_active, e.created_at`,
      [parsedId.data],
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        message: "Funcionario nao encontrado.",
      });
    }

    return res.json(response.rows[0]);
  } catch (error) {
    return next(error);
  }
}

export async function listEmployees(req, res, next) {
  try {
    const parsedQuery = EmployeeListQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return res.status(400).json({
        message: "Parametros invalidos para paginacao.",
        errors: parsedQuery.error.flatten(),
      });
    }

    const { page, pageSize } = parsedQuery.data;
    const offset = (page - 1) * pageSize;
    const pool = getDbPool();

    const [{ rows: countRows }, { rows }] = await Promise.all([
      pool.query(
        "SELECT COUNT(*)::int AS total FROM employees WHERE is_active = true",
      ),
      pool.query(
        `SELECT id, name, email, role, is_active AS "isActive", created_at AS "createdAt"
         FROM employees
         WHERE is_active = true
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [pageSize, offset],
      ),
    ]);

    const total = countRows[0]?.total ?? 0;
    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    return res.json({
      data: rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeInactive(req, res, next) {
  return listEmployeesByStatus(req, res, next, false);
}

export async function createEmployee(req, res, next) {
  if (!env.primaryPassword) {
    return res.status(500).json({
      message:
        "PRIMARY_PASSWORD nao configurada. Defina no .env antes de criar funcionarios.",
    });
  }

  try {
    const parsed = CreateEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados invalidos para criar funcionario.",
        errors: parsed.error.flatten(),
      });
    }

    const { name, email, role } = parsed.data;
    const passwordHash = await bcrypt.hash(env.primaryPassword, 12);
    const baseLogin = normalizeLoginBase(name);

    const client = await getDbPool().connect();
    try {
      await client.query("BEGIN");

      const login = await createUniqueLogin(client, baseLogin, passwordHash);

      const { rows } = await client.query(
        `INSERT INTO employees (name, email, role, is_active, login_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, role, is_active AS "isActive", created_at AS "createdAt", login_id AS "loginId"`,
        [name, email, role, true, login.id],
      );

      await client.query("COMMIT");

      return res.status(201).json({
        ...rows[0],
        login: login.login,
        primaryPasswordConfigured: true,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return next(error);
  }
}

export async function updateEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = EmployeeIdSchema.safeParse(id);

    if (!parsedId.success) {
      return res.status(400).json({
        message: "ID do funcionario invalido.",
        errors: parsedId.error.flatten(),
      });
    }

    const parsedBody = EmployeeSchema.partial().safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Dados invalidos para atualizar funcionario.",
        errors: parsedBody.error.flatten(),
      });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(parsedBody.data)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx += 1;
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "Nenhum campo fornecido para atualizar.",
      });
    }

    values.push(parsedId.data);

    const { rows } = await getDbPool().query(
      `UPDATE employees SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, name, email, role, is_active AS "isActive", created_at AS "createdAt", team_id AS "teamId"`,
      values,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Funcionario nao encontrado.",
      });
    }

    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

export async function inactiveEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = EmployeeIdSchema.safeParse(id);

    if (!parsedId.success) {
      return res.status(400).json({
        message: "ID do funcionario invalido.",
        errors: parsedId.error.flatten(),
      });
    }

    const { rows } = await getDbPool().query(
      `UPDATE employees
       SET is_active = false
       WHERE id = $1
       RETURNING id, name, email, role, is_active AS "isActive", created_at AS "createdAt", team_id AS "teamId"`,
      [parsedId.data],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Funcionario nao encontrado.",
      });
    }

    return res.json(rows[0], mes);
  } catch (error) {
    return next(error);
  }
}
