import * as React from 'react'
import * as RadixSeparator from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  decorative?: boolean
}

export function Separator({
  orientation = 'horizontal',
  className,
  style,
  decorative = true,
}: SeparatorProps) {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'bg-[var(--color-border)] shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className,
      )}
      style={style}
    />
  )
}
