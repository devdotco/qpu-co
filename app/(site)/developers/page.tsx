import type { Metadata } from 'next'
import Link from 'next/link'
import { getFrameworks, getQpus } from '@/lib/data'
import type { Framework, QPU } from '@/types'
import { Badge } from '@/components/ui'
import CompatibilityMatrix from '@/components/developer/CompatibilityMatrix'
import CodePreview from '@/components/developer/CodePreview'

export const metadata: Metadata = {
  title: 'QPU Developer Resources',
  description:
    'Build quantum applications across hardware. Framework guides, API access, code examples, SDK compatibility matrix, and QPU access for developers.',
}

// ── Quick-link pill ────────────────────────────────────────────────────────────

function QuickLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] transition-colors duration-150"
    >
      {children}
    </Link>
  )
}

// ── Framework Card ─────────────────────────────────────────────────────────────

function FrameworkCard({ framework }: { framework: Framework }) {
  const desc =
    framework.description.length > 120
      ? framework.description.slice(0, 120) + '…'
      : framework.description

  return (
    <div className="panel p-5 flex flex-col gap-3 hover:border-[var(--color-border-strong)] transition-colors duration-150">
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-[var(--color-text-primary)] text-base"
          style={{ maxWidth: 'none' }}
        >
          {framework.name}
        </h3>
        <Badge variant="muted" size="sm">
          {framework.maintainer}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {framework.language.map((lang) => (
          <span
            key={lang}
            className="chip border-[var(--color-border)] text-[var(--color-text-muted)] bg-[var(--color-bg-raised)]"
          >
            {lang}
          </span>
        ))}
      </div>

      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed flex-1">
        {desc}
      </p>

      <div className="flex items-center justify-between pt-1 mt-auto">
        <span className="text-xs text-[var(--color-text-faint)] font-mono">
          {framework.supportedArchitectures.length} architecture
          {framework.supportedArchitectures.length !== 1 ? 's' : ''}
        </span>
        <Link
          href={`/frameworks/${framework.slug}`}
          className="text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity"
        >
          Explore →
        </Link>
      </div>
    </div>
  )
}

// ── Access Card ────────────────────────────────────────────────────────────────

function AccessCard({
  title,
  body,
  linkLabel,
  href,
}: {
  title: string
  body: string
  linkLabel: string
  href: string
}) {
  return (
    <div className="panel p-6 flex flex-col gap-4">
      <h3
        className="text-[var(--color-text-primary)] text-base"
        style={{ maxWidth: 'none' }}
      >
        {title}
      </h3>
      <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed flex-1">
        {body}
      </p>
      <Link
        href={href}
        className="text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity mt-auto"
      >
        {linkLabel} →
      </Link>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DevelopersPage() {
  const [frameworks, qpus]: [Framework[], QPU[]] = await Promise.all([
    getFrameworks(),
    getQpus(),
  ])

  const featuredFrameworks = frameworks.slice(0, 6)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg-raised)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="eyebrow mb-4">Developer Hub</p>
          <h1 className="text-[var(--color-text-primary)]">
            Build Across Quantum Hardware
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl text-base leading-relaxed">
            Access quantum processors from leading providers using open-source
            frameworks. QPU.co maps hardware compatibility, documents access
            options, and tracks the quantum developer ecosystem.
          </p>

          <nav
            className="flex flex-wrap gap-2 mt-8"
            aria-label="Developer hub quick links"
          >
            <QuickLink href="/frameworks">Framework Guides</QuickLink>
            <QuickLink href="#code-examples">Code Examples</QuickLink>
            <QuickLink href="/qpu-advisor">QPU Advisor</QuickLink>
            <QuickLink href="/api">API Access</QuickLink>
            <QuickLink href="#sdk-matrix">Hardware Matrix</QuickLink>
          </nav>
        </div>
      </section>

      {/* ── SDK Compatibility Matrix ───────────────────────────────────────── */}
      <CompatibilityMatrix qpus={qpus} />

      {/* ── Framework Cards ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[var(--color-bg-raised)] border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="eyebrow mb-2">Open Source</p>
            <h2
              className="text-[var(--color-text-primary)]"
              style={{ maxWidth: 'none' }}
            >
              Quantum Frameworks
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-2 max-w-2xl text-sm">
              Explore the major open-source SDKs for writing and running quantum
              circuits across different hardware backends.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredFrameworks.map((fw) => (
              <FrameworkCard key={fw.id} framework={fw} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/frameworks"
              className="text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity"
            >
              View all frameworks →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Code Examples ─────────────────────────────────────────────────── */}
      <CodePreview />

      {/* ── Access Hardware ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[var(--color-bg-raised)] border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="eyebrow mb-2">Access</p>
            <h2
              className="text-[var(--color-text-primary)]"
              style={{ maxWidth: 'none' }}
            >
              Access Hardware
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AccessCard
              title="Cloud Platforms"
              body="AWS Braket, IBM Quantum, Azure Quantum, and IonQ Cloud provide metered QPU access."
              linkLabel="Browse cloud platforms"
              href="/availability"
            />
            <AccessCard
              title="Direct Access"
              body="Research institutions can apply for direct hardware access programs through QPU providers."
              linkLabel="View providers"
              href="/providers"
            />
            <AccessCard
              title="Research Programs"
              body="NSF Quantum Leap, DOE quantum programs, and provider research partnerships offer subsidized access."
              linkLabel="QPU Advisor"
              href="/qpu-advisor"
            />
          </div>
        </div>
      </section>

      {/* ── QPU Advisor CTA ────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="panel p-8 border-[var(--color-accent)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <div className="flex flex-col gap-2">
              <p className="eyebrow">Recommendation Engine</p>
              <h2
                className="text-[var(--color-text-primary)] text-xl font-semibold"
                style={{ maxWidth: 'none' }}
              >
                Not sure which hardware to use?
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm max-w-xl">
                Describe your workload and QPU Advisor will map it to the best
                hardware, framework, and access route.
              </p>
            </div>
            <Link
              href="/qpu-advisor"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[#06080B] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Try QPU Advisor →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
