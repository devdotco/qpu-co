import * as React from 'react'
import type { SuitabilityLevel } from '@/types'
import { cn } from '@/lib/utils'

export interface SuitabilityIndicatorProps {
  level: SuitabilityLevel
  showLabel?: boolean
  size?: 'sm' | 'md'
}

interface LevelConfig {
  label: string
  element: (size: 'sm' | 'md') => React.ReactNode
}

const indicatorSize = { sm: 8, md: 10 }

function FilledCircle({ color, sz }: { color: string; sz: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: sz,
        height: sz,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  )
}

function OutlineCircle({ color, sz }: { color: string; sz: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: sz,
        height: sz,
        borderRadius: '50%',
        border: `1.5px solid ${color}`,
        backgroundColor: 'transparent',
        flexShrink: 0,
      }}
    />
  )
}

function DashIndicator({ sz }: { sz: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: sz * 1.5,
        height: 2,
        borderRadius: 1,
        backgroundColor: 'var(--color-text-faint)',
        flexShrink: 0,
      }}
    />
  )
}

const levelConfig: Record<SuitabilityLevel, LevelConfig> = {
  strong: {
    label: 'Strong Fit',
    element: (size) => (
      <FilledCircle color="var(--color-success)" sz={indicatorSize[size]} />
    ),
  },
  possible: {
    label: 'Possible',
    element: (size) => (
      <FilledCircle color="var(--color-warning)" sz={indicatorSize[size]} />
    ),
  },
  experimental: {
    label: 'Experimental',
    element: (size) => (
      <OutlineCircle color="var(--color-warning)" sz={indicatorSize[size]} />
    ),
  },
  limited: {
    label: 'Limited',
    element: (size) => (
      <OutlineCircle color="var(--color-danger)" sz={indicatorSize[size]} />
    ),
  },
  unknown: {
    label: 'Unknown',
    element: (size) => <DashIndicator sz={indicatorSize[size]} />,
  },
}

export function SuitabilityIndicator({
  level,
  showLabel = false,
  size = 'sm',
}: SuitabilityIndicatorProps) {
  const config = levelConfig[level]
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <span className="inline-flex items-center gap-1.5">
      {config.element(size)}
      {showLabel && (
        <span className={cn(textClass, 'text-[var(--color-text-secondary)]')}>
          {config.label}
        </span>
      )}
    </span>
  )
}
