import Link from 'next/link'
import { ArrowRight, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { CategoryChip } from './CategoryChip'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
  className?: string
  featured?: boolean
}

export function ArticleCard({ article, className, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/intelligence/${article.slug}`} className="group block">
      <Card
        hover
        padding={featured ? 'lg' : 'md'}
        className={cn(
          'h-full flex flex-col transition-all duration-200',
          'group-hover:border-[var(--color-border-strong)]',
          className,
        )}
      >
        {/* Category + reading time */}
        <div className="flex items-center justify-between mb-3">
          <CategoryChip category={article.category} />
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] font-mono">
            <Clock size={10} />
            {article.readingTime}m
          </span>
        </div>

        {/* Headline */}
        <h2
          className={cn(
            'font-semibold text-[var(--color-text-primary)] leading-snug mb-2',
            'group-hover:text-[var(--color-accent)] transition-colors',
            featured ? 'text-xl' : 'text-[0.9375rem]',
          )}
        >
          {article.title}
        </h2>

        {/* Dek */}
        <p
          className={cn(
            'text-[var(--color-text-secondary)] leading-relaxed flex-1 mb-4',
            featured ? 'text-sm' : 'text-xs',
          )}
        >
          {article.dek}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border-subtle)]">
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
            <User size={10} />
            {article.author}
            <span className="mx-1 text-[var(--color-text-faint)]">·</span>
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] font-mono text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            Read
            <ArrowRight size={11} />
          </span>
        </div>
      </Card>
    </Link>
  )
}
