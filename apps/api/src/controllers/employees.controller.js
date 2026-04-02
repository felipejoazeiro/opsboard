import { EmployeeSchema } from "../../../../packages/schemas/EmployeeSchema.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getDbPool } from "../db/client.js";
import { env } from "../config/env.js";

const CreateEmployeeSchema = EmployeeSchema.omit({ id: true, createdAt: true });
const UpdateEmployeeSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().email().optional(),
    isActive: z.boolean().optional(),
    role: z.string().trim().min(1).optional(),
    roleLevel: z.enum(["manager", "staff", "intern"]).optional(),
  })
  .refine((payload) => payload.role === undefined || payload.roleLevel !== undefined, {
    message: "roleLevel e obrigatorio quando role for informado.",
    path: ["roleLevel"],
  })
  .refine((payload) => payload.roleLevel === undefined || payload.role !== undefined, {
    message: "role e obrigatorio quando roleLevel for informado.",
    path: ["role"],
  });
const EmployeeListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});
const EmployeeIdSchema = z.string().uuid();

async function getOrCreateRole(client, roleName, roleLevel) {
  const normalizedLevel = roleLevel.toLowerCase();

  const { rows } = await client.query(
    `INSERT INTO roles (name, level)
     VALUES ($1, $2)
     ON CONFLICT (name, level) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, level`,
    [roleName.trim(), normalizedLevel],
  );

  return rows[0];
}

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
         r.name AS role,
         r.level AS "roleLevel",
         e.is_active AS "isActive",
         e.created_at AS "createdAt",
         COALESCE(string_agg(DISTINCT t.name, ', '), '') AS "teamName"
       FROM employees e
       INNER JOIN roles r ON e.role_id = r.id
       LEFT JOIN team_members tm ON e.id = tm.employee_id
       LEFT JOIN teams t ON tm.team_id = t.id
       WHERE e.id = $1
       GROUP BY e.id, e.name, e.email, r.name, r.level, e.is_active, e.created_at`,
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
        `SELECT e.id, e.name, e.email, r.name AS role, r.level AS "roleLevel", e.is_active AS "isActive", e.created_at AS "createdAt"
         FROM employees e
         INNER JOIN roles r ON e.role_id = r.id
         WHERE e.is_active = true
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

    const { name, email, role, roleLevel, isActive } = parsed.data;
    const passwordHash = await bcrypt.hash(env.primaryPassword, 12);
    const baseLogin = normalizeLoginBase(name);

    const client = await getDbPool().connect();
    try {
      await client.query("BEGIN");

      const login = await createUniqueLogin(client, baseLogin, passwordHash);
      const createdRole = await getOrCreateRole(client, role, roleLevel);

      const { rows } = await client.query(
        `INSERT INTO employees (name, email, role_id, is_active, login_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, is_active AS "isActive", created_at AS "createdAt", login_id AS "loginId", role_id AS "roleId"`,
        [name, email, createdRole.id, isActive ?? true, login.id],
      );

      await client.query("COMMIT");

      return res.status(201).json({
        ...rows[0],
        role: createdRole.name,
        roleLevel: createdRole.level,
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

    const parsedBody = UpdateEmployeeSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Dados invalidos para atualizar funcionario.",
        errors: parsedBody.error.flatten(),
      });
    }

    if (Object.keys(parsedBody.data).length === 0) {
      return res.status(400).json({
        message: "Nenhum campo fornecido para atualizar.",
      });
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const {
        rows: existingRows,
      } = await client.query(
        `SELECT e.id, r.name AS role, r.level AS "roleLevel"
         FROM employees e
         INNER JOIN roles r ON e.role_id = r.id
         WHERE e.id = $1`,
        [parsedId.data],
      );

      if (existingRows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          message: "Funcionario nao encontrado.",
        });
      }

      const updateFields = [];
      const values = [];
      let idx = 1;

      if (parsedBody.data.name !== undefined) {
        updateFields.push(`name = $${idx}`);
        values.push(parsedBody.data.name);
        idx += 1;
      }

      if (parsedBody.data.email !== undefined) {
        updateFields.push(`email = $${idx}`);
        values.push(parsedBody.data.email);
        idx += 1;
      }

      if (parsedBody.data.isActive !== undefined) {
        updateFields.push(`is_active = $${idx}`);
        values.push(parsedBody.data.isActive);
        idx += 1;
      }

      if (parsedBody.data.role !== undefined && parsedBody.data.roleLevel !== undefined) {
        const updatedRole = await getOrCreateRole(
          client,
          parsedBody.data.role,
          parsedBody.data.roleLevel,
        );
        updateFields.push(`role_id = $${idx}`);
        values.push(updatedRole.id);
        idx += 1;
      }

      values.push(parsedId.data);

      const { rows } = await client.query(
        `UPDATE employees
         SET ${updateFields.join(", ")}
         WHERE id = $${idx}
         RETURNING id, name, email, is_active AS "isActive", created_at AS "createdAt", role_id AS "roleId"`,
        values,
      );

      const { rows: roleRows } = await client.query(
        "SELECT name, level FROM roles WHERE id = $1",
        [rows[0].roleId],
      );

      await client.query("COMMIT");

      return res.json({
        ...rows[0],
        role: roleRows[0]?.name,
        roleLevel: roleRows[0]?.level,
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
       RETURNING id, name, email, is_active AS "isActive", created_at AS "createdAt", role_id AS "roleId"`,
      [parsedId.data],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Funcionario nao encontrado.",
      });
    }

    const roleResult = await getDbPool().query(
      "SELECT name, level FROM roles WHERE id = $1",
      [rows[0].roleId],
    );

    return res.json({
      ...rows[0],
      role: roleResult.rows[0]?.name,
      roleLevel: roleResult.rows[0]?.level,
    });
  } catch (error) {
    return next(error);
  }
}
