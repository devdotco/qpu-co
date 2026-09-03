'use client'

import Link from 'next/link'
import type { QPU } from '@/types'
import { architectureLabel, formatQubits } from '@/lib/utils'
import type { ArchitectureType } from '@/types'

interface ComparePreviewProps {
  qpus: QPU[]
}

const ARCH_COLORS: Record<ArchitectureType, string> = {
  'superconducting':   '#60A5FA',
  'trapped-ion':       '#A78BFA',
  'neutral-atom':      '#34D399',
  'photonic':          '#F472B6',
  'quantum-annealing': '#FB923C',
  'topological':       '#FBBF24',
}

const COMPARE_DIMENSIONS = [
  'Architecture',
  'Physical Qubits',
  'Connectivity',
  'Gate Fidelity',
  'Access Platforms',
  'Pricing',
  'Framework Support',
]

interface SlotProps {
  qpu: QPU | null
  index: number
}

function CompareSlot({ qpu, index }: SlotProps) {
  if (!qpu) {
    return (
      <div style={{
        flex: 1,
        background: 'var(--color-bg-panel)',
        border: '1px dashed var(--color-border)',
        borderRadius: '10px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        color: 'var(--color-text-faint)',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '1.5px dashed var(--color-border)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          fontSize: '20px',
          color: 'var(--color-text-muted)',
        }}>
          +
        </div>
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Add Processor
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-faint)', marginTop: '4px' }}>
          Slot {index + 1}
        </span>
      </div>
    )
  }

  const archColor = ARCH_COLORS[qpu.architecture] ?? '#9AA4B2'

  const specs = [
    { label: 'Architecture', value: architectureLabel(qpu.architecture), color: archColor },
    { label: 'Physical Qubits', value: formatQubits(qpu.physicalQubits) + ' qubits', color: undefined },
    {
      label: 'Connectivity',
      value: qpu.connectivity?.allToAll ? 'All-to-all' : (qpu.connectivity?.topology ?? '—'),
      color: undefined,
    },
    {
      label: 'Gate Fidelity',
      value: qpu.fidelity?.twoQubitGate?.value
        ? `${qpu.fidelity.twoQubitGate.value}%`
        : 'Published',
      color: undefined,
    },
  ]

  return (
    <div style={{
      flex: 1,
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '20px',
      borderTop: `3px solid ${archColor}`,
    }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          {qpu.providerId.toUpperCase()}
        </div>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          marginBottom: '8px',
        }}>
          {qpu.name}
        </div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: archColor + '18',
          border: `1px solid ${archColor}33`,
          borderRadius: '9999px',
          padding: '2px 8px',
          fontSize: '11px',
          color: archColor,
        }}>
          {architectureLabel(qpu.architecture)}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {specs.map(s => (
          <div key={s.label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 0',
            borderBottom: '1px solid var(--color-border-subtle)',
            fontSize: '12px',
          }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: s.color ?? 'var(--color-text-primary)',
              fontSize: '12px',
            }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ComparePreview({ qpus }: ComparePreviewProps) {
  // Pick two real QPUs for the preview: IonQ Forte and IBM Heron
  const ionqForte = qpus.find(q => q.id === 'ionq-forte') ?? qpus[0]
  const ibmHeron  = qpus.find(q => q.id === 'ibm-heron-r2') ?? qpus[1]

  return (
    <section style={{
      background: 'var(--color-bg-base)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'start',
        }}
          className="compare-grid"
        >
          {/* Left: comparison UI */}
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              COMPARISON TOOL
            </span>
            <h2 style={{ margin: '0 0 12px' }}>Compare QPUs Side by Side</h2>
            <p style={{ margin: '0 0 32px', fontSize: '15px' }}>
              Add any two or three processors to compare architecture, qubit count, connectivity, fidelity, access options, and pricing in one view.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}
              className="compare-slots"
            >
              <CompareSlot qpu={ionqForte} index={0} />
              <CompareSlot qpu={ibmHeron} index={1} />
              <CompareSlot qpu={null} index={2} />
            </div>

            <Link
              href="/compare"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 22px',
                background: 'var(--color-accent)',
                color: '#06080B',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Open QPU Comparison →
            </Link>
          </div>

          {/* Right: dimension list */}
          <div style={{
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '28px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '20px',
            }}>
              Comparison Dimensions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {COMPARE_DIMENSIONS.map((dim, i) => (
                <div key={dim} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 0',
                  borderBottom: i < COMPARE_DIMENSIONS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    {dim}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .compare-grid { grid-template-columns: 1fr !important; }
          .compare-slots { flex-direction: column !important; }
        }
      `}</style>
    </section>
  )
}
