import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, fullWidth = true, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '', containerClassName)}>
        {label && (
          <label className="text-sm font-medium text-gray-700 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={cn(
              'flex',
              'w-[345px]',
              'h-[48px]',
              'rounded-[8px]',
              'border',
              error ? 'border-red' : 'border-[#D9D9D9]',
              'bg-white',
              'px-4',
              'text-[14px]',
              'font-regular',
              'font-kanit',
              'leading-[120%]',
              'text-center',
              'placeholder:text-gray-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:border-gold focus-visible:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            style={{
              paddingRight: '16px',
              paddingLeft: '16px',
              gap: '8px',
              opacity: 1,
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
