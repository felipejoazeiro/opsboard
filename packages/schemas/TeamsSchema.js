import {z } from 'zod'

export const TeamSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    createdAt: z.date().default(() => new Date()),
})