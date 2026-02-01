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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Container className="relative h-[calc(100vh-2rem)] min-h-[600px] rounded-3xl p-6 pt-10 flex flex-col">
        
        {/* Content Section (Positioned) */}
        <div className="w-full">
          {/* Header Title */}
          <div 
            className="absolute" 
            style={{ top: '276px', left: '15px' }}
          >
            <h1 className="text-[32px] font-medium text-black" style={{ lineHeight: '100%', letterSpacing: '0px' }}>
              Nextzy Test (Full Stack)
            </h1>
          </div>

          {/* Subtitle (เกมสะสมคะแนน) - responsive */}
          <div
            className="absolute flex items-center justify-center text-center md:static md:mx-auto"
            style={{
              top: '320px',
              left: '15px',
              width: '90px',
              height: '17px',
              fontFamily: 'Kanit',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '120%',
              letterSpacing: '0%',
              color: '#979797',
              textAlign: 'center',
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
              width: '151px',
              height: '17px',
              opacity: 1,
              fontFamily: 'Kanit',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '120%',
              letterSpacing: '0%',
              color: '#979797', // text-gray-700
            }}
          >
            ชื่อสำหรับเล่น (Nickname)
          </div>

          {/* ชื่อสำหรับเล่น input */}
          <div
            className="absolute"
            style={{
              top: '382px',
              left: '16px',
              width: '345px',
              height: '48px',
            }}
          >
            <input
              form="nickname-form"
              name="nickname"
              placeholder="Test 234"
              {...register('nickname')}
              disabled={enterMutation.isPending}
              autoComplete="off"
              className="w-full h-full rounded-[8px] border border-[#D9D9D9] bg-white px-4 text-[14px] font-regular font-kanit leading-[120%] text-left placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-gold focus-visible:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                paddingRight: '16px',
                paddingLeft: '16px',
                opacity: 1,
              }}
            />
          </div>

          {/* Error message */}
          {(errors.nickname?.message || serverError) && (
            <div
              className="absolute text-sm text-red-500 ml-1"
              style={{ top: '434px', left: '16px' }}
            >
              {errors.nickname?.message || serverError}
            </div>
          )}

          <div
            className="w-full"
            style={{ paddingTop: '382px', paddingLeft: '16px' }}
          >
            <div
              className="w-full"
              style={{ maxWidth: '345px', minWidth: '345px' }}
            >
              {/* Form Section */}
              <NicknameForm
                hideInput={true}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                serverError={serverError}
                enterMutation={enterMutation}
                onSubmit={onSubmit}
                className="w-full mt-2"
                inputContainerClassName="mt-2"
                buttonContainerClassName="mb-4"
                hideButton
              />
            </div>
          </div>
        </div>

        {/* Bottom sticky bar matching Figma */}
        <CtaFooter>
          <CtaButton form="nickname-form" type="submit" emphasis>
            เข้าเล่น
          </CtaButton>
        </CtaFooter>

      </Container>
    </div>
  )
}