import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DataFreshnessProps {
  verifiedAt?: string
  updatedAt: string
  onReport?: () => void
}

function daysAgo(iso: string): number {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function freshnessLabel(days: number): string {
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  if (days < 60) return '1 month ago'
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} months ago`
  const years = Math.floor(months / 12)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

export function DataFreshness({ verifiedAt, updatedAt, onReport }: DataFreshnessProps) {
  const primaryDate = verifiedAt ?? updatedAt
  const days = daysAgo(primaryDate)
  const label = verifiedAt ? 'Verified' : 'Updated'
  const isStale = days > 180

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span
        className={cn(
          'font-mono text-[10px] tracking-wide',
          isStale ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-muted)]',
        )}
        style={{ letterSpacing: '0.06em' }}
      >
        {label} {freshnessLabel(days)}
      </span>

      {onReport && (
        <>
          <span
            className="text-[var(--color-text-faint)] font-mono text-[10px]"
            aria-hidden="true"
          >
            ·
          </span>
          <button
            type="button"
            onClick={onReport}
            className={cn(
              'font-mono text-[10px] tracking-wide',
              'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              'underline underline-offset-2 decoration-dotted',
              'transition-colors',
              'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 rounded-sm',
            )}
            style={{ letterSpacing: '0.06em' }}
          >
            Report outdated data
          </button>
        </>
      )}
    </div>
  )
}
