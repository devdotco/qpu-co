'use client'

import * as React from 'react'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'

export interface CheckboxProps {
  id?: string
  label?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({
  id,
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  className,
}: CheckboxProps) {
  const checkboxId = id ?? (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RadixCheckbox.Root
        id={checkboxId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(state) => onCheckedChange?.(state === true)}
        disabled={disabled}
        className={cn(
          'w-4 h-4 rounded-[3px] border shrink-0',
          'bg-[var(--color-bg-raised)] border-[var(--color-border)]',
          'transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          'data-[state=checked]:bg-[var(--color-accent)] data-[state=checked]:border-[var(--color-accent)]',
          'hover:border-[var(--color-border-strong)]',
        )}
      >
        <RadixCheckbox.Indicator className="flex items-center justify-center text-[var(--color-bg-base)]">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      {label && (
        <label
          htmlFor={checkboxId}
          className={cn(
            'text-sm text-[var(--color-text-secondary)] cursor-pointer select-none',
            disabled && 'opacity-50 pointer-events-none',
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}
