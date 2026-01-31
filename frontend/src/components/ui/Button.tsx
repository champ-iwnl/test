import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95'
    
    // Variants
    const variants = {
      primary: 'bg-gold text-white shadow-md hover:bg-yellow-500 focus:ring-gold/50', // Gold #FFC107
      secondary: 'bg-red text-white shadow-md hover:bg-red/90 focus:ring-red/50', // Red #DC143C
      outline: 'border-2 border-gold text-gold bg-transparent hover:bg-gold/10',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    }

    // Sizes
    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-12 px-6 text-base', // min 48px
      lg: 'h-14 px-8 text-lg',
    }

    // Width
    const widthClass = fullWidth ? 'w-full' : ''

    const content = (
      <>
        {isLoading && <Spinner size="sm" variant="white" className="mr-2" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    )

    // Use motion.button for animations if desired, but here standard button with CSS transition for active scale 
    // active:scale-95 is added in baseStyles.

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthClass,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
