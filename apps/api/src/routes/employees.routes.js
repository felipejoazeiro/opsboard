import { Router } from 'express'
import { createEmployee, listEmployees, updateEmployee, inactiveEmployee } from '../controllers/employees.controller.js'

const employeesRouter = Router()

employeesRouter.get('/', listEmployees)
employeesRouter.post('/', createEmployee)
employeesRouter.put('/:id', updateEmployee)
employeesRouter.delete('/:id', inactiveEmployee)

export { employeesRouter }
