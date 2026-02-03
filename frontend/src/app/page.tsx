'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import { CtaFooter } from '@/components/ui/CtaFooter'
import { useNicknameForm } from '@/features/auth/hooks'

export default function LandingPage() {
  const { register, errors, serverError, isPending, handleSubmit } =
    useNicknameForm()

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => res.json())
      .then((data) => console.log('Frontend connected to backend:', data))
      .catch((err) => console.log('Backend connection failed:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container>
        {/* Header Title */}
        <div className="absolute" style={{ top: '34%', left: '4%' }}>
          <h1
            className="text-black"
            style={{
              fontSize: '32px',
              fontWeight: 500,
              lineHeight: '100%',
              letterSpacing: '0px'}}
          >
            Nextzy Test (Full Stack)
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className="absolute"
          style={{
            top: '39.4%',
            left: '4%',
            
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '120%',
            color: '#979797',
            opacity: 1}}
        >
          เกมสะสมคะแนน
        </div>

        {/* ชื่อสำหรับเล่น label */}
        <div
          className="absolute"
          style={{
            top: '44.1%',
            left: '4.3%',
            
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '120%',
            color: '#979797',
            opacity: 1}}
        >
          ชื่อสำหรับเล่น (Nickname)
        </div>

        {/* Input field */}
        <div className="absolute" style={{ top: '47%', left: '4.3%', width: '92%' }}>
          <input
            form="nickname-form"
            placeholder="Test 234"
            {...register('nickname')}
            disabled={isPending}
            autoComplete="off"
            className="w-full h-[48px] border border-[#D9D9D9] bg-white px-4 text-[14px] font-kanit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderRadius: '8px',
              opacity: 1}}
          />
        </div>

        {/* Error message */}
        {(errors.nickname?.message || serverError) && (
          <div
            className="absolute text-sm text-red-500"
            style={{ top: '53.4%', left: '4.3%' }}
          >
            {errors.nickname?.message || serverError}
          </div>
        )}

        {/* Hidden form submit */}
        <form id="nickname-form" onSubmit={handleSubmit} className="hidden" />

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