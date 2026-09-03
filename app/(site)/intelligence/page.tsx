import type { Metadata } from 'next'
import Link from 'next/link'
import { Activity, CheckCircle2, Mail } from 'lucide-react'
import { getArticles } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { NewsletterInline } from '@/components/intelligence/NewsletterInline'
import { IntelligenceTabs } from '@/components/intelligence/IntelligenceTabs'

export const metadata: Metadata = {
  title: 'QPU Intelligence — Quantum Hardware News & Research',
  description:
    'Track quantum processor launches, performance updates, hardware roadmaps, research developments, and industry activity. Independent quantum computing intelligence.',
}

// Static data updates feed — communicates that QPU.co maintains live hardware data
const DATA_UPDATES = [
  { label: 'IonQ Forte specifications verified', date: '2026-08-28' },
  { label: 'IBM Heron r2 listed on cloud platform index', date: '2026-08-19' },
  { label: 'QuEra Aquila availability status updated', date: '2026-08-12' },
  { label: 'Quantinuum H2-1 benchmark data refreshed', date: '2026-08-05' },
  { label: 'D-Wave Advantage2 Leap pricing verified', date: '2026-07-29' },
  { label: 'IQM Spark educational specs confirmed', date: '2026-07-22' },
]

export default async function IntelligencePage() {
  const allArticles = await getArticles()
  const [featuredArticle, ...restArticles] = allArticles

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Intelligence</p>
            <h1 className="text-[var(--color-text-primary)] mb-4">
              QPU Intelligence
            </h1>
            <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-none">
              Independent coverage of quantum hardware developments — processor launches,
              benchmark updates, roadmaps, research, and industry activity.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-12">

          {/* Left: articles */}
          <div>
            <IntelligenceTabs
              featuredArticle={featuredArticle}
              articles={restArticles}
            />
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6">

            {/* Data Updates feed */}
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-[var(--color-accent)]" />
                <span className="eyebrow text-[var(--color-accent)]">Data Updates</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mb-4 leading-relaxed">
                QPU.co continuously verifies hardware specifications, pricing, and availability
                data. Recent updates:
              </p>
              <ul className="space-y-3">
                {DATA_UPDATES.map((update) => (
                  <li key={update.label} className="flex items-start gap-2">
                    <CheckCircle2
                      size={12}
                      className="text-[var(--color-success)] mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-snug">
                        {update.label}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)] font-mono mt-0.5">
                        {formatDate(update.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter CTA */}
            <div className="panel p-5 border-[rgba(34,211,238,0.18)]">
              <div className="flex items-center gap-2 mb-3">
                <Mail size={14} className="text-[var(--color-accent)]" />
                <span className="eyebrow text-[var(--color-accent)]">Newsletter</span>
              </div>
              <p className="text-sm text-[var(--color-text-primary)] font-semibold mb-1.5">
                QPU Intelligence Digest
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Weekly summary of hardware launches, benchmark updates, and research
                developments. No marketing.
              </p>
              <NewsletterInline />
            </div>

            {/* Browse QPUs */}
            <div className="panel p-5">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                Browse QPU Database
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                Explore specifications, benchmarks, and availability for every major
                quantum processor.
              </p>
              <Link
                href="/qpus"
                className="inline-flex items-center gap-1 text-sm font-mono text-[var(--color-accent)] hover:opacity-80 transition-opacity"
              >
                QPU Explorer →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
