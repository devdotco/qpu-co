import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center flex-wrap gap-x-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-x-1">
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'text-xs font-mono',
                    isLast
                      ? 'text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-muted)]',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'text-xs font-mono text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-text-secondary)] transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 rounded-sm',
                  )}
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <span
                  className="text-[var(--color-text-faint)] text-xs font-mono select-none"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
