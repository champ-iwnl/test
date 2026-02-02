import { z } from 'zod'

// UUID validation (reusable)
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' })

// Pagination params validation
export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Inferred types
export type UUID = z.infer<typeof uuidSchema>
export type PaginationParams = z.infer<typeof paginationSchema>
