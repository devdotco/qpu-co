import * as React from 'react'
import type { Source } from '@/types'
import { cn } from '@/lib/utils'
import { SourceBadge } from './SourceBadge'

export interface MetricCardProps {
  label: string
  value: string | number | null
  unit?: string
  description?: string
  source?: Source
  size?: 'sm' | 'md' | 'lg'
  highlight?: boolean
}

const sizeConfig = {
  sm: {
    padding: 'p-3',
    valueText: 'text-xl',
    labelText: 'text-[9px]',
    unitText: 'text-sm',
    descText: 'text-[10px]',
  },
  md: {
    padding: 'p-4',
    valueText: 'text-2xl',
    labelText: 'text-[10px]',
    unitText: 'text-base',
    descText: 'text-xs',
  },
  lg: {
    padding: 'p-5',
    valueText: 'text-3xl',
    labelText: 'text-xs',
    unitText: 'text-lg',
    descText: 'text-sm',
  },
}

export function MetricCard({
  label,
  value,
  unit,
  description,
  source,
  size = 'md',
  highlight = false,
}: MetricCardProps) {
  const cfg = sizeConfig[size]
  const isEmpty = value === null || value === undefined

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border',
        'bg-[var(--color-bg-panel)]',
        highlight
          ? 'border-[rgba(34,211,238,0.25)] shadow-[0_0_0_1px_rgba(34,211,238,0.06)]'
          : 'border-[var(--color-border)]',
        cfg.padding,
      )}
    >
      {/* Label */}
      <p
        className={cn(
          'font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2',
          cfg.labelText,
        )}
        style={{ letterSpacing: '0.08em' }}
      >
        {label}
      </p>

      {/* Value row */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            'font-semibold leading-none',
            isEmpty
              ? 'text-[var(--color-text-faint)]'
              : highlight
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-primary)]',
            cfg.valueText,
          )}
        >
          {isEmpty ? '—' : value}
        </span>
        {!isEmpty && unit && (
          <span
            className={cn('text-[var(--color-text-muted)] font-normal', cfg.unitText)}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'mt-1.5 text-[var(--color-text-muted)] leading-snug',
            cfg.descText,
          )}
        >
          {description}
        </p>
      )}

      {/* Source */}
      {source && (
        <div className="mt-2">
          <SourceBadge source={source} compact />
        </div>
      )}
    </div>
  )
}
