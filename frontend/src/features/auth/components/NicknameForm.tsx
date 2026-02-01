'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { usePlayerStore } from '@/store/playerStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import { cn } from '@/utils/cn'

// Validation Schema
const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร' })
    .max(20, { message: 'ชื่อต้องไม่เกิน 20 ตัวอักษร' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และขีดล่าง (_)' }),
})

type NicknameFormData = z.infer<typeof nicknameSchema>

interface NicknameFormProps {
  className?: string
  inputContainerClassName?: string
  buttonContainerClassName?: string
  hideButton?: boolean
  hideInput?: boolean
  register: any
  handleSubmit: any
  errors: any
  serverError: string | null
  enterMutation: any
  onSubmit: (data: NicknameFormData) => void
}

export function NicknameForm({ 
  className, 
  inputContainerClassName, 
  buttonContainerClassName, 
  hideButton = false,
  hideInput = false,
  register,
  handleSubmit,
  errors,
  serverError,
  enterMutation,
  onSubmit
}: NicknameFormProps) {
  const router = useRouter()
  const setPlayer = usePlayerStore((state) => state.setPlayer)

  return (
    <form id="nickname-form" onSubmit={handleSubmit(onSubmit)} className={cn("w-full flex flex-col", className)}>
      {!hideInput && (
        <div className={cn("w-full", inputContainerClassName)}>
          <Input
            placeholder="Test 234"
            {...register('nickname')}
            error={errors.nickname?.message || serverError || undefined}
            disabled={enterMutation.isPending}
            autoComplete="off"
          />
        </div>
      )}
      
      {!hideButton && (
        <div className={cn("mt-auto w-full", buttonContainerClassName)}>
          <Button 
            type="submit" 
            size="lg" 
            fullWidth 
            isLoading={enterMutation.isPending}
          >
            เข้าเล่น
          </Button>
        </div>
      )}
    </form>
  )
}
