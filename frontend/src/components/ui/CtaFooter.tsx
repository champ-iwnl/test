import type { PropsWithChildren } from 'react'
import { cn } from '@/utils/cn'

type CtaFooterProps = PropsWithChildren<{
  className?: string
}>

export function CtaFooter({ className, children }: CtaFooterProps) {
  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 flex justify-center">
      <div
        className={cn(
          'px-4 pb-6 pt-4 bg-white rounded-b-3xl  w-full max-w-[375px]',
          className
        )}
      >
        <div className="mx-auto w-full">{children}</div>
      </div>
    </div>
  )
}
