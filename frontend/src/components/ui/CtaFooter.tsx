import type { PropsWithChildren } from 'react'
import { cn } from '@/utils/cn'

type CtaFooterProps = PropsWithChildren<{
  className?: string
}>

export function CtaFooter({ className, children }: CtaFooterProps) {
  return (
    <div className="absolute left-0 right-0 bottom-0">
      <div
        className={cn(
          'px-4 pb-6 pt-4 bg-white rounded-b-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)]',
          className
        )}
      >
        <div className="mx-auto w-full max-w-[343px]">{children}</div>
      </div>
    </div>
  )
}
