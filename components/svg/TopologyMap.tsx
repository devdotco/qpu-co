'use client'

import { useEffect, useState, useRef } from 'react'

interface Node {
  id: string
  x: number
  y: number
  label: string
  color: string
  type: 'center' | 'arch' | 'processor'
  archId?: string
}

interface Edge {
  from: string
  to: string
  color: string
}

const cx = 260
const cy = 210

const archNodes: Node[] = [
  { id: 'neutral-atom',     x: cx,       y: cy - 150, label: 'Neutral Atom',     color: '#34D399', type: 'arch' },
  { id: 'trapped-ion',      x: cx + 130, y: cy - 75,  label: 'Trapped Ion',      color: '#A78BFA', type: 'arch' },
  { id: 'photonic',         x: cx + 130, y: cy + 75,  label: 'Photonic',         color: '#F472B6', type: 'arch' },
  { id: 'annealing',        x: cx,       y: cy + 150, label: 'Annealing',        color: '#FB923C', type: 'arch' },
  { id: 'superconducting',  x: cx - 130, y: cy + 75,  label: 'Superconducting',  color: '#60A5FA', type: 'arch' },
  { id: 'topological',      x: cx - 130, y: cy - 75,  label: 'Topological',      color: '#FBBF24', type: 'arch' },
]

const processorNodes: Node[] = [
  // Neutral Atom
  { id: 'p-quera',    x: cx + 35,  y: cy - 195, label: 'QuEra',   color: '#34D399', type: 'processor', archId: 'neutral-atom' },
  { id: 'p-pasqal',   x: cx - 35,  y: cy - 195, label: 'PASQAL',  color: '#34D399', type: 'processor', archId: 'neutral-atom' },
  // Trapped Ion
  { id: 'p-ionq',     x: cx + 185, y: cy - 105, label: 'IonQ',    color: '#A78BFA', type: 'processor', archId: 'trapped-ion' },
  { id: 'p-qntm',     x: cx + 195, y: cy - 45,  label: 'Q\'num',  color: '#A78BFA', type: 'processor', archId: 'trapped-ion' },
  // Photonic
  { id: 'p-psiq',     x: cx + 185, y: cy + 105, label: 'PsiQ',    color: '#F472B6', type: 'processor', archId: 'photonic' },
  { id: 'p-xanadu',   x: cx + 195, y: cy + 55,  label: 'Xanadu',  color: '#F472B6', type: 'processor', archId: 'photonic' },
  // Annealing
  { id: 'p-dwave',    x: cx + 35,  y: cy + 195, label: 'D-Wave',  color: '#FB923C', type: 'processor', archId: 'annealing' },
  { id: 'p-dwave2',   x: cx - 35,  y: cy + 195, label: 'Adv2',    color: '#FB923C', type: 'processor', archId: 'annealing' },
  // Superconducting
  { id: 'p-ibm',      x: cx - 185, y: cy + 45,  label: 'IBM',     color: '#60A5FA', type: 'processor', archId: 'superconducting' },
  { id: 'p-rigetti',  x: cx - 195, y: cy + 105, label: 'Rigetti', color: '#60A5FA', type: 'processor', archId: 'superconducting' },
  // Topological
  { id: 'p-msft',     x: cx - 185, y: cy - 105, label: 'MSFT',    color: '#FBBF24', type: 'processor', archId: 'topological' },
]

const centerNode: Node = { id: 'center', x: cx, y: cy, label: 'QPU.co', color: '#F5F7F9', type: 'center' }

const allNodes: Node[] = [centerNode, ...archNodes, ...processorNodes]

const edges: Edge[] = [
  // center → arch
  ...archNodes.map(a => ({ from: 'center', to: a.id, color: a.color })),
  // arch → processors
  ...processorNodes.map(p => ({ from: p.archId!, to: p.id, color: p.color })),
]

function getNode(id: string): Node | undefined {
  return allNodes.find(n => n.id === id)
}

interface PulseState {
  edgeIndex: number
  progress: number  // 0..1
  active: boolean
}

const LABELS = [
  { x: 40,  y: 50,  text: 'LATENCY' },
  { x: 430, y: 70,  text: 'FIDELITY' },
  { x: 455, y: 350, text: 'CONNECTIVITY' },
  { x: 20,  y: 350, text: 'QUBITS' },
  { x: 195, y: 390, text: 'ACCESS' },
]

const CROSSHAIRS = [
  { x: 60,  y: 90 },
  { x: 450, y: 310 },
]

export default function TopologyMap() {
  const [pulses, setPulses] = useState<PulseState[]>([])
  const [reduced, setReduced] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const nextPulseRef = useRef<number>(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reduced) return

    const PULSE_DURATION = 1600 // ms
    const PULSE_INTERVAL = 900  // ms between new pulses

    const animate = (time: number) => {
      const dt = lastTimeRef.current ? time - lastTimeRef.current : 0
      lastTimeRef.current = time
      nextPulseRef.current -= dt

      setPulses(prev => {
        let next = prev
          .map(p => ({ ...p, progress: p.progress + dt / PULSE_DURATION }))
          .filter(p => p.progress < 1)

        if (nextPulseRef.current <= 0) {
          nextPulseRef.current = PULSE_INTERVAL
          // pick a random edge
          const edgeIndex = Math.floor(Math.random() * edges.length)
          next = [...next, { edgeIndex, progress: 0, active: true }]
        }

        return next
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced])

  return (
    <svg
      viewBox="0 0 520 420"
      width="520"
      height="420"
      aria-label="Quantum processor topology map showing QPU.co at center connected to six architecture types and their processors"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Grid dots */}
      <defs>
        <pattern id="topo-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.06)" />
        </pattern>
      </defs>
      <rect width="520" height="420" fill="url(#topo-grid)" />

      {/* Faint labels */}
      {LABELS.map(l => (
        <text
          key={l.text}
          x={l.x}
          y={l.y}
          fontSize="8"
          fontFamily="monospace"
          fill="rgba(102,113,127,0.5)"
          letterSpacing="0.12em"
        >
          {l.text}
        </text>
      ))}

      {/* Crosshairs */}
      {CROSSHAIRS.map((c, i) => (
        <g key={i} opacity="0.3">
          <line x1={c.x - 6} y1={c.y} x2={c.x + 6} y2={c.y} stroke="#66717F" strokeWidth="0.8" />
          <line x1={c.x} y1={c.y - 6} x2={c.x} y2={c.y + 6} stroke="#66717F" strokeWidth="0.8" />
          <circle cx={c.x} cy={c.y} r="2" fill="none" stroke="#66717F" strokeWidth="0.6" />
        </g>
      ))}

      {/* Edges - center to arch */}
      {edges.map((e, i) => {
        const from = getNode(e.from)
        const to   = getNode(e.to)
        if (!from || !to) return null
        const isCenterEdge = e.from === 'center'
        return (
          <line
            key={i}
            x1={from.x} y1={from.y}
            x2={to.x}   y2={to.y}
            stroke={e.color}
            strokeWidth={isCenterEdge ? 0.8 : 0.5}
            strokeOpacity={isCenterEdge ? 0.35 : 0.25}
            strokeDasharray={isCenterEdge ? '4 3' : '2 3'}
          />
        )
      })}

      {/* Animated pulses */}
      {!reduced && pulses.map((pulse, i) => {
        const edge = edges[pulse.edgeIndex]
        const from = getNode(edge.from)
        const to   = getNode(edge.to)
        if (!from || !to) return null
        const t = pulse.progress
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        const px = from.x + (to.x - from.x) * eased
        const py = from.y + (to.y - from.y) * eased
        const opacity = t < 0.1 ? t * 10 : t > 0.85 ? (1 - t) / 0.15 : 1
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={3}
            fill={edge.color}
            opacity={opacity * 0.9}
          />
        )
      })}

      {/* Processor nodes */}
      {processorNodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={5} fill={n.color} opacity={0.15} />
          <circle cx={n.x} cy={n.y} r={3.5} fill={n.color} opacity={0.7} />
          <text
            x={n.x}
            y={n.y + 14}
            fontSize="7"
            fontFamily="monospace"
            textAnchor="middle"
            fill={n.color}
            opacity={0.75}
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* Architecture nodes */}
      {archNodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={22} fill={n.color} opacity={0.08} />
          <circle cx={n.x} cy={n.y} r={16} fill="rgba(16,20,26,0.9)" stroke={n.color} strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx={n.x} cy={n.y} r={4}  fill={n.color} opacity={0.8} />
          <text
            x={n.x}
            y={n.y + 28}
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
            fill={n.color}
            opacity={0.9}
            letterSpacing="0.04em"
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* Center node */}
      <g>
        <rect
          x={cx - 36} y={cy - 16}
          width={72} height={32}
          rx={6}
          fill="rgba(16,20,26,0.95)"
          stroke="rgba(245,247,249,0.25)"
          strokeWidth="1"
        />
        <text
          x={cx} y={cy + 5}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="600"
          textAnchor="middle"
          fill="#F5F7F9"
          letterSpacing="0.06em"
        >
          QPU.co
        </text>
      </g>
    </svg>
  )
}
