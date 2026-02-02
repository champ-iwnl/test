import { z } from 'zod'
import { CHECKPOINTS } from '@/features/reward/constants'

// Valid checkpoint values
const checkpointValues = CHECKPOINTS as unknown as readonly [number, ...number[]]

// Claim request validation
export const claimRequestSchema = z.object({
  checkpoint_points: z.enum(
    checkpointValues.map(String) as [string, ...string[]]
  ).transform(Number),
})

// Alternative: use refine for number validation
export const claimRequestNumberSchema = z.object({
  checkpoint_points: z
    .number()
    .int()
    .refine((val) => (CHECKPOINTS as readonly number[]).includes(val), {
      message: `Checkpoint must be one of: ${CHECKPOINTS.join(', ')}`,
    }),
})

// Inferred types
export type ClaimRequestData = z.infer<typeof claimRequestNumberSchema>
