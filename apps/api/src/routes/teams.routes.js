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

teamsRouter.get('/', listTeams)
teamsRouter.post('/', authorize('Manager'), createTeam)
teamsRouter.put('/:id', authorize('Manager'), updateTeam)
teamsRouter.get('/:teamId/members', listTeamMembers)
teamsRouter.post('/:teamId/members', authorize('Manager'), addEmployeeToTeam)
teamsRouter.delete('/:teamId/members', authorize('Manager'), removeEmployeeFromTeam)

export { teamsRouter }
  