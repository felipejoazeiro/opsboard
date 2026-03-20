import { z } from 'zod'

export const TaskSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status : z.enum(['To Do', 'In Progress', 'Done'], 'Status must be To Do, In Progress, or Done'),
    priority: z.enum(['Low', 'Medium', 'High'], 'Priority must be Low, Medium, or High'),
    dueDate: z.date().optional(),
    createdAt: z.date().default(() => new Date()),
    createdBy: z.string(),
    updatedAt: z.date().optional(),
})