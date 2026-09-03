'use client'

import * as React from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export interface TooltipProps {
  content: string | React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={300}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-50 max-w-[240px] rounded-[var(--radius-md)] border border-[var(--color-border-strong)]',
              'bg-[var(--color-bg-panel)] px-3 py-2',
              'text-xs text-[var(--color-text-secondary)] leading-snug',
              'shadow-lg',
              'animate-fade-in',
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-[var(--color-bg-panel)]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
