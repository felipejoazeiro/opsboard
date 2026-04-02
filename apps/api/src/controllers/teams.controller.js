import { z } from "zod";
import { getDbPool } from "../db/client.js";

const TeamListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

const CreateTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export async function listTeams(req, res, next) {
  try {
    const parsed = TeamListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid pagination parameters.",
        errors: parsed.error.flatten(),
      });
    }

    const { page, pageSize } = parsed.data;
    const offset = (page - 1) * pageSize;
    const pool = getDbPool();

    const [{ rows: countRows }, { rows }] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total FROM teams"),
      pool.query(
        `SELECT teams.id,
                teams.name,
                teams.description,
                COUNT(team_members.employee_id)::int AS total_employees
         FROM teams
         LEFT JOIN team_members ON teams.id = team_members.team_id
         GROUP BY teams.id
         ORDER BY teams.created_at DESC
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

export async function createTeam(req, res, next) {
  try {
    const parsed = CreateTeamSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid data to create team.",
        errors: parsed.error.flatten(),
      });
    }

    const { name, description } = parsed.data;
    const pool = getDbPool();

    const { rows } = await pool.query(
      "INSERT INTO teams (name, description, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [name, description],
    );

    return res.status(201).json({ data: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function updateTeam(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = CreateTeamSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid data to update team.",
        errors: parsed.error.flatten(),
      });
    }

    const { name, description } = parsed.data;
    const pool = getDbPool();
    const { rows } = await pool.query(
      "UPDATE teams SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name, description, id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Team not found." });
    }

    return res.json({ data: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function addEmployeeToTeam(req, res, next) {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const pool = getDbPool();
    const { rows } = await pool.query(
      "INSERT INTO team_members (team_id, employee_id, joined_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING RETURNING *",
      [teamId, employeeId],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Team or Employee not found, or already a member." });
    }

    return res.status(201).json({ data: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function listTeamMembers(req, res, next) {
  try {
    const { teamId } = req.params;
    const pool = getDbPool();

    const { rows } = await pool.query(
      `SELECT employees.id,
              employees.name,
              employees.email,
              roles.name AS role,
              roles.level AS "roleLevel",
              team_members.joined_at AS joined_at
       FROM team_members
       INNER JOIN employees ON employees.id = team_members.employee_id
       INNER JOIN roles ON roles.id = employees.role_id
       WHERE team_members.team_id = $1
       ORDER BY employees.name ASC`,
      [teamId],
    );

    return res.json({ data: rows });
  } catch (error) {
    return next(error);
  }
}

export async function removeEmployeeFromTeam(req, res, next) {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const pool = getDbPool();
    const { rowCount } = await pool.query(
      "DELETE FROM team_members WHERE team_id = $1 AND employee_id = $2",
      [teamId, employeeId],
    );
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Team or Employee not found, or not a member." });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function deleteTeam(req, res, next) {
  try {
    const { id } = req.params;
    const pool = getDbPool();
    const { rowCount } = await pool.query("DELETE FROM teams WHERE id = $1", [
      id,
    ]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Team not found." });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
