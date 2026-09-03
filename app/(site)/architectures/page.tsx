import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { getArchitectures, getQpus } from '@/lib/data'
import ArchitectureRadial from '@/components/svg/ArchitectureRadial'
import type { Architecture, ArchitectureType } from '@/types'

export const metadata: Metadata = {
  title: 'Quantum Computing Architectures | QPU.co',
  description:
    'Six distinct approaches to building quantum processors. Compare superconducting, trapped-ion, neutral-atom, photonic, annealing, and topological QPU architectures.',
}

// ── Architecture color + metadata ─────────────────────────────────────────────

const ARCH_COLOR: Record<string, string> = {
  'superconducting':   '#60A5FA',
  'trapped-ion':       '#A78BFA',
  'neutral-atom':      '#34D399',
  'photonic':          '#F472B6',
  'quantum-annealing': '#FB923C',
  'topological':       '#FBBF24',
}

const ARCH_MEDIUM: Record<string, string> = {
  'superconducting':   'Superconducting circuits',
  'trapped-ion':       'Atomic ions in EM traps',
  'neutral-atom':      'Neutral atoms in optical tweezers',
  'photonic':          'Photons in optical waveguides',
  'quantum-annealing': 'Superconducting flux qubits',
  'topological':       'Majorana zero modes (research)',
}

const ARCH_CONTROL: Record<string, string> = {
  'superconducting':   'Microwave pulses',
  'trapped-ion':       'Laser / microwave',
  'neutral-atom':      'Laser (Rydberg excitation)',
  'photonic':          'Beam splitters & phase shifters',
  'quantum-annealing': 'Magnetic flux annealing',
  'topological':       'Anyon braiding',
}

const ARCH_ADVANTAGE: Record<string, string> = {
  'superconducting':   'Fast nanosecond gates and a mature semiconductor-compatible manufacturing ecosystem.',
  'trapped-ion':       'Native all-to-all connectivity and the highest published two-qubit gate fidelities.',
  'neutral-atom':      'Reconfigurable qubit connectivity and large array sizes without a dilution refrigerator.',
  'photonic':          'Room-temperature operation and natural compatibility with optical fiber networks.',
  'quantum-annealing': 'Largest commercial qubit count and proven enterprise optimization applications.',
  'topological':       'Theoretical intrinsic fault tolerance from topologically protected qubit encoding.',
}

const ARCH_LIMITATION: Record<string, string> = {
  'superconducting':   'Short coherence times and fixed nearest-neighbor connectivity require SWAP overhead.',
  'trapped-ion':       'Gate speeds 100–1000× slower than superconducting, limiting circuit throughput.',
  'neutral-atom':      'Stochastic atom loss requires active reloading; Rydberg gate fidelity lags trapped-ion.',
  'photonic':          'Two-qubit gates are inherently probabilistic in linear optics, requiring large resource overhead.',
  'quantum-annealing': 'Non-universal — restricted to QUBO/Ising optimization; no proven quantum speedup demonstrated.',
  'topological':       'No gate-based topological quantum computer demonstrated; the approach remains in research.',
}

// ── Inline SVG visualizations (reused from ArchitectureExplorer) ──────────────

function SVGSuperconducting({ color }: { color: string }) {
  const qubits: [number, number][] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) qubits.push([12 + c * 20, 10 + r * 18])
  const connections: [number, number, number, number][] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const i = r * 5 + c
    if (c < 4) connections.push([qubits[i][0], qubits[i][1], qubits[i+1][0], qubits[i+1][1]])
    if (r < 3 && (r + c) % 2 === 0) connections.push([qubits[i][0], qubits[i][1], qubits[i+5][0], qubits[i+5][1]])
  }
  const highlighted = [2, 7, 12, 8, 9]
  return (
    <svg viewBox="0 0 108 82" width="108" height="82">
      {connections.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.8" opacity="0.25" />)}
      {qubits.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={highlighted.includes(i) ? 5 : 4} fill={highlighted.includes(i) ? color : 'rgba(16,20,26,0.9)'} stroke={color} strokeWidth="1" opacity={highlighted.includes(i) ? 0.9 : 0.5} />)}
    </svg>
  )
}

function SVGTrappedIon({ color }: { color: string }) {
  const ions = [14, 26, 38, 50, 62, 74, 86, 98]
  return (
    <svg viewBox="0 0 112 82" width="112" height="82">
      <rect x="8" y="38" width="96" height="2" rx="1" fill={color} opacity="0.15" />
      <path d={`M 14,38 Q 56,14 98,38`} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      {ions.map((x, i) => <circle key={i} cx={x} cy={39} r={3.5} fill={color} opacity={0.8} />)}
      <text x="8" y="62" fontSize="7" fontFamily="monospace" fill={color} opacity="0.5">← ION CHAIN →</text>
    </svg>
  )
}

function SVGNeutralAtom({ color }: { color: string }) {
  const atoms: [number, number][] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) atoms.push([14 + c * 22, 10 + r * 20])
  const highlighted = [5, 6, 9, 10]
  return (
    <svg viewBox="0 0 108 90" width="108" height="90">
      {[[5,6],[5,9],[6,10],[9,10]].map(([a, b], i) => {
        const [ax, ay] = atoms[a], [bx, by] = atoms[b]
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
      })}
      {atoms.map(([x, y], i) => (
        <g key={i}>
          {highlighted.includes(i) && <circle cx={x} cy={y} r={9} fill={color} opacity="0.08" />}
          <circle cx={x} cy={y} r={4} fill={highlighted.includes(i) ? color : 'rgba(16,20,26,0.9)'} stroke={color} strokeWidth={highlighted.includes(i) ? 0 : 0.8} opacity={highlighted.includes(i) ? 0.85 : 0.4} />
        </g>
      ))}
    </svg>
  )
}

function SVGPhotonic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 112 82" width="112" height="82">
      <path d="M 8,25 Q 30,25 50,40 Q 70,55 92,55" fill="none" stroke={color} strokeWidth="1.2" opacity="0.4" />
      <path d="M 8,55 Q 30,55 50,40 Q 70,25 92,25" fill="none" stroke={color} strokeWidth="1.2" opacity="0.4" />
      <line x1="44" y1="34" x2="56" y2="46" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="44" y1="46" x2="56" y2="34" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx={22} cy={30} r={3} fill={color} opacity={0.8} />
      <circle cx={72} cy={50} r={3} fill={color} opacity={0.8} />
      <rect x="14" y="18" width="8" height="14" rx="2" fill={color} opacity="0.15" stroke={color} strokeWidth="0.7" />
      <rect x="88" y="48" width="8" height="14" rx="2" fill={color} opacity="0.15" stroke={color} strokeWidth="0.7" />
    </svg>
  )
}

function SVGAnnealing({ color }: { color: string }) {
  const nodes: [number, number][] = [[30,15],[82,15],[56,40],[15,58],[97,58],[56,72]]
  const edges: [number, number][] = [[0,1],[0,2],[1,2],[0,3],[1,4],[2,3],[2,4],[3,5],[4,5],[2,5]]
  const highlighted = [2, 5]
  return (
    <svg viewBox="0 0 112 88" width="112" height="88">
      {edges.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={color} strokeWidth="0.8" opacity={highlighted.includes(a) || highlighted.includes(b) ? 0.4 : 0.2} />)}
      {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={highlighted.includes(i) ? 7 : 5} fill={highlighted.includes(i) ? color : 'rgba(16,20,26,0.9)'} stroke={color} strokeWidth="1" opacity={highlighted.includes(i) ? 0.85 : 0.5} />)}
      <text x="4" y="84" fontSize="7" fontFamily="monospace" fill={color} opacity="0.45">QUBO GRAPH</text>
    </svg>
  )
}

function SVGTopological({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 112 82" width="112" height="82">
      <path d="M 20,10 C 20,30 85,22 85,42 C 85,62 20,54 20,74" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <path d="M 92,10 C 92,30 27,22 27,42 C 27,62 92,54 92,74" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="56" cy="42" r="6" fill={color} opacity="0.12" />
      <circle cx="56" cy="42" r="3.5" fill={color} opacity={0.7} />
      <circle cx="20" cy="10" r="3.5" fill={color} opacity="0.6" />
      <circle cx="92" cy="10" r="3.5" fill={color} opacity="0.6" />
      <circle cx="20" cy="74" r="3.5" fill={color} opacity="0.6" />
      <circle cx="92" cy="74" r="3.5" fill={color} opacity="0.6" />
      <text x="4" y="82" fontSize="7" fontFamily="monospace" fill={color} opacity="0.45">ANYON BRAID</text>
    </svg>
  )
}

const ARCH_SVG: Record<string, React.ComponentType<{ color: string }>> = {
  'superconducting':   SVGSuperconducting,
  'trapped-ion':       SVGTrappedIon,
  'neutral-atom':      SVGNeutralAtom,
  'photonic':          SVGPhotonic,
  'quantum-annealing': SVGAnnealing,
  'topological':       SVGTopological,
}

// ── Architecture Card ─────────────────────────────────────────────────────────

function ArchCard({ arch, qpuCount }: { arch: Architecture; qpuCount: number }) {
  const color = ARCH_COLOR[arch.slug] ?? '#9AA4B2'
  const SVGComponent = ARCH_SVG[arch.slug]

  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-border)',
      borderTop: `3px solid ${color}`,
      borderRadius: '10px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* SVG visual */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '96px',
        padding: '12px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}>
        {SVGComponent ? <SVGComponent color={color} /> : <div style={{ width: 80, height: 60, background: `${color}15`, borderRadius: 6 }} />}
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {/* Name + qubit count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color }}>{arch.name}</h3>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            background: `${color}15`,
            color,
            padding: '2px 8px',
            borderRadius: '99px',
            whiteSpace: 'nowrap',
          }}>
            {qpuCount} QPU{qpuCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Meta rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { label: 'Medium',  value: ARCH_MEDIUM[arch.slug]  ?? arch.qubitMedium.slice(0, 40) },
            { label: 'Control', value: ARCH_CONTROL[arch.slug] ?? arch.controlMechanism.slice(0, 40) },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, paddingTop: '2px', width: '50px' }}>{row.label}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Advantage / Limitation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            padding: '10px 12px',
            background: 'rgba(74,222,128,0.05)',
            border: '1px solid rgba(74,222,128,0.12)',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: 1.55,
            color: 'var(--color-text-secondary)',
          }}>
            <span style={{ color: '#4ADE80', fontWeight: 600, marginRight: '5px' }}>+</span>
            {ARCH_ADVANTAGE[arch.slug]}
          </div>
          <div style={{
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: 1.55,
            color: 'var(--color-text-muted)',
          }}>
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 600, marginRight: '5px' }}>—</span>
            {ARCH_LIMITATION[arch.slug]}
          </div>
        </div>

        {/* Explore link */}
        <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
          <Link
            href={`/architectures/${arch.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12.5px',
              color,
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Comparison Table ──────────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  {
    label: 'Qubit Medium',
    values: {
      'superconducting':   'Josephson junctions (transmon)',
      'trapped-ion':       'Atomic ions (Yb-171, Ba-137)',
      'neutral-atom':      'Neutral atoms (Rb-87, Cs-133)',
      'photonic':          'Photons in waveguides',
      'quantum-annealing': 'Flux qubits',
      'topological':       'Majorana modes (research)',
    },
  },
  {
    label: 'Control',
    values: {
      'superconducting':   'Microwave pulses',
      'trapped-ion':       'Laser / microwave',
      'neutral-atom':      'Lasers (Rydberg)',
      'photonic':          'Beam splitters, phase shifters',
      'quantum-annealing': 'Magnetic flux annealing',
      'topological':       'Anyon braiding',
    },
  },
  {
    label: 'Operating Temp.',
    values: {
      'superconducting':   '~15 mK',
      'trapped-ion':       'UHV, room temp trap',
      'neutral-atom':      '~1–10 µK atoms',
      'photonic':          'Room temp (SNSPD ~1 K)',
      'quantum-annealing': '~15 mK',
      'topological':       '~100 mK',
    },
  },
  {
    label: 'Gate Speed',
    values: {
      'superconducting':   '10–500 ns',
      'trapped-ion':       '1 µs – 1 ms',
      'neutral-atom':      '100 ns – 10 µs',
      'photonic':          'ns (optical path)',
      'quantum-annealing': '1–2000 µs (anneal)',
      'topological':       'Not yet characterized',
    },
  },
  {
    label: 'Connectivity',
    values: {
      'superconducting':   'Fixed nearest-neighbor',
      'trapped-ion':       'All-to-all (within chain)',
      'neutral-atom':      'Reconfigurable',
      'photonic':          'Reconfigurable',
      'quantum-annealing': 'Sparse fixed (Pegasus/Zephyr)',
      'topological':       'TBD',
    },
  },
  {
    label: 'Current Scale',
    values: {
      'superconducting':   '100–1000 physical qubits',
      'trapped-ion':       '20–56 #AQ',
      'neutral-atom':      '100–1000+ atoms',
      'photonic':          'GBS only (no gate-based)',
      'quantum-annealing': '5000–7000+ qubits',
      'topological':       'Research phase',
    },
  },
  {
    label: 'Coherence',
    values: {
      'superconducting':   'T1/T2: 50–500 µs',
      'trapped-ion':       'Seconds to minutes',
      'neutral-atom':      'Seconds (hyperfine)',
      'photonic':          'Photons don\'t thermalize',
      'quantum-annealing':'ms (anneal window)',
      'topological':       'Theoretically protected',
    },
  },
  {
    label: 'Scaling Approach',
    values: {
      'superconducting':   'Larger chips, modular links',
      'trapped-ion':       'Photonic inter-chain links',
      'neutral-atom':      'Larger tweezer arrays',
      'photonic':          'Silicon photonics fabs',
      'quantum-annealing': 'Denser coupler graphs',
      'topological':       'Topological networks',
    },
  },
  {
    label: 'Leading Companies',
    values: {
      'superconducting':   'IBM, Google, Rigetti, IQM',
      'trapped-ion':       'IonQ, Quantinuum',
      'neutral-atom':      'QuEra, PASQAL, Atom Computing',
      'photonic':          'PsiQuantum, Xanadu',
      'quantum-annealing': 'D-Wave',
      'topological':       'Microsoft',
    },
  },
  {
    label: 'Commercial Status',
    values: {
      'superconducting':   'Cloud available',
      'trapped-ion':       'Cloud available',
      'neutral-atom':      'Cloud available (limited)',
      'photonic':          'Boson sampling only',
      'quantum-annealing': 'Cloud available',
      'topological':       'Research only',
    },
  },
]

const ARCH_ORDER: ArchitectureType[] = [
  'superconducting',
  'trapped-ion',
  'neutral-atom',
  'photonic',
  'quantum-annealing',
  'topological',
]

const ARCH_HEADER_LABELS: Record<string, string> = {
  'superconducting':   'Superconducting',
  'trapped-ion':       'Trapped Ion',
  'neutral-atom':      'Neutral Atom',
  'photonic':          'Photonic',
  'quantum-annealing': 'Annealing',
  'topological':       'Topological',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ArchitecturesPage() {
  const [architectures, qpus] = await Promise.all([getArchitectures(), getQpus()])

  const qpuCountByArch = (slug: string) =>
    qpus.filter(q => q.architecture === slug).length

  return (
    <div>
      {/* Hero */}
      <section style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-raised)',
        padding: '64px 0 72px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>
            HARDWARE MODALITIES
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '48px',
            alignItems: 'center',
          }}
            className="hero-grid"
          >
            <div>
              <h1 style={{ margin: '0 0 16px' }}>
                Six Paths Toward Useful Quantum Computing
              </h1>
              <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.75, maxWidth: '60ch', color: 'var(--color-text-secondary)' }}>
                Quantum hardware is not a single technology. Each architecture encodes qubits in
                different physical systems — each with distinct advantages, limitations, and workload
                characteristics. No single approach has yet demonstrated clear supremacy for all tasks.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <ArchitectureRadial />
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-grid > div:last-child { display: none; } }
        `}</style>
      </section>

      {/* Architecture Cards Grid */}
      <section style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ marginBottom: '8px' }}>The Six Architectures</h2>
          <p style={{ marginBottom: '40px', maxWidth: '60ch' }}>
            Compare the six major quantum computing hardware approaches. Each card shows the physical
            mechanism, key advantage, and primary limitation.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '18px',
          }}
            className="arch-cards-grid"
          >
            {architectures.map(arch => (
              <ArchCard key={arch.id} arch={arch} qpuCount={qpuCountByArch(arch.slug)} />
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 960px) { .arch-cards-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 560px) { .arch-cards-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* Comparison Table */}
      <section style={{
        background: 'var(--color-bg-raised)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '64px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ marginBottom: '8px' }}>Architecture Comparison</h2>
          <p style={{ marginBottom: '8px', maxWidth: '68ch' }}>
            Direct comparison requires care — different architectures are optimized for different tasks.
            See individual architecture pages for detail.
          </p>
          <p style={{ margin: '0 0 32px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Data sourced from manufacturer documentation and published research as of 2026.
          </p>

          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <table className="data-table" style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', background: 'var(--color-bg-panel)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingLeft: '20px', minWidth: '140px' }}></th>
                  {ARCH_ORDER.map(slug => (
                    <th key={slug} style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                      <Link
                        href={`/architectures/${slug}`}
                        style={{
                          color: ARCH_COLOR[slug],
                          textDecoration: 'none',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {ARCH_HEADER_LABELS[slug]}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, ri) => (
                  <tr key={ri}>
                    <td style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      paddingLeft: '20px',
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                    }}>
                      {row.label}
                    </td>
                    {ARCH_ORDER.map(slug => (
                      <td key={slug} style={{ fontSize: '13px', color: 'var(--color-text-secondary)', maxWidth: '180px' }}>
                        {row.values[slug as keyof typeof row.values]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Workload Suitability Teaser */}
      <section style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <span className="eyebrow">WORKLOAD GUIDE</span>
            <h2 style={{ margin: 0 }}>Architecture Choice Matters for Your Workload</h2>
            <p style={{ margin: 0, maxWidth: '60ch', lineHeight: 1.75 }}>
              Architecture selection significantly affects which algorithms you can run and at what
              fidelity. Trapped-ion systems excel at high-fidelity deep circuits; superconducting systems
              offer throughput; neutral-atom systems enable large-scale analog simulation. Our workload
              compatibility guide maps 12 use cases across all six architectures.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/use-cases"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg-base)',
                  borderRadius: '7px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                See workload compatibility guide →
              </Link>
              <Link
                href="/qpus"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--color-border-strong)',
                  color: 'var(--color-text-primary)',
                  borderRadius: '7px',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Browse all QPUs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
