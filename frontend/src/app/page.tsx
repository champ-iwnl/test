'use client'

import { Container } from '@/components/layout/Container'
import { NicknameForm } from '@/features/auth/components/NicknameForm'
import { CtaButton } from '@/components/ui/CtaButton'
import { CtaFooter } from '@/components/ui/CtaFooter'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { usePlayerStore } from '@/store/playerStore'

// Validation Schema
const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร' })
    .max(20, { message: 'ชื่อต้องไม่เกิน 20 ตัวอักษร' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และขีดล่าง (_)' }),
})

type NicknameFormData = z.infer<typeof nicknameSchema>

export default function LandingPage() {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container>
        {/* Header Title */}
        <div className="absolute" style={{ top: '276px', left: '15px' }}>
          <h1
            className="text-black"
            style={{
              fontSize: '32px',
              fontWeight: 500,
              lineHeight: '100%',
              letterSpacing: '0px',
            }}
          >
            Nextzy Test (Full Stack)
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className="absolute"
          style={{
            top: '320px',
            left: '15px',
            fontFamily: 'Kanit',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '120%',
            color: '#979797',
            opacity: 1,
          }}
        >
          เกมสะสมคะแนน
        </div>

        {/* ชื่อสำหรับเล่น label */}
        <div
          className="absolute"
          style={{
            top: '358px',
            left: '16px',
            fontFamily: 'Kanit',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '120%',
            color: '#979797',
            opacity: 1,
          }}
        >
          ชื่อสำหรับเล่น (Nickname)
        </div>

        {/* Input field */}
        <div className="absolute" style={{ top: '382px', left: '16px', width: '345px' }}>
          <input
            form="nickname-form"
            name="nickname"
            placeholder="Test 234"
            {...register('nickname')}
            disabled={enterMutation.isPending}
            autoComplete="off"
            className="w-full h-[48px] border border-[#D9D9D9] bg-white px-4 text-[14px] font-kanit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderRadius: '8px',
              opacity: 1,
            }}
          />
        </div>

        {/* Error message */}
        {(errors.nickname?.message || serverError) && (
          <div
            className="absolute text-sm text-red-500"
            style={{ top: '434px', left: '16px' }}
          >
            {errors.nickname?.message || serverError}
          </div>
        )}

        {/* Hidden form submit */}
        <form id="nickname-form" onSubmit={handleSubmit(onSubmit)} className="hidden" />

        {/* Footer */}
        <CtaFooter>
          <CtaButton form="nickname-form" type="submit">
            เข้าเล่น
          </CtaButton>
        </CtaFooter>
      </Container>
    </div>
  )
}