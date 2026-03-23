import { Router } from 'express'
import { createEmployee, listEmployees, updateEmployee, inactiveEmployee } from '../controllers/employees.controller.js'
import { authorize } from '../middlewares/auth.middleware.js'

const employeesRouter = Router()

/**
 * @openapi
 * /employees:
 *   get:
 *     tags: [Employees]
 *     summary: Lista funcionarios ativos com paginacao
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de funcionarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeListResponse'
 */
employeesRouter.get('/', listEmployees)

/**
 * @openapi
 * /employees:
 *   post:
 *     tags: [Employees]
 *     summary: Cria um novo funcionario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       201:
 *         description: Funcionario criado com sucesso
 *       400:
 *         description: Dados invalidos
 */
employeesRouter.post('/', authorize(['Manager', 'Staff']), createEmployee)

/**
 * @openapi
 * /employees/{id}:
 *   put:
 *     tags: [Employees]
 *     summary: Atualiza dados de um funcionario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       200:
 *         description: Funcionario atualizado com sucesso
 *       404:
 *         description: Funcionario nao encontrado
 */
employeesRouter.put('/:id', authorize(['Manager', 'Staff']), updateEmployee)

/**
 * @openapi
 * /employees/{id}:
 *   delete:
 *     tags: [Employees]
 *     summary: Inativa um funcionario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Funcionario inativado com sucesso
 *       404:
 *         description: Funcionario nao encontrado
 */
employeesRouter.delete('/:id', authorize(['Manager', 'Staff']), inactiveEmployee)

export { employeesRouter }
