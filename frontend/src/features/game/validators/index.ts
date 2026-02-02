import { z } from 'zod'
import { uuidSchema } from '@/lib/validators'

// Spin request validation
export const spinRequestSchema = z.object({
  player_id: uuidSchema,
})

// Spin result validation (from server)
export const spinResultSchema = z.object({
  spin_id: uuidSchema,
  points_gained: z.number().int().min(0),
  total_points_after: z.number().int().min(0),
})

// Inferred types
export type SpinRequestData = z.infer<typeof spinRequestSchema>
export type SpinResultData = z.infer<typeof spinResultSchema>
