import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--color-text-primary)] text-[var(--color-bg-base)] hover:bg-white/90 border border-transparent',
  secondary:
    'bg-[var(--color-bg-panel)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-overlay)]',
  ghost:
    'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-bg-panel)] hover:text-[var(--color-text-primary)] border border-transparent',
  outline:
    'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-panel)]',
  accent:
    'bg-[var(--color-accent)] text-[var(--color-bg-base)] hover:bg-[#38ddf2] border border-transparent font-medium',
  danger:
    'bg-[var(--color-danger-dim)] text-[var(--color-danger)] border border-[rgba(248,113,113,0.2)] hover:bg-[rgba(248,113,113,0.2)]',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-7 text-xs px-3 gap-1.5',
  md: 'h-9 text-sm px-4 gap-2',
  lg: 'h-10 text-sm px-5 gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  asChild = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClassName = cn(
    'inline-flex items-center justify-center rounded-[var(--radius-md)]',
    'font-medium transition-colors duration-150',
    'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    'select-none whitespace-nowrap',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  const spinner = (
    <svg
      className="animate-spin shrink-0"
      width={size === 'sm' ? 12 : 14}
      height={size === 'sm' ? 12 : 14}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M14 8a6 6 0 00-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )

  // When rendering as a slot (asChild), pass only the children so Slot
  // receives exactly one React element child as required.
  if (asChild) {
    // Slot merges className + any remaining props onto the child element.
    // Omit button-specific attributes that are invalid on arbitrary elements.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type: _type, ...slotProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>
    return (
      <Slot className={baseClassName} {...slotProps}>
        {children}
      </Slot>
    )
  }

  return (
    <button
      className={baseClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && spinner}
      {children}
    </button>
  )
}
