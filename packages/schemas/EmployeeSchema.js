import { z } from 'zod'

export const EmployeeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['Manager', 'Staff', 'Intern'], 'Role must be Manager, Staff, or Intern'),
    isActive: z.boolean().default(true),
    createdAt: z.date().default(() => new Date()),
    teamId: z.string(),
})