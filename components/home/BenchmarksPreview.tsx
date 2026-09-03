import Link from 'next/link'

interface MetricCardProps {
  name: string
  abbr: string
  description: string
  detail: string
  sparkValues: number[]
  color: string
}

function SparkBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values)
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '28px' }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: 0.5 + (i / values.length) * 0.5,
            borderRadius: '2px',
            minHeight: '3px',
          }}
        />
      ))}
    </div>
  )
}

function MetricCard({ name, abbr, description, detail, sparkValues, color }: MetricCardProps) {
  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: '600',
            color,
            letterSpacing: '0.04em',
          }}>
            {abbr}
          </span>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            marginTop: '2px',
          }}>
            {name}
          </div>
        </div>
        <SparkBar values={sparkValues} color={color} />
      </div>

      <p style={{
        margin: 0,
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.5',
      }}>
        {description}
      </p>

      <div style={{
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)',
        lineHeight: '1.5',
        paddingTop: '4px',
        borderTop: '1px solid var(--color-border-subtle)',
      }}>
        {detail}
      </div>
    </div>
  )
}

const benchmarkMetrics = [
  {
    name: 'Quantum Volume',
    abbr: 'QV',
    description: 'A holistic measure of circuit depth, error rate, and connectivity. Higher is better. Accounts for qubit count, fidelity, and circuit transpilation simultaneously.',
    detail: 'IBM uses QV as a primary device benchmark. Current commercial systems range from QV 32 to QV 4096+.',
    sparkValues: [32, 64, 64, 128, 256, 256, 512, 4096],
    color: '#60A5FA',
  },
  {
    name: 'Circuit Layer Operations Per Second',
    abbr: 'CLOPS',
    description: 'Measures QPU throughput — how many quantum circuit layers can be executed per second including classical overhead. Critical for variational algorithms.',
    detail: 'IBM introduced CLOPS in 2021. Higher CLOPS means faster iteration for VQE/QAOA experiments.',
    sparkValues: [1000, 1500, 1800, 2000, 2100, 2200, 2400, 2800],
    color: '#34D399',
  },
  {
    name: 'Gate Fidelity',
    abbr: 'F₂Q',
    description: 'Probability that a two-qubit gate operation produces the correct output state. Typically reported as average fidelity across all qubit pairs.',
    detail: 'Superconducting: 99.0–99.5%. Trapped-ion: 99.5–99.9%. Measured via randomized benchmarking.',
    sparkValues: [97, 98, 98.5, 99, 99.2, 99.5, 99.7, 99.9],
    color: '#A78BFA',
  },
  {
    name: 'Algorithmic Qubits',
    abbr: '#AQ',
    description: "IonQ's metric for effective circuit capability: the largest n such that an n-qubit Quantum Fourier Transform succeeds with >50% probability.",
    detail: 'Not directly comparable to physical qubit count. IonQ Forte: 35 AQ from 32 physical qubits.',
    sparkValues: [4, 8, 11, 16, 20, 25, 29, 35],
    color: '#F472B6',
  },
]

export default function BenchmarksPreview() {
  return (
    <section style={{
      background: 'var(--color-bg-base)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '64px',
          alignItems: 'start',
        }}
          className="benchmarks-grid"
        >
          {/* Left: intro */}
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              PERFORMANCE INTELLIGENCE
            </span>
            <h2 style={{ margin: '0 0 16px' }}>Performance Beyond Qubit Count</h2>
            <p style={{ margin: '0 0 12px', fontSize: '15px' }}>
              Physical qubit count is the most cited but least useful single metric for comparing quantum processors. Gate fidelity, circuit depth, connectivity, and throughput matter more for real workloads.
            </p>
            <p style={{ margin: '0 0 28px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
              QPU.co indexes published benchmark data across multiple metrics, normalized to source methodology where possible.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              <Link
                href="/benchmarks"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  background: 'transparent',
                  color: 'var(--color-accent)',
                  border: '1px solid rgba(34,211,238,0.3)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  width: 'fit-content',
                }}
              >
                Explore Benchmarks →
              </Link>
            </div>

            <p style={{
              fontSize: '11px',
              color: 'var(--color-text-faint)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em',
              maxWidth: 'none',
            }}>
              Note: Not all metrics are directly comparable across architectures. See methodology for details.
            </p>
          </div>

          {/* Right: metric cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
            className="metric-cards-grid"
          >
            {benchmarkMetrics.map(m => (
              <MetricCard key={m.abbr} {...m} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .benchmarks-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 580px) {
          .metric-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
