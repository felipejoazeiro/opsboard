import { Router } from 'express'
import { createEmployee, listEmployees, updateEmployee } from '../controllers/employees.controller.js'

const employeesRouter = Router()

employeesRouter.get('/', listEmployees)
employeesRouter.post('/', createEmployee)
employeesRouter.put('/:id', updateEmployee)

export { employeesRouter }
