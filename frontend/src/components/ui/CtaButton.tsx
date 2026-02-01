import type { ComponentProps } from 'react'
import { Button } from './Button'
import { cn } from '@/utils/cn'

type CtaButtonProps = ComponentProps<typeof Button> & {
  emphasis?: boolean
}

export function CtaButton({
  emphasis = false,
  className,
  ...props
}: CtaButtonProps) {
  return (
    <Button
      {...props}
      size="md"
      className={cn('w-full rounded-full', emphasis ? 'font-semibold' : '', className)}
    />
  )
}
