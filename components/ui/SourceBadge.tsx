'use client'

import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import type { Source } from '@/types'
import { cn } from '@/lib/utils'

export interface SourceBadgeProps {
  source: Source
  compact?: boolean
}

const sourceTypeLabel: Record<Source['sourceType'], string> = {
  manufacturer: 'Manufacturer',
  'cloud-provider': 'Cloud Provider',
  research: 'Research',
  'technical-paper': 'Technical Paper',
  announcement: 'Announcement',
  secondary: 'Secondary Source',
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export function SourceBadge({ source, compact = false }: SourceBadgeProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded border font-medium transition-colors',
            'border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-muted)]',
            'hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]',
            'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
            compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
          )}
          aria-label={`Source: ${source.publisher}`}
        >
          {/* Checkmark icon */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="text-[var(--color-accent)] shrink-0"
          >
            <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeOpacity="0.4" />
            <path
              d="M3 5l1.5 1.5L7 3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {compact ? 'Verified' : `Verified · ${sourceTypeLabel[source.sourceType]}`}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={6}
          className={cn(
            'z-50 w-72 rounded-[var(--radius-lg)] border border-[var(--color-border-strong)]',
            'bg-[var(--color-bg-panel)] shadow-xl p-4',
            'animate-fade-in',
          )}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="text-[var(--color-accent)] shrink-0 mt-0.5"
              >
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.4" />
                <path
                  d="M4.5 7l2 2L9.5 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                  Verified Source
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  Data confirmed from primary source
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--color-border-subtle)] pt-3 space-y-2">
              <Row label="Publisher" value={source.publisher} />
              <Row label="Type" value={sourceTypeLabel[source.sourceType]} />
              {source.publishedAt && (
                <Row label="Published" value={formatDate(source.publishedAt)} />
              )}
              <Row label="Accessed" value={formatDate(source.accessedAt)} />
              {source.title && (
                <div>
                  <p className="mono-label mb-0.5">Title</p>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-snug line-clamp-2">
                    {source.title}
                  </p>
                </div>
              )}
            </div>

            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1.5 text-[10px] text-[var(--color-accent)]',
                  'hover:underline underline-offset-2',
                )}
              >
                View source
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path
                    d="M5.5 2H8v2.5M8 2L4 6M2 3.5V8h4.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>

          <Popover.Arrow className="fill-[var(--color-bg-panel)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <p className="mono-label shrink-0">{label}</p>
      <p className="text-xs text-[var(--color-text-secondary)] text-right">{value}</p>
    </div>
  )
}
