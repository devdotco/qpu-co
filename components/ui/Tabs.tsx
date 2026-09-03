'use client'

import * as React from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  onChange?: (value: string) => void
  children: React.ReactNode
  variant?: 'underline' | 'pills'
}

export function Tabs({
  items,
  defaultValue,
  onChange,
  children,
  variant = 'underline',
}: TabsProps) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.id}
      onValueChange={onChange}
    >
      <RadixTabs.List
        className={cn(
          'flex items-center gap-0.5',
          variant === 'underline'
            ? 'border-b border-[var(--color-border)] mb-4'
            : 'bg-[var(--color-bg-raised)] rounded-[var(--radius-md)] p-1 mb-4 gap-1',
        )}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.id}
            value={item.id}
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 rounded-[var(--radius-sm)]',
              'disabled:opacity-50 disabled:pointer-events-none',
              variant === 'underline'
                ? [
                    'px-3 py-2 -mb-px border-b-2 border-transparent',
                    'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                    'data-[state=active]:text-[var(--color-text-primary)]',
                    'data-[state=active]:border-[var(--color-accent)]',
                  ]
                : [
                    'px-3 py-1.5 rounded-[var(--radius-sm)]',
                    'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                    'data-[state=active]:bg-[var(--color-bg-panel)]',
                    'data-[state=active]:border data-[state=active]:border-[var(--color-border)]',
                    'data-[state=active]:text-[var(--color-text-primary)]',
                    'data-[state=active]:shadow-sm',
                  ],
            )}
          >
            {item.icon && (
              <span className="shrink-0 text-[var(--color-text-muted)]" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {children}
    </RadixTabs.Root>
  )
}

export const TabsContent = RadixTabs.Content
