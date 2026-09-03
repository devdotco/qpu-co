'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access denied — silently fail
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)]',
        'border border-[var(--color-border)] bg-[var(--color-bg-panel)]',
        'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
        'hover:bg-[var(--color-bg-overlay)] hover:border-[var(--color-border-strong)]',
        'transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
        className,
      )}
    >
      {copied ? (
        /* Checkmark */
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden="true"
          className="text-[var(--color-success)]"
        >
          <path
            d="M2.5 6.5l3 3 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* Copy icon */
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="4.5"
            y="4.5"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M2.5 8.5V2.5h6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
