import { z } from 'zod'

// Nickname validation schema
export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร' })
    .max(20, { message: 'ชื่อต้องไม่เกิน 20 ตัวอักษร' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และขีดล่าง (_)',
    }),
})

// Inferred types from schemas
export type NicknameFormData = z.infer<typeof nicknameSchema>
