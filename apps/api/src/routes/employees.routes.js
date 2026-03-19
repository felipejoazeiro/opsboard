import { Router } from 'express'
import { createEmployee, listEmployees } from '../controllers/employees.controller.js'

const employeesRouter = Router()

employeesRouter.get('/', listEmployees)
employeesRouter.post('/', createEmployee)

export { employeesRouter }
