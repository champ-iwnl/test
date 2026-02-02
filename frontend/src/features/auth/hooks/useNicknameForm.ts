import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { usePlayerStore } from '@/store/playerStore'
import { nicknameSchema, type NicknameFormData } from '../validators'
import { AUTH_ERRORS } from '../constants'

export function useNicknameForm() {
  const router = useRouter()
  const setPlayer = usePlayerStore((state) => state.setPlayer)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
  })

  const enterMutation = useMutation({
    mutationFn: (data: NicknameFormData) => authService.enter(data.nickname),
    onSuccess: (data) => {
      setPlayer({
        id: data.id,
        nickname: data.nickname,
        total_points: data.total_points,
        created_at: data.created_at,
      })
      router.push('/home')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || AUTH_ERRORS.default
      setServerError(message)
    },
  })

  const onSubmit = useCallback(
    (data: NicknameFormData) => {
      setServerError(null)
      enterMutation.mutate(data)
    },
    [enterMutation]
  )

  const handleSubmit = form.handleSubmit(onSubmit)

  return {
    // Form state
    register: form.register,
    errors: form.formState.errors,
    serverError,
    isPending: enterMutation.isPending,
    
    // Actions
    handleSubmit,
  }
}
