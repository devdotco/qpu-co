'use client'

import { useReducedMotion } from 'framer-motion'

const ARCH_NODES = [
  { id: 'superconducting', label: 'Superconducting', color: '#60A5FA', angle: -90 },
  { id: 'trapped-ion',     label: 'Trapped Ion',     color: '#A78BFA', angle: -30 },
  { id: 'neutral-atom',   label: 'Neutral Atom',    color: '#34D399', angle: 30  },
  { id: 'quantum-annealing', label: 'Annealing',    color: '#FB923C', angle: 90  },
  { id: 'photonic',       label: 'Photonic',         color: '#F472B6', angle: 150 },
  { id: 'topological',    label: 'Topological',      color: '#FBBF24', angle: 210 },
]

const DEG = Math.PI / 180
const CX = 260
const CY = 200
const RADIUS = 140

function polarXY(angleDeg: number, r: number) {
  return {
    x: CX + r * Math.cos(angleDeg * DEG),
    y: CY + r * Math.sin(angleDeg * DEG),
  }
}

export default function ArchitectureRadial() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg
      viewBox="0 0 520 400"
      width="520"
      height="400"
      aria-label="Radial diagram of six quantum computing architecture types"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Subtle background grid rings */}
      {[60, 100, 140].map(r => (
        <circle
          key={r}
          cx={CX} cy={CY} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      ))}

      {/* Connector lines from center to each node */}
      {ARCH_NODES.map(node => {
        const outer = polarXY(node.angle, RADIUS - 30)
        return (
          <line
            key={node.id + '-line'}
            x1={CX} y1={CY}
            x2={outer.x} y2={outer.y}
            stroke={node.color}
            strokeWidth="1"
            opacity="0.25"
          />
        )
      })}

      {/* Animated dots on connector lines */}
      {!shouldReduceMotion && ARCH_NODES.map((node, i) => {
        const outer = polarXY(node.angle, RADIUS - 30)
        const dur = 2.4 + i * 0.3
        const delay = i * 0.5
        return (
          <circle
            key={node.id + '-dot'}
            r="2.5"
            fill={node.color}
            opacity="0.7"
          >
            <animateMotion
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
              path={`M ${CX},${CY} L ${outer.x},${outer.y}`}
            />
            <animate
              attributeName="opacity"
              values="0;0.8;0.8;0"
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        )
      })}

      {/* Center hub */}
      <circle cx={CX} cy={CY} r={44} fill="rgba(16,20,26,0.95)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={38} fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="1" strokeDasharray="3 5" />
      <text x={CX} y={CY - 7} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono, monospace)" fill="var(--color-text-muted, #66717F)" letterSpacing="0.06em" textDecoration="none">QPU</text>
      <text x={CX} y={CY + 6} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono, monospace)" fill="var(--color-text-muted, #66717F)" letterSpacing="0.04em">ARCHITECTURES</text>

      {/* Outer nodes */}
      {ARCH_NODES.map(node => {
        const pos = polarXY(node.angle, RADIUS)
        const labelPos = polarXY(node.angle, RADIUS + 36)

        // Label alignment based on angle quadrant
        let anchor: 'start' | 'middle' | 'end' = 'middle'
        if (node.angle > -60 && node.angle < 60) anchor = 'start'
        if (node.angle > 120 || node.angle < -120) anchor = 'end'
        if (Math.abs(node.angle) === 90) anchor = 'middle'

        return (
          <g key={node.id}>
            {/* Node glow */}
            <circle cx={pos.x} cy={pos.y} r={18} fill={node.color} opacity="0.07" />
            {/* Node circle */}
            <circle
              cx={pos.x} cy={pos.y} r={13}
              fill="var(--color-bg-panel, #10141A)"
              stroke={node.color}
              strokeWidth="1.2"
              opacity="0.9"
            />
            {/* Node dot */}
            <circle cx={pos.x} cy={pos.y} r={4} fill={node.color} opacity="0.85" />

            {/* Label */}
            <text
              x={labelPos.x}
              y={labelPos.y + 4}
              textAnchor={anchor}
              fontSize="10.5"
              fontFamily="var(--font-mono, monospace)"
              fill={node.color}
              opacity="0.85"
              letterSpacing="0.04em"
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
