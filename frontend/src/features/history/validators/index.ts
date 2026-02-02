import { z } from 'zod'
import { paginationSchema, uuidSchema } from '@/lib/validators'

// Global history params
export const globalHistoryParamsSchema = paginationSchema

// Personal history params (requires player_id)
export const personalHistoryParamsSchema = paginationSchema.extend({
  player_id: uuidSchema,
})

// Inferred types
export type GlobalHistoryParams = z.infer<typeof globalHistoryParamsSchema>
export type PersonalHistoryParams = z.infer<typeof personalHistoryParamsSchema>
