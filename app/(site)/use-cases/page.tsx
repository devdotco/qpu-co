import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FlaskConical,
  Atom,
  BarChart3,
  TrendingUp,
  Brain,
  Pill,
  Truck,
  Lock,
} from 'lucide-react'
import { getUseCases } from '@/lib/data'
import type { UseCase, UseCaseStatus, ArchitectureType } from '@/types'
import { architectureColor } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { BadgeProps } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Quantum Computing Use Cases',
  description:
    'Honest assessment of quantum computing applications by workload type. Where quantum may help, what stage each application is at, and which hardware architectures apply.',
}

// ── Icon map by slug ──────────────────────────────────────────────────────────

type IconComponent = React.ElementType<{ size?: number; className?: string }>

const ICON_MAP: Record<string, IconComponent> = {
  chemistry: FlaskConical,
  'materials-science': Atom,
  optimization: BarChart3,
  finance: TrendingUp,
  'machine-learning': Brain,
  'drug-discovery': Pill,
  logistics: Truck,
  cryptography: Lock,
}

// ── Status badge config ───────────────────────────────────────────────────────

interface StatusConfig {
  label: string
  variant: NonNullable<BadgeProps['variant']>
  emoji: string
}

const STATUS_CONFIG: Record<UseCaseStatus, StatusConfig> = {
  theoretical: { label: 'Theoretical', variant: 'muted', emoji: '🔬' },
  research: { label: 'Research', variant: 'warning', emoji: '🔬' },
  experimental: { label: 'Experimental', variant: 'accent', emoji: '⚗️' },
  demonstrated: { label: 'Demonstrated', variant: 'success', emoji: '🔵' },
  commercial: { label: 'Early Commercial', variant: 'success', emoji: '✅' },
}

// ── Architecture dot opacity by suitability ───────────────────────────────────

const SUITABILITY_OPACITY: Record<string, number> = {
  strong: 1,
  possible: 0.55,
  experimental: 0.25,
  limited: 0.12,
  unknown: 0.07,
}

const ALL_ARCHITECTURES: ArchitectureType[] = [
  'superconducting',
  'trapped-ion',
  'neutral-atom',
  'photonic',
  'quantum-annealing',
  'topological',
]

// ── Architecture label abbreviations (for tooltip) ────────────────────────────

const ARCH_ABBR: Record<ArchitectureType, string> = {
  superconducting: 'Superconducting',
  'trapped-ion': 'Trapped Ion',
  'neutral-atom': 'Neutral Atom',
  photonic: 'Photonic',
  'quantum-annealing': 'Quantum Annealing',
  topological: 'Topological',
}

// ── Use Case Card ─────────────────────────────────────────────────────────────

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const Icon = ICON_MAP[useCase.slug] ?? FlaskConical
  const statusCfg = STATUS_CONFIG[useCase.status]

  return (
    <Link
      href={`/use-cases/${useCase.slug}`}
      className="group block"
      aria-label={`Explore ${useCase.name}`}
    >
      <div className="h-full flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] p-4 transition-all duration-150 group-hover:border-[var(--color-border-strong)] group-hover:bg-[var(--color-bg-overlay)]">
        {/* Icon row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="flex items-center justify-center rounded-[var(--radius-md)] p-2"
            style={{
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.15)',
            }}
          >
            <Icon size={16} className="text-[var(--color-accent)]" />
          </div>
          <Badge variant={statusCfg.variant} size="sm">
            {statusCfg.emoji} {statusCfg.label}
          </Badge>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug mb-1">
          {useCase.name}
        </h3>

        {/* Description (truncated) */}
        <p
          className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {useCase.description}
        </p>

        {/* Architecture suitability dots */}
        <div className="mt-auto">
          <p className="mono-label mb-1.5">Architecture fit</p>
          <div className="flex items-center gap-1.5">
            {ALL_ARCHITECTURES.map((arch) => {
              const suit = useCase.architectureSuitability[arch]
              const opacity = SUITABILITY_OPACITY[suit] ?? 0.07
              return (
                <span
                  key={arch}
                  title={`${ARCH_ABBR[arch]}: ${suit}`}
                  className={`inline-block w-2 h-2 rounded-full shrink-0 ${architectureColor(arch)}`}
                  style={{ opacity }}
                  aria-label={`${ARCH_ABBR[arch]}: ${suit}`}
                />
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-3 flex items-center justify-end">
          <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function UseCasesPage() {
  const useCases = await getUseCases()

  return (
    <div style={{ background: 'var(--color-bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* ── Hero ── */}
        <section style={{ padding: '48px 0 32px' }}>
          <p
            className="mono-label"
            style={{ marginBottom: 12, color: 'var(--color-accent)' }}
          >
            QPU.co / Use Cases
          </p>
          <h1
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
            }}
          >
            Quantum Computing by Workload
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              maxWidth: '64ch',
            }}
          >
            An honest, evidence-based assessment of where quantum computing may
            provide advantages — and where the field is still theoretical,
            research-stage, or years away from commercial viability.
          </p>
        </section>

        {/* ── Honesty Banner ── */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(245,158,11,0.06)',
            border: '1.5px solid rgba(245,158,11,0.25)',
            marginBottom: 32,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: 'var(--color-warning)',
                marginRight: 6,
              }}
            >
              Epistemic honesty notice:
            </span>
            Many quantum use cases are still experimental or research-stage.
            QPU.co distinguishes between{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              theoretical applications
            </span>
            ,{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              research demonstrations
            </span>
            , and{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              commercially viable workloads
            </span>
            . No current quantum system has demonstrated clear, reproducible
            advantage over state-of-the-art classical methods at commercially
            relevant problem scales.
          </p>
        </div>

        {/* ── Status Legend ── */}
        <div style={{ marginBottom: 32 }}>
          <p className="mono-label" style={{ marginBottom: 12 }}>
            Status guide
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(STATUS_CONFIG) as [UseCaseStatus, StatusConfig][]).map(
              ([status, cfg]) => (
                <Badge key={status} variant={cfg.variant} size="md">
                  {cfg.emoji} {cfg.label}
                </Badge>
              ),
            )}
          </div>
        </div>

        {/* ── Use Case Grid ── */}
        <section style={{ paddingBottom: 80 }}>
          <div
            className="grid grid-cols-2 gap-4 xl:grid-cols-4"
          >
            {useCases.map((uc) => (
              <UseCaseCard key={uc.id} useCase={uc} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
