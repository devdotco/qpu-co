import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] border-dashed',
        'bg-[var(--color-bg-panel)] px-8 py-16',
        className,
      )}
    >
      {icon && (
        <div
          className="mb-4 text-[var(--color-text-faint)] flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action.href ? (
            <Button variant="secondary" size="sm" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
