import * as React from 'react'
import type { Source } from '@/types'
import { cn } from '@/lib/utils'
import { SourceBadge } from './SourceBadge'

export interface TechnicalTableRow {
  label: string
  value: string | number | null
  unit?: string
  source?: Source
  notes?: string
}

export interface TechnicalTableProps {
  rows: TechnicalTableRow[]
  title?: string
}

export function TechnicalTable({ rows, title }: TechnicalTableProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]"
            style={{ letterSpacing: '0.08em' }}>
            {title}
          </p>
        </div>
      )}

      <table className="w-full">
        <tbody>
          {rows.map((row, i) => {
            const isEmpty = row.value === null || row.value === undefined
            return (
              <tr
                key={`${row.label}-${i}`}
                className={cn(
                  'border-b border-[var(--color-border-subtle)] last:border-none',
                  'hover:bg-[var(--color-bg-overlay)] transition-colors duration-100',
                )}
              >
                {/* Label column */}
                <td className="px-4 py-3 w-[45%] align-top">
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">
                    {row.label}
                  </span>
                </td>

                {/* Value column */}
                <td className="px-4 py-3 align-top">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isEmpty
                            ? 'text-[var(--color-text-faint)]'
                            : 'text-[var(--color-text-primary)]',
                        )}
                      >
                        {isEmpty ? '—' : row.value}
                      </span>
                      {!isEmpty && row.unit && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {row.unit}
                        </span>
                      )}
                    </div>

                    {row.notes && (
                      <p className="text-[11px] text-[var(--color-text-muted)] leading-snug">
                        {row.notes}
                      </p>
                    )}

                    {row.source && (
                      <div className="pt-0.5">
                        <SourceBadge source={row.source} compact />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
