import * as React from 'react'
import type { QPUStatus } from '@/types'
import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  status: QPUStatus
  size?: 'sm' | 'md'
}

interface StatusConfig {
  label: string
  dotColor: string
  chipClass: string
}

const statusConfig: Record<QPUStatus, StatusConfig> = {
  public: {
    label: 'Public Access',
    dotColor: 'var(--color-success)',
    chipClass:
      'bg-[var(--color-success-dim)] text-[var(--color-success)] border-[rgba(74,222,128,0.2)]',
  },
  cloud: {
    label: 'Cloud Access',
    dotColor: 'var(--color-accent)',
    chipClass:
      'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border-[rgba(34,211,238,0.2)]',
  },
  reservation: {
    label: 'Reservation',
    dotColor: 'var(--color-warning)',
    chipClass:
      'bg-[var(--color-warning-dim)] text-[var(--color-warning)] border-[rgba(245,158,11,0.2)]',
  },
  private: {
    label: 'Private Access',
    dotColor: 'var(--color-text-muted)',
    chipClass:
      'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]',
  },
  research: {
    label: 'Research',
    dotColor: '#818CF8',
    chipClass:
      'bg-[rgba(129,140,248,0.1)] text-[#818CF8] border-[rgba(129,140,248,0.2)]',
  },
  announced: {
    label: 'Announced',
    dotColor: 'var(--color-warning)',
    chipClass:
      'bg-[var(--color-warning-dim)] text-[var(--color-warning)] border-[rgba(245,158,11,0.2)]',
  },
  retired: {
    label: 'Retired',
    dotColor: 'var(--color-text-muted)',
    chipClass:
      'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]',
  },
  offline: {
    label: 'Offline',
    dotColor: 'var(--color-danger)',
    chipClass:
      'bg-[var(--color-danger-dim)] text-[var(--color-danger)] border-[rgba(248,113,113,0.2)]',
  },
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const dotSize = size === 'sm' ? 6 : 7
  const textClass = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-0.5'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        textClass,
        padding,
        config.chipClass,
      )}
    >
      <span
        style={{
          display: 'inline-block',
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: config.dotColor,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      {config.label}
    </span>
  )
}
