import { Router } from 'express'
import {
	createTeam,
	listTeams,
	updateTeam,
	addEmployeeToTeam,
	listTeamMembers,
	removeEmployeeFromTeam,
} from '../controllers/teams.controller.js'
import { authorize } from '../middlewares/auth.middleware.js'

const teamsRouter = Router()

/**
 * @openapi
 * /teams:
 *   get:
 *     tags: [Teams]
 *     summary: Lista equipes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipes
 */
teamsRouter.get('/', listTeams)

/**
 * @openapi
 * /teams:
 *   post:
 *     tags: [Teams]
 *     summary: Cria uma nova equipe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
 *     responses:
 *       201:
 *         description: Equipe criada com sucesso
 *       400:
 *         description: Dados invalidos
 */
teamsRouter.post('/', authorize('manager'), createTeam)

/**
 * @openapi
 * /teams/{id}:
 *   put:
 *     tags: [Teams]
 *     summary: Atualiza uma equipe existente
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
 *             $ref: '#/components/schemas/TeamInput'
 *     responses:
 *       200:
 *         description: Equipe atualizada com sucesso
 *       400:
 *         description: Dados invalidos
 *       404:
 *         description: Equipe nao encontrada
 */
teamsRouter.put('/:id', authorize('manager'), updateTeam)

/**
 * @openapi
 * /teams/{teamId}/members:
 *   get:
 *     tags: [Teams]
 *     summary: Lista membros de uma equipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de membros da equipe
 *       404:
 *         description: Equipe nao encontrada
 */
teamsRouter.get('/:teamId/members', listTeamMembers)

/**
 * @openapi
 * /teams/{teamId}/members:
 *   post:
 *     tags: [Teams]
 *     summary: Adiciona um funcionario na equipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamMemberInput'
 *     responses:
 *       201:
 *         description: Funcionario adicionado na equipe
 *       400:
 *         description: Dados invalidos
 *       404:
 *         description: Equipe ou funcionario nao encontrados
 */
teamsRouter.post('/:teamId/members', authorize('manager'), addEmployeeToTeam)

/**
 * @openapi
 * /teams/{teamId}/members:
 *   delete:
 *     tags: [Teams]
 *     summary: Remove um funcionario da equipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamMemberInput'
 *     responses:
 *       204:
 *         description: Funcionario removido da equipe
 *       400:
 *         description: Dados invalidos
 *       404:
 *         description: Equipe, funcionario ou vinculo nao encontrados
 */
teamsRouter.delete('/:teamId/members', authorize('manager'), removeEmployeeFromTeam)

export { teamsRouter }
