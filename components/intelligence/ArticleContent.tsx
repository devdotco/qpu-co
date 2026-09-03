import React from 'react'
import { cn } from '@/lib/utils'

// ─── Inline formatting ────────────────────────────────────────────────────────

function applyInlineFormatting(text: string): React.ReactNode[] {
  // Handle **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[var(--color-text-primary)]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part || null
  }).filter(Boolean) as React.ReactNode[]
}

// ─── Block renderer ───────────────────────────────────────────────────────────

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+$/, '')
}

export function extractH2Headings(content: string): { text: string; id: string }[] {
  return content
    .split('\n')
    .filter((line) => line.match(/^## /))
    .map((line) => {
      const text = line.slice(3).trim()
      return { text, id: slugifyHeading(text) }
    })
}

interface ArticleContentProps {
  content: string
  className?: string
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  // Split into blocks by blank lines
  const blocks = content.split(/\n\n+/).map((b) => b.trim()).filter(Boolean)

  const rendered = blocks.map((block, blockIdx) => {
    const lines = block.split('\n')
    const firstLine = lines[0]

    // H2 heading
    if (firstLine.startsWith('## ')) {
      const text = firstLine.slice(3).trim()
      return (
        <h2
          key={blockIdx}
          id={slugifyHeading(text)}
          className="text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4 scroll-mt-20"
        >
          {text}
        </h2>
      )
    }

    // H3 heading
    if (firstLine.startsWith('### ')) {
      const text = firstLine.slice(4).trim()
      return (
        <h3
          key={blockIdx}
          className="text-base font-semibold text-[var(--color-text-primary)] mt-6 mb-3"
        >
          {text}
        </h3>
      )
    }

    // Numbered ordered list (lines starting with "1. " "2. " etc.)
    const isNumberedList = lines.every((l) => /^\d+\.\s/.test(l.trim()))
    if (isNumberedList && lines.length > 0) {
      return (
        <ol
          key={blockIdx}
          className="list-decimal list-inside space-y-2 my-4 pl-1"
        >
          {lines.map((l, i) => {
            const text = l.trim().replace(/^\d+\.\s+/, '')
            return (
              <li key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {applyInlineFormatting(text)}
              </li>
            )
          })}
        </ol>
      )
    }

    // Unordered list
    const isUnorderedList = lines.every(
      (l) => l.trim().startsWith('- ') || l.trim().startsWith('* '),
    )
    if (isUnorderedList && lines.length > 0) {
      return (
        <ul key={blockIdx} className="space-y-2 my-4">
          {lines.map((l, i) => {
            const text = l.trim().slice(2)
            return (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                <span className="leading-relaxed">{applyInlineFormatting(text)}</span>
              </li>
            )
          })}
        </ul>
      )
    }

    // Regular paragraph — join all lines in the block
    const joined = lines.join(' ')
    return (
      <p
        key={blockIdx}
        className="text-sm text-[var(--color-text-secondary)] leading-relaxed my-4 max-w-none"
      >
        {applyInlineFormatting(joined)}
      </p>
    )
  })

  return (
    <div className={cn('article-body', className)}>
      {rendered}
    </div>
  )
}
