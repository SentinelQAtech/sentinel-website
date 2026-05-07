import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

type Variant = 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'glow'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  default:     'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]',
  secondary:   'bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]',
  ghost:       'text-white/70 hover:text-white hover:bg-white/[0.06]',
  destructive: 'bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.98]',
  outline:     'border border-white/15 text-white/80 hover:border-white/30 hover:bg-white/[0.04] hover:text-white',
  glow:        'bg-primary text-white hover:bg-primary/90 active:scale-[0.98] shadow-glow-sm hover:shadow-glow-md',
}

const sizeStyles: Record<Size, string> = {
  xs:   'h-7 px-2.5 text-xs gap-1.5',
  sm:   'h-8 px-3 text-sm gap-1.5',
  md:   'h-9 px-4 text-sm gap-2',
  lg:   'h-11 px-6 text-base gap-2',
  icon: 'h-9 w-9 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-all duration-200 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
