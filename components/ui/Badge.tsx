import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted' | 'outline'
  size?: 'sm' | 'md'
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:
    'bg-[var(--color-bg-panel)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
  accent:
    'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border-[rgba(34,211,238,0.2)]',
  success:
    'bg-[var(--color-success-dim)] text-[var(--color-success)] border-[rgba(74,222,128,0.2)]',
  warning:
    'bg-[var(--color-warning-dim)] text-[var(--color-warning)] border-[rgba(245,158,11,0.2)]',
  danger:
    'bg-[var(--color-danger-dim)] text-[var(--color-danger)] border-[rgba(248,113,113,0.2)]',
  muted:
    'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]',
  outline:
    'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-strong)]',
}

const dotColorClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[var(--color-text-muted)]',
  accent: 'bg-[var(--color-accent)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  muted: 'bg-[var(--color-text-faint)]',
  outline: 'bg-[var(--color-text-muted)]',
}

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-0.5 gap-1.5',
}

export function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'inline-block shrink-0 rounded-full',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotColorClasses[variant],
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
