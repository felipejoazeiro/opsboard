import { Router } from 'express'
import { createTeam, listTeams } from '../controllers/teams.controller.js'
import { authorize } from '../middlewares/auth.middleware.js'

const teamsRouter = Router()

teamsRouter.get('/', listTeams)
teamsRouter.post('/', authorize('Manager'), createTeam)

export { teamsRouter }
