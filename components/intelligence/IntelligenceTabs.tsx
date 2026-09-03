'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Article, ArticleCategory } from '@/types'

type TabId = 'latest' | ArticleCategory

const TABS: { id: TabId; label: string }[] = [
  { id: 'latest',     label: 'Latest' },
  { id: 'hardware',   label: 'Hardware' },
  { id: 'research',   label: 'Research' },
  { id: 'business',   label: 'Business' },
  { id: 'benchmarks', label: 'Benchmarks' },
  { id: 'software',   label: 'Software' },
]

interface IntelligenceTabsProps {
  featuredArticle: Article
  articles: Article[]
}

export function IntelligenceTabs({ featuredArticle, articles }: IntelligenceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('latest')

  const filteredArticles =
    activeTab === 'latest'
      ? articles
      : articles.filter((a) => a.category === activeTab)

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-[var(--color-border)] mb-8">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] rounded-t-sm',
                activeTab === tab.id
                  ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured article — only on "Latest" tab */}
      {activeTab === 'latest' && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="eyebrow">Featured</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <ArticleCard article={featuredArticle} featured />
        </div>
      )}

      {/* Article grid */}
      {filteredArticles.length === 0 ? (
        <EmptyState
          title="No articles in this category"
          description="Check back soon — new intelligence is added regularly."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
