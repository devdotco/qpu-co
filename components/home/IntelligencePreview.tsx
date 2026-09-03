'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Article, ArticleCategory } from '@/types'

interface IntelligencePreviewProps {
  articles: Article[]
  allArticles?: Article[]
}

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  hardware:   '#60A5FA',
  research:   '#A78BFA',
  business:   '#34D399',
  benchmarks: '#FB923C',
  software:   '#F472B6',
  policy:     '#FBBF24',
}

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  hardware:   'Hardware',
  research:   'Research',
  business:   'Business',
  benchmarks: 'Benchmarks',
  software:   'Software',
  policy:     'Policy',
}

const TABS = [
  { key: 'latest',     label: 'Latest' },
  { key: 'hardware',   label: 'Hardware' },
  { key: 'research',   label: 'Research' },
  { key: 'business',   label: 'Business' },
] as const

type TabKey = typeof TABS[number]['key']

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ArticleCard({ article }: { article: Article }) {
  const catColor = CATEGORY_COLORS[article.category] ?? '#9AA4B2'
  const catLabel = CATEGORY_LABELS[article.category] ?? article.category

  return (
    <article style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'border-color 0.15s',
    }}>
      {/* Category chip */}
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '9999px',
        background: catColor + '18',
        border: `1px solid ${catColor}33`,
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: catColor,
        width: 'fit-content',
      }}>
        {catLabel}
      </span>

      {/* Headline */}
      <h3 style={{
        margin: 0,
        fontSize: '15px',
        fontWeight: '600',
        color: 'var(--color-text-primary)',
        lineHeight: '1.4',
      }}>
        {article.title}
      </h3>

      {/* Dek */}
      <p style={{
        margin: 0,
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.55',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {article.dek}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px solid var(--color-border-subtle)',
        marginTop: 'auto',
      }}>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          <span>{article.author}</span>
          <span style={{ margin: '0 6px', opacity: 0.5 }}>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span style={{ margin: '0 6px', opacity: 0.5 }}>·</span>
          <span>{article.readingTime} min</span>
        </div>
        <Link
          href={`/intelligence/${article.slug}`}
          style={{
            fontSize: '12px',
            color: 'var(--color-accent)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Read →
        </Link>
      </div>
    </article>
  )
}

export default function IntelligencePreview({ articles, allArticles }: IntelligencePreviewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('latest')

  const pool = allArticles ?? articles

  const displayed = activeTab === 'latest'
    ? pool.slice(0, 3)
    : pool.filter(a => a.category === activeTab).slice(0, 3)

  // Fall back to top 3 if filter returns nothing
  const toShow = displayed.length > 0 ? displayed : articles.slice(0, 3)

  return (
    <section style={{
      background: 'var(--color-bg-base)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              INTELLIGENCE
            </span>
            <h2 style={{ margin: 0 }}>QPU Intelligence</h2>
          </div>
          <Link
            href="/intelligence"
            style={{
              fontSize: '13px',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em',
            }}
          >
            View QPU Intelligence →
          </Link>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 14px',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.key ? 'var(--color-accent)' : 'transparent'}`,
                marginBottom: '-1px',
                fontSize: '13px',
                color: activeTab === tab.key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: activeTab === tab.key ? '500' : '400',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
          className="intel-grid"
        >
          {toShow.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link
            href="/intelligence"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '9px 20px',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: '6px',
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            View QPU Intelligence →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .intel-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .intel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
