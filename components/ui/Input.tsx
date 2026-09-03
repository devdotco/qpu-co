import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

export function Input({
  label,
  error,
  hint,
  icon,
  suffix,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span
            className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          className={cn(
            'w-full h-9 text-sm rounded-[var(--radius-md)]',
            'bg-[var(--color-bg-raised)] border border-[var(--color-border)]',
            'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)]',
            'transition-colors duration-150',
            'focus:outline-none focus:border-[var(--color-accent)]',
            'focus:ring-1 focus:ring-[var(--color-accent)] focus:ring-opacity-30',
            'disabled:opacity-50 disabled:pointer-events-none',
            error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
            icon ? 'pl-9' : 'pl-3',
            suffix ? 'pr-9' : 'pr-3',
            className,
          )}
          {...props}
        />

        {suffix && (
          <span
            className="absolute right-3 text-[var(--color-text-muted)] pointer-events-none"
            aria-hidden="true"
          >
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  )
}
