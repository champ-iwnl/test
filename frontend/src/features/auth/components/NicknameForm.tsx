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
}

export function NicknameForm({ 
  className, 
  inputContainerClassName, 
  buttonContainerClassName 
  , hideButton = false
}: NicknameFormProps) {
  const router = useRouter()
  const setPlayer = usePlayerStore((state) => state.setPlayer)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
  })

  const enterMutation = useMutation({
    mutationFn: (data: NicknameFormData) => authService.enter(data.nickname),
    onSuccess: (data) => {
      // Backend returns flat EnterResponse, map to Player shape used in store
      setPlayer({
        id: data.id,
        nickname: data.nickname,
        total_points: data.total_points,
        created_at: data.created_at,
      })
      router.push('/home')
    },
    onError: (error: any) => {
      // Handle backend error message
      const message = error.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      setServerError(message)
    },
  })

  const onSubmit = (data: NicknameFormData) => {
    setServerError(null)
    enterMutation.mutate(data)
  }

  return (
    <form id="nickname-form" onSubmit={handleSubmit(onSubmit)} className={cn("w-full flex flex-col", className)}>
      <div className={cn("w-full", inputContainerClassName)}>
        <Input
          label="ชื่อสำหรับเล่น (Nickname)"
          placeholder="Test 234"
          {...register('nickname')}
          error={errors.nickname?.message || serverError || undefined}
          disabled={enterMutation.isPending}
          autoComplete="off"
        />
      </div>
      
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
