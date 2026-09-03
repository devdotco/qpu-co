import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
  clickable?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  asChild?: boolean
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({
  className,
  children,
  hover = false,
  clickable = false,
  padding = 'md',
  asChild = false,
}: CardProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)]',
        'bg-[var(--color-bg-panel)]',
        paddingClasses[padding],
        hover && [
          'transition-colors duration-150',
          'hover:bg-[var(--color-bg-overlay)] hover:border-[var(--color-border-strong)]',
        ],
        clickable && [
          'cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
          'focus-visible:ring-0',
        ],
        className,
      )}
      {...(clickable ? { tabIndex: 0, role: 'button' } : {})}
    >
      {children}
    </Comp>
  )
}

export function CardHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('mb-3', className)}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <h3 className={cn('text-sm font-semibold text-[var(--color-text-primary)]', className)} style={style}>
      {children}
    </h3>
  )
}

export function CardContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn(className)}>{children}</div>
}
