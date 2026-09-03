import { cn } from '@/lib/utils'
import type { ArticleCategory } from '@/types'

export const CATEGORY_META: Record<
  ArticleCategory,
  { label: string; bg: string; text: string }
> = {
  hardware:   { label: 'Hardware',   bg: 'bg-blue-500/15',                       text: 'text-blue-400' },
  research:   { label: 'Research',   bg: 'bg-violet-500/15',                     text: 'text-violet-400' },
  business:   { label: 'Business',   bg: 'bg-amber-500/15',                      text: 'text-amber-400' },
  benchmarks: { label: 'Benchmarks', bg: 'bg-emerald-500/15',                    text: 'text-emerald-400' },
  software:   { label: 'Software',   bg: 'bg-[var(--color-accent-dim)]',          text: 'text-[var(--color-accent)]' },
  policy:     { label: 'Policy',     bg: 'bg-orange-500/15',                     text: 'text-orange-400' },
}

export function CategoryChip({
  category,
  className,
}: {
  category: ArticleCategory
  className?: string
}) {
  const meta = CATEGORY_META[category]
  return (
    <span
      className={cn(
        'chip border-transparent font-mono text-[11px] tracking-wider uppercase',
        meta.bg,
        meta.text,
        className,
      )}
    >
      {meta.label}
    </span>
  )
}
