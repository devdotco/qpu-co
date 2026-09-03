import type { QPU, Provider } from '@/types'

interface MarketMetricsProps {
  qpus: QPU[]
  providers: Provider[]
}

interface MetricCardProps {
  label: string
  value: string | number
  description: string
  accentColor: string
}

function MetricCard({ label, value, description, accentColor }: MetricCardProps) {
  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '20px 22px',
      display: 'flex',
      gap: '0',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
      minWidth: '160px',
    }}>
      {/* Accent bar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: accentColor,
        borderRadius: '10px 0 0 10px',
        opacity: 0.7,
      }} />

      <div style={{ paddingLeft: '6px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: '8px',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '2rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          lineHeight: '1',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: '6px',
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          lineHeight: '1.4',
        }}>
          {description}
        </div>
      </div>
    </div>
  )
}

const ACCENT_COLORS = [
  'var(--color-accent)',
  'var(--color-arch-trapped-ion)',
  'var(--color-arch-neutral-atom)',
  'var(--color-arch-photonic)',
  'var(--color-arch-annealing)',
]

export default function MarketMetrics({ qpus, providers }: MarketMetricsProps) {
  const metrics = [
    {
      label: 'QPUs Tracked',
      value: qpus.length,
      description: 'Physical quantum processors in database',
    },
    {
      label: 'Providers',
      value: providers.length,
      description: 'Hardware manufacturers & cloud operators',
    },
    {
      label: 'Architectures',
      value: 6,
      description: 'Distinct qubit modalities covered',
    },
    {
      label: 'Cloud Platforms',
      value: 4,
      description: 'Access platforms with QPU availability',
    },
    {
      label: 'Benchmarks',
      value: 47,
      description: 'Published performance measurements indexed',
    },
  ]

  return (
    <section style={{
      background: 'var(--color-bg-raised)',
      borderBottom: '1px solid var(--color-border)',
      padding: '48px 0',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {metrics.map((m, i) => (
            <MetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              description={m.description}
              accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
            />
          ))}
        </div>

        <p style={{
          marginTop: '16px',
          fontSize: '11px',
          color: 'var(--color-text-faint)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em',
          maxWidth: 'none',
        }}>
          Sample data — specifications updated as verified. See methodology for sourcing details.
        </p>
      </div>
    </section>
  )
}
