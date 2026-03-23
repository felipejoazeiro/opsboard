import { Router } from 'express'
import {
	createTeam,
	listTeams,
	addEmployeeToTeam,
	listTeamMembers,
	removeEmployeeFromTeam,
} from '../controllers/teams.controller.js'
import { authorize } from '../middlewares/auth.middleware.js'

const teamsRouter = Router()

teamsRouter.get('/', listTeams)
teamsRouter.post('/', authorize('Manager'), createTeam)
teamsRouter.get('/:teamId/members', listTeamMembers)
teamsRouter.post('/:teamId/members', authorize('Manager'), addEmployeeToTeam)
teamsRouter.delete('/:teamId/members', authorize('Manager'), removeEmployeeFromTeam)

export { teamsRouter }
  