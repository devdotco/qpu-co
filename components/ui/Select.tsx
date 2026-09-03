'use client'

import * as React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
}: SelectProps) {
  const triggerId = label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={triggerId}
          className="text-xs font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}

      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger
          id={triggerId}
          className={cn(
            'inline-flex items-center justify-between h-9 px-3 text-sm',
            'rounded-[var(--radius-md)] border',
            'bg-[var(--color-bg-raised)]',
            'text-[var(--color-text-primary)]',
            'transition-colors duration-150',
            'focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:ring-opacity-30',
            'disabled:opacity-50 disabled:pointer-events-none',
            error
              ? 'border-[var(--color-danger)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
          )}
        >
          <RadixSelect.Value placeholder={
            <span className="text-[var(--color-text-faint)]">{placeholder}</span>
          } />
          <RadixSelect.Icon>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="text-[var(--color-text-muted)] shrink-0"
            >
              <path
                d="M4 5.5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className={cn(
              'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden',
              'rounded-[var(--radius-lg)] border border-[var(--color-border-strong)]',
              'bg-[var(--color-bg-panel)] shadow-xl',
              'animate-fade-in',
            )}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none',
                    'rounded-[var(--radius-sm)] outline-none',
                    'text-[var(--color-text-secondary)]',
                    'hover:bg-[var(--color-bg-overlay)] hover:text-[var(--color-text-primary)]',
                    'focus:bg-[var(--color-bg-overlay)] focus:text-[var(--color-text-primary)]',
                    'data-[state=checked]:text-[var(--color-accent)]',
                  )}
                >
                  <RadixSelect.ItemIndicator>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && (
        <p className="text-xs text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
