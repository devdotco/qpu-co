import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, User, Calendar, Tag, Mail, ArrowLeft } from 'lucide-react'
import { getArticleBySlug, getArticles } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Separator } from '@/components/ui/Separator'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { CategoryChip, CATEGORY_META } from '@/components/intelligence/CategoryChip'
import { ArticleContent, extractH2Headings } from '@/components/intelligence/ArticleContent'
import { TableOfContents } from '@/components/intelligence/TableOfContents'
import { ArticleCard } from '@/components/intelligence/ArticleCard'
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/metadata'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.title,
    description: article.dek,
    openGraph: {
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? undefined,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ])

  if (!article) notFound()

  const content = article.content ?? article.excerpt
  const tocItems = extractH2Headings(content)

  // Related articles: same category, excluding current
  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  // If not enough same-category, pad with latest overall
  const relatedFilled =
    related.length >= 2
      ? related
      : [
          ...related,
          ...allArticles
            .filter((a) => a.id !== article.id && !related.includes(a))
            .slice(0, 3 - related.length),
        ]

  // JSON-LD
  const articleSchema = buildArticleSchema({
    title: article.title,
    dek: article.dek,
    author: article.author,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt ?? undefined,
    slug: article.slug,
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: 'QPU.co', href: '/' },
    { label: 'Intelligence', href: '/intelligence' },
    { label: CATEGORY_META[article.category].label, href: `/intelligence?cat=${article.category}` },
    { label: article.title },
  ])

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[var(--color-bg-base)]">
        {/* Top bar */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <Breadcrumb
                items={[
                  { label: 'QPU.co', href: '/' },
                  { label: 'Intelligence', href: '/intelligence' },
                  { label: CATEGORY_META[article.category].label },
                ]}
              />
              <Link
                href="/intelligence"
                className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors font-mono"
              >
                <ArrowLeft size={12} />
                All articles
              </Link>
            </div>
          </div>
        </div>

        {/* Three-column layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_260px] gap-8 lg:gap-10">

            {/* Left sidebar: TOC (sticky) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={tocItems} />
              </div>
            </aside>

            {/* Main article column */}
            <article className="min-w-0">
              {/* Article header */}
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <CategoryChip category={article.category} />
                  {article.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="muted" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-[var(--color-text-primary)] mb-3 leading-tight">
                  {article.title}
                </h1>

                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-5 max-w-none">
                  {article.dek}
                </p>

                {/* Byline */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                    <User size={13} />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                    <Calendar size={13} />
                    {formatDate(article.publishedAt)}
                  </span>
                  {article.updatedAt && (
                    <span className="text-xs text-[var(--color-text-muted)] font-mono">
                      Updated {formatDate(article.updatedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                    <Clock size={13} />
                    {article.readingTime} min read
                  </span>
                </div>
              </header>

              <Separator className="mb-8" />

              {/* Article body */}
              <ArticleContent content={content} className="max-w-prose" />

              {/* Tags footer */}
              {article.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={13} className="text-[var(--color-text-muted)]" />
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Right sidebar */}
            <aside className="space-y-6">

              {/* Related articles */}
              {relatedFilled.length > 0 && (
                <div>
                  <p className="eyebrow mb-3">Related Articles</p>
                  <div className="space-y-3">
                    {relatedFilled.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/intelligence/${rel.slug}`}
                        className="block group"
                      >
                        <Card
                          hover
                          padding="sm"
                          className="group-hover:border-[var(--color-border-strong)]"
                        >
                          <div className="flex items-start gap-2 mb-1.5">
                            <CategoryChip category={rel.category} className="mt-0.5 shrink-0" />
                          </div>
                          <p className="text-xs font-semibold text-[var(--color-text-primary)] leading-snug group-hover:text-[var(--color-accent)] transition-colors mb-1">
                            {rel.title}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)] font-mono">
                            {formatDate(rel.publishedAt)} · {rel.readingTime}m
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="panel p-4 border-[rgba(34,211,238,0.18)]">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={13} className="text-[var(--color-accent)]" />
                  <span className="eyebrow text-[var(--color-accent)]">Newsletter</span>
                </div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">
                  QPU Intelligence Digest
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  Weekly quantum hardware updates. No marketing.
                </p>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-2.5 py-1.5 text-xs rounded-[var(--radius-sm)] bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-2 focus:outline-[var(--color-accent)] mb-2"
                />
                <button className="w-full py-1.5 text-xs font-medium rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-[var(--color-bg-base)] hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>

              {/* QPU Explorer link */}
              <div className="panel p-4">
                <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">
                  Explore QPU Hardware
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  Full specs, benchmarks, and cloud availability for every major QPU.
                </p>
                <Link
                  href="/qpus"
                  className="text-xs font-mono text-[var(--color-accent)] hover:opacity-80 transition-opacity"
                >
                  QPU Database →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
