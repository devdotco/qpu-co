'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Architecture } from '@/types'

interface ArchitectureExplorerProps {
  architectures: Architecture[]
}

const ARCH_COLORS: Record<string, string> = {
  'superconducting':   '#60A5FA',
  'trapped-ion':       '#A78BFA',
  'neutral-atom':      '#34D399',
  'photonic':          '#F472B6',
  'quantum-annealing': '#FB923C',
  'topological':       '#FBBF24',
}

const ARCH_BULLETS: Record<string, string[]> = {
  'superconducting': [
    'Fast nanosecond gate operations',
    'Mature fabrication ecosystem',
    'Fixed nearest-neighbor connectivity',
  ],
  'trapped-ion': [
    'Highest gate fidelities (~99.9%)',
    'Native all-to-all connectivity',
    'Coherence times measured in seconds',
  ],
  'neutral-atom': [
    'Reconfigurable qubit connectivity',
    'Large arrays (100–1000+ atoms)',
    'Natural analog simulation capability',
  ],
  'photonic': [
    'Room-temperature operation feasible',
    'Fiber-compatible — quantum networking',
    'No decoherence from thermal noise',
  ],
  'quantum-annealing': [
    'Largest qubit counts commercially (5000+)',
    'Native optimization via Ising model',
    'Hybrid classical-quantum solvers',
  ],
  'topological': [
    'Theoretically intrinsic fault tolerance',
    'Non-local qubit encoding',
    'Research stage — not yet commercial',
  ],
}

// ── Inline SVG visualizations ─────────────────────────────────────────────────

function SVGSuperconducting({ color, animate }: { color: string; animate: boolean }) {
  const qubits: [number, number][] = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      qubits.push([12 + c * 20, 10 + r * 18])
    }
  }
  // Heavy-hex style connections
  const connections: [number, number, number, number][] = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const i = r * 5 + c
      if (c < 4) connections.push([qubits[i][0], qubits[i][1], qubits[i + 1][0], qubits[i + 1][1]])
      if (r < 3 && (r + c) % 2 === 0) connections.push([qubits[i][0], qubits[i][1], qubits[i + 5][0], qubits[i + 5][1]])
    }
  }
  const highlighted = [2, 7, 12, 8, 9]
  return (
    <svg viewBox="0 0 108 82" width="108" height="82">
      {connections.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.8" opacity="0.25" />
      ))}
      {qubits.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y} r={highlighted.includes(i) ? 5 : 4}
          fill={highlighted.includes(i) ? color : 'rgba(16,20,26,0.9)'}
          stroke={color}
          strokeWidth="1"
          opacity={highlighted.includes(i) ? 0.9 : 0.5}
          style={animate && highlighted.includes(i) ? {
            animation: `pulse-glow 2s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          } : undefined}
        />
      ))}
    </svg>
  )
}

function SVGTrappedIon({ color, animate }: { color: string; animate: boolean }) {
  const ions = [14, 26, 38, 50, 62, 74, 86, 98]
  return (
    <svg viewBox="0 0 112 82" width="112" height="82">
      {/* Trap bar */}
      <rect x="8" y="38" width="96" height="2" rx="1" fill={color} opacity="0.15" />
      {/* Laser arc above */}
      <path
        d={`M 14,38 Q 56,14 98,38`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.4"
      />
      {/* Ions */}
      {ions.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={39} r={5} fill={color} opacity={0.15} />
          <circle
            cx={x} cy={39} r={3.5}
            fill={color}
            opacity={0.8}
            style={animate ? {
              animation: `pulse-glow 2.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            } : undefined}
          />
        </g>
      ))}
      {/* Laser beam dots on arc */}
      {[0.25, 0.5, 0.75].map((t, i) => {
        const x = 14 + (98 - 14) * t
        const arcY = 38 - 24 * Math.sin(Math.PI * t)
        return (
          <circle key={i} cx={x} cy={arcY} r={1.5} fill={color} opacity={0.5} />
        )
      })}
      {/* Labels */}
      <text x="8" y="62" fontSize="7" fontFamily="monospace" fill={color} opacity="0.5">← ION CHAIN →</text>
    </svg>
  )
}

function SVGNeutralAtom({ color, animate }: { color: string; animate: boolean }) {
  const atoms: [number, number][] = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      atoms.push([14 + c * 22, 10 + r * 20])
    }
  }
  const highlighted = [5, 6, 9, 10]
  return (
    <svg viewBox="0 0 108 90" width="108" height="90">
      {/* Rydberg arcs between highlighted */}
      {[[5, 6], [5, 9], [6, 10], [9, 10]].map(([a, b], i) => {
        const [ax, ay] = atoms[a]
        const [bx, by] = atoms[b]
        return (
          <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
            stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
        )
      })}
      {atoms.map(([x, y], i) => (
        <g key={i}>
          {highlighted.includes(i) && (
            <circle cx={x} cy={y} r={9} fill={color} opacity={0.08} />
          )}
          <circle
            cx={x} cy={y} r={4}
            fill={highlighted.includes(i) ? color : 'rgba(16,20,26,0.9)'}
            stroke={color}
            strokeWidth={highlighted.includes(i) ? 0 : 0.8}
            opacity={highlighted.includes(i) ? 0.85 : 0.4}
            style={animate && highlighted.includes(i) ? {
              animation: `pulse-glow 2s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            } : undefined}
          />
        </g>
      ))}
    </svg>
  )
}

function SVGPhotonic({ color, animate }: { color: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 112 82" width="112" height="82">
      {/* Waveguides */}
      <path d="M 8,25 Q 30,25 50,40 Q 70,55 92,55" fill="none" stroke={color} strokeWidth="1.2" opacity="0.4" />
      <path d="M 8,55 Q 30,55 50,40 Q 70,25 92,25" fill="none" stroke={color} strokeWidth="1.2" opacity="0.4" />
      {/* Beam splitter at crossing */}
      <line x1="44" y1="34" x2="56" y2="46" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="44" y1="46" x2="56" y2="34" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Photon dots */}
      {[
        { cx: 22, cy: 30 },
        { cx: 72, cy: 50 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={p.cx} cy={p.cy} r={3}
          fill={color}
          opacity={0.8}
          style={animate ? {
            animation: `pulse-glow 1.8s ease-in-out infinite`,
            animationDelay: `${i * 0.9}s`,
          } : undefined}
        />
      ))}
      {/* Phase shifters */}
      <rect x="14" y="18" width="8" height="14" rx="2" fill={color} opacity="0.15" stroke={color} strokeWidth="0.7" />
      <rect x="88" y="48" width="8" height="14" rx="2" fill={color} opacity="0.15" stroke={color} strokeWidth="0.7" />
    </svg>
  )
}

function SVGAnnealing({ color, animate }: { color: string; animate: boolean }) {
  const nodes: [number, number][] = [
    [30, 15], [82, 15], [56, 40], [15, 58], [97, 58], [56, 72],
  ]
  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 2], [0, 3], [1, 4], [2, 3], [2, 4], [3, 5], [4, 5], [2, 5],
  ]
  const highlighted = [2, 5]
  return (
    <svg viewBox="0 0 112 88" width="112" height="88">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={color}
          strokeWidth="0.8"
          opacity={highlighted.includes(a) || highlighted.includes(b) ? 0.4 : 0.2}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y} r={highlighted.includes(i) ? 7 : 5}
          fill={highlighted.includes(i) ? color : 'rgba(16,20,26,0.9)'}
          stroke={color}
          strokeWidth="1"
          opacity={highlighted.includes(i) ? 0.85 : 0.5}
          style={animate && highlighted.includes(i) ? {
            animation: `pulse-glow 2s ease-in-out infinite`,
          } : undefined}
        />
      ))}
      <text x="4" y="84" fontSize="7" fontFamily="monospace" fill={color} opacity="0.45">QUBO GRAPH</text>
    </svg>
  )
}

function SVGTopological({ color, animate }: { color: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 112 82" width="112" height="82">
      {/* Worldline 1 */}
      <path
        d="M 20,10 C 20,30 85,22 85,42 C 85,62 20,54 20,74"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Worldline 2 */}
      <path
        d="M 92,10 C 92,30 27,22 27,42 C 27,62 92,54 92,74"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Crossing point (braid) */}
      <circle cx="56" cy="42" r="6" fill={color} opacity="0.12" />
      <circle
        cx="56" cy="42" r="3.5"
        fill={color}
        opacity={0.7}
        style={animate ? { animation: 'pulse-glow 2.5s ease-in-out infinite' } : undefined}
      />
      {/* Anyon labels */}
      <circle cx="20" cy="10" r="3.5" fill={color} opacity="0.6" />
      <circle cx="92" cy="10" r="3.5" fill={color} opacity="0.6" />
      <circle cx="20" cy="74" r="3.5" fill={color} opacity="0.6" />
      <circle cx="92" cy="74" r="3.5" fill={color} opacity="0.6" />
      <text x="4" y="82" fontSize="7" fontFamily="monospace" fill={color} opacity="0.45">ANYON BRAID</text>
    </svg>
  )
}

const ARCH_SVG: Record<string, React.ComponentType<{ color: string; animate: boolean }>> = {
  'superconducting':   SVGSuperconducting,
  'trapped-ion':       SVGTrappedIon,
  'neutral-atom':      SVGNeutralAtom,
  'photonic':          SVGPhotonic,
  'quantum-annealing': SVGAnnealing,
  'topological':       SVGTopological,
}

function ArchCard({ arch }: { arch: Architecture }) {
  const [hovered, setHovered] = useState(false)
  const color = ARCH_COLORS[arch.id] ?? '#9AA4B2'
  const SVGComponent = ARCH_SVG[arch.id]
  const bullets = ARCH_BULLETS[arch.id] ?? arch.advantages.slice(0, 3)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'var(--color-bg-panel)',
        border: `1px solid ${hovered ? color + '66' : 'var(--color-border)'}`,
        borderRadius: '10px',
        padding: '20px',
        cursor: 'default',
        transition: 'border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* SVG visual */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        {SVGComponent ? (
          <SVGComponent color={color} animate={hovered} />
        ) : (
          <div style={{ width: 80, height: 60, background: color, opacity: 0.1, borderRadius: 8 }} />
        )}
      </div>

      {/* Name */}
      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color }}>
        {arch.name}
      </h3>

      {/* Bullets */}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {bullets.map(b => (
          <li key={b} style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            gap: '7px',
            lineHeight: '1.45',
          }}>
            <span style={{ color, opacity: 0.7, marginTop: '2px', flexShrink: 0 }}>›</span>
            {b}
          </li>
        ))}
      </ul>

      {/* Learn more */}
      <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
        <Link
          href={`/architectures/${arch.slug}`}
          style={{
            fontSize: '12px',
            color: hovered ? color : 'var(--color-text-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontFamily: 'var(--font-mono)',
          }}
        >
          → Learn more
        </Link>
      </div>
    </motion.div>
  )
}

export default function ArchitectureExplorer({ architectures }: ArchitectureExplorerProps) {
  return (
    <section style={{
      background: 'var(--color-bg-raised)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
            HARDWARE MODALITIES
          </span>
          <h2 style={{ margin: '0 0 12px' }}>Quantum Computers Aren&apos;t All the Same.</h2>
          <p style={{ maxWidth: '60ch', margin: 0, fontSize: '15px' }}>
            QPU architecture fundamentally determines connectivity, gate operations, coherence characteristics, operating environment, and workload suitability.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
          className="arch-grid"
        >
          {architectures.map(arch => (
            <ArchCard key={arch.id} arch={arch} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .arch-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .arch-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
