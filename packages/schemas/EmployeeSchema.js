import { z } from 'zod'

export const EmployeeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.string().trim().min(1, 'Role name is required'),
    roleLevel: z.enum(['manager', 'staff', 'intern'], 'Role level must be manager, staff, or intern'),
    isActive: z.boolean().default(true),
    createdAt: z.date().default(() => new Date()),
    teamId: z.string().optional(),
})