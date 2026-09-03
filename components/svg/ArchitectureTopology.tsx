import type { ArchitectureType } from '@/types'

const ARCH_COLORS: Record<ArchitectureType, string> = {
  superconducting: '#60A5FA',
  'trapped-ion': '#A78BFA',
  'neutral-atom': '#34D399',
  photonic: '#F472B6',
  'quantum-annealing': '#FB923C',
  topological: '#FBBF24',
}

interface TopologyProps {
  color: string
}

// ── Superconducting: 4×5 heavy-hex grid ──────────────────────────────────────

function SuperconductingTopology({ color }: TopologyProps) {
  // 4 rows, 5 cols
  const cols = [30, 110, 190, 270, 350]
  const rows = [25, 75, 125, 175]

  // Qubit positions [row][col]
  const qubits = rows.flatMap((y, r) => cols.map((x, c) => ({ x, y, r, c })))

  // Heavy-hex connections:
  // Horizontal: within each row, all adjacent pairs
  // Vertical: staggered — even rows connect on even cols, odd rows connect on odd cols
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = []

  // Horizontal edges
  rows.forEach((y, r) => {
    cols.forEach((x, c) => {
      if (c < cols.length - 1) {
        edges.push({ x1: x, y1: y, x2: cols[c + 1], y2: y })
      }
    })
  })

  // Vertical edges (heavy-hex: only some verticals)
  // Between row 0 and 1: cols 0, 2, 4
  // Between row 1 and 2: cols 1, 3
  // Between row 2 and 3: cols 0, 2, 4
  const verticalConnections: { fromRow: number; cols: number[] }[] = [
    { fromRow: 0, cols: [0, 2, 4] },
    { fromRow: 1, cols: [1, 3] },
    { fromRow: 2, cols: [0, 2, 4] },
  ]

  verticalConnections.forEach(({ fromRow, cols: vcols }) => {
    vcols.forEach(c => {
      edges.push({
        x1: cols[c], y1: rows[fromRow],
        x2: cols[c], y2: rows[fromRow + 1],
      })
    })
  })

  return (
    <svg viewBox="0 0 400 200" width="400" height="200" aria-label="Superconducting heavy-hex qubit topology" style={{ maxWidth: '100%', height: 'auto' }}>
      <defs>
        <radialGradient id="sc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background hint */}
      <rect width="400" height="200" fill="rgba(16,20,26,0.5)" rx="8" />
      {/* Edges */}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke={color} strokeWidth="1.5" strokeOpacity="0.35"
        />
      ))}
      {/* Qubits */}
      {qubits.map(({ x, y, r, c }) => {
        const highlight = (r + c) % 5 === 0
        return (
          <g key={`${r}-${c}`}>
            <circle cx={x} cy={y} r={highlight ? 9 : 7} fill={color} fillOpacity="0.12" />
            <circle cx={x} cy={y} r={highlight ? 5 : 4} fill={color} fillOpacity={highlight ? 0.9 : 0.65} />
          </g>
        )
      })}
      {/* Label */}
      <text x="200" y="196" fontSize="8" fontFamily="monospace" textAnchor="middle" fill={color} fillOpacity="0.5" letterSpacing="0.1em">
        HEAVY-HEX · 4×5
      </text>
    </svg>
  )
}

// ── Trapped-Ion: linear chain, all-to-all ────────────────────────────────────

function TrappedIonTopology({ color }: TopologyProps) {
  const n = 10
  const y = 100
  const step = 32
  const startX = (400 - (n - 1) * step) / 2
  const ions = Array.from({ length: n }, (_, i) => ({ x: startX + i * step, y }))

  // All-to-all connections as curved paths
  const connections: { i: number; j: number }[] = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      connections.push({ i, j })
    }
  }

  return (
    <svg viewBox="0 0 400 200" width="400" height="200" aria-label="Trapped-ion linear chain with all-to-all connectivity" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect width="400" height="200" fill="rgba(16,20,26,0.5)" rx="8" />
      {/* All-to-all connections — arcs with opacity proportional to closeness */}
      {connections.map(({ i, j }) => {
        const x1 = ions[i].x
        const x2 = ions[j].x
        const dist = j - i
        const arcHeight = dist * 14
        const mx = (x1 + x2) / 2
        // Above for even dist, below for odd
        const cy = dist % 2 === 0 ? y - arcHeight : y + arcHeight
        const opacity = Math.max(0.06, 0.4 - dist * 0.035)
        return (
          <path
            key={`${i}-${j}`}
            d={`M ${x1} ${y} Q ${mx} ${cy} ${x2} ${y}`}
            stroke={color}
            strokeWidth="0.8"
            strokeOpacity={opacity}
            fill="none"
          />
        )
      })}
      {/* Linear chain baseline */}
      <line
        x1={ions[0].x} y1={y}
        x2={ions[n - 1].x} y2={y}
        stroke={color} strokeWidth="1" strokeOpacity="0.2"
      />
      {/* Ion nodes */}
      {ions.map(({ x }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="8" fill={color} fillOpacity="0.1" />
          <circle cx={x} cy={y} r="5" fill={color} fillOpacity="0.85" />
        </g>
      ))}
      <text x="200" y="192" fontSize="8" fontFamily="monospace" textAnchor="middle" fill={color} fillOpacity="0.5" letterSpacing="0.1em">
        ALL-TO-ALL · 10 IONS
      </text>
    </svg>
  )
}

// ── Neutral-Atom: 2D reconfigurable array ────────────────────────────────────

function NeutralAtomTopology({ color }: TopologyProps) {
  const cols = 7
  const rows = 5
  const stepX = 54
  const stepY = 36
  const startX = (400 - (cols - 1) * stepX) / 2
  const startY = (200 - (rows - 1) * stepY) / 2

  const atoms = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      x: startX + c * stepX,
      y: startY + r * stepY,
      active: Math.random() > 0.15, // conceptual: most atoms present
      r,
      c,
    }))
  ).flat()

  // Rydberg blockade radius (visual representation)
  const blockadeR = 55

  return (
    <svg viewBox="0 0 400 200" width="400" height="200" aria-label="Neutral-atom reconfigurable 2D array with Rydberg blockade" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect width="400" height="200" fill="rgba(16,20,26,0.5)" rx="8" />
      {/* Show one blockade radius circle around center atom */}
      <circle
        cx={startX + 3 * stepX}
        cy={startY + 2 * stepY}
        r={blockadeR}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.2"
        strokeDasharray="3 3"
      />
      {/* Nearest-neighbor connection lines */}
      {atoms.map(({ x, y, r, c }) => {
        const segments = []
        if (c < cols - 1) {
          const neighbor = atoms.find(a => a.r === r && a.c === c + 1)
          if (neighbor) {
            segments.push(
              <line key={`h-${r}-${c}`} x1={x} y1={y} x2={neighbor.x} y2={neighbor.y}
                stroke={color} strokeWidth="0.8" strokeOpacity="0.2" />
            )
          }
        }
        if (r < rows - 1) {
          const neighbor = atoms.find(a => a.r === r + 1 && a.c === c)
          if (neighbor) {
            segments.push(
              <line key={`v-${r}-${c}`} x1={x} y1={y} x2={neighbor.x} y2={neighbor.y}
                stroke={color} strokeWidth="0.8" strokeOpacity="0.2" />
            )
          }
        }
        return segments
      })}
      {/* Atom nodes */}
      {atoms.map(({ x, y, r, c }) => {
        const isCentral = r === 2 && c === 3
        return (
          <g key={`${r}-${c}`}>
            <circle cx={x} cy={y} r={isCentral ? 8 : 5} fill={color} fillOpacity={isCentral ? 0.2 : 0.1} />
            <circle cx={x} cy={y} r={isCentral ? 4.5 : 3} fill={color} fillOpacity={isCentral ? 1 : 0.7} />
          </g>
        )
      })}
      <text x="200" y="196" fontSize="8" fontFamily="monospace" textAnchor="middle" fill={color} fillOpacity="0.5" letterSpacing="0.1em">
        RYDBERG ARRAY · 7×5
      </text>
    </svg>
  )
}

// ── Photonic: waveguides with beam-splitter crossings ────────────────────────

function PhotonicTopology({ color }: TopologyProps) {
  const guides = [30, 75, 125, 170]
  const crossings = [110, 185, 260, 335]
  const lineStart = 20
  const lineEnd = 380

  return (
    <svg viewBox="0 0 400 200" width="400" height="200" aria-label="Photonic waveguide topology with beam-splitter crossings" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect width="400" height="200" fill="rgba(16,20,26,0.5)" rx="8" />
      {/* Waveguide lines */}
      {guides.map((y, i) => (
        <line key={i} x1={lineStart} y1={y} x2={lineEnd} y2={y}
          stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      ))}
      {/* Beam-splitter crossings between adjacent waveguides */}
      {guides.slice(0, -1).map((y1, gi) => {
        const y2 = guides[gi + 1]
        const cx = crossings[gi]
        const halfSize = 10
        return (
          <g key={gi}>
            {/* Vertical connector */}
            <line x1={cx} y1={y1} x2={cx} y2={y2}
              stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
            {/* Beam splitter symbol: rotated square */}
            <rect
              x={cx - halfSize / 2} y={(y1 + y2) / 2 - halfSize / 2}
              width={halfSize} height={halfSize}
              transform={`rotate(45, ${cx}, ${(y1 + y2) / 2})`}
              fill="rgba(16,20,26,0.9)"
              stroke={color} strokeWidth="1.2" strokeOpacity="0.8"
            />
          </g>
        )
      })}
      {/* Photon symbols at waveguide entrances */}
      {guides.map((y, i) => (
        <circle key={i} cx={lineStart + 5} cy={y} r="4"
          fill={color} fillOpacity="0.8" />
      ))}
      <text x="200" y="196" fontSize="8" fontFamily="monospace" textAnchor="middle" fill={color} fillOpacity="0.5" letterSpacing="0.1em">
        WAVEGUIDE · BEAM SPLITTERS
      </text>
    </svg>
  )
}

// ── Quantum Annealing: Pegasus-inspired graph ─────────────────────────────────

function AnnealingTopology({ color }: TopologyProps) {
  // 3 unit cells, each K_{3,3} bipartite (simplified)
  // Left group and right group per cell
  const cells = [
    { cx: 75, cy: 100 },
    { cx: 200, cy: 100 },
    { cx: 325, cy: 100 },
  ]

  const dy = [-35, 0, 35]

  // Nodes: left (x-30) and right (x+30) per cell
  const leftNodes = cells.flatMap(({ cx, cy }, ci) =>
    dy.map(d => ({ x: cx - 30, y: cy + d, cell: ci, side: 'l' }))
  )
  const rightNodes = cells.flatMap(({ cx, cy }, ci) =>
    dy.map(d => ({ x: cx + 30, y: cy + d, cell: ci, side: 'r' }))
  )

  // Within-cell K_{3,3} connections
  const intraEdges: { x1: number; y1: number; x2: number; y2: number }[] = []
  cells.forEach((_, ci) => {
    const lefts = leftNodes.filter(n => n.cell === ci)
    const rights = rightNodes.filter(n => n.cell === ci)
    lefts.forEach(l => {
      rights.forEach(r => {
        intraEdges.push({ x1: l.x, y1: l.y, x2: r.x, y2: r.y })
      })
    })
  })

  // Inter-cell connections (sparse, horizontal between right of cell i and left of cell i+1)
  const interEdges: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let ci = 0; ci < cells.length - 1; ci++) {
    const rights = rightNodes.filter(n => n.cell === ci)
    const nexts = leftNodes.filter(n => n.cell === ci + 1)
    // Connect middle nodes
    interEdges.push({
      x1: rights[1].x, y1: rights[1].y,
      x2: nexts[1].x, y2: nexts[1].y,
    })
  }

  const allNodes = [...leftNodes, ...rightNodes]

  return (
    <svg viewBox="0 0 400 200" width="400" height="200" aria-label="Quantum annealing Pegasus-inspired topology" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect width="400" height="200" fill="rgba(16,20,26,0.5)" rx="8" />
      {/* Intra-cell K3,3 edges */}
      {intraEdges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke={color} strokeWidth="0.9" strokeOpacity="0.3" />
      ))}
      {/* Inter-cell edges */}
      {interEdges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke={color} strokeWidth="1.2" strokeOpacity="0.5" />
      ))}
      {/* Unit cell bounding boxes */}
      {cells.map(({ cx, cy }, i) => (
        <rect key={i}
          x={cx - 40} y={cy - 48} width={80} height={96}
          rx="4" fill={color} fillOpacity="0.04"
          stroke={color} strokeWidth="0.6" strokeOpacity="0.2"
        />
      ))}
      {/* Nodes */}
      {allNodes.map(({ x, y }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill={color} fillOpacity="0.1" />
          <circle cx={x} cy={y} r="4" fill={color} fillOpacity="0.8" />
        </g>
      ))}
      <text x="200" y="196" fontSize="8" fontFamily="monospace" textAnchor="middle" fill={color} fillOpacity="0.5" letterSpacing="0.1em">
        CHIMERA-LIKE · K₃,₃ CELLS
      </text>
    </svg>
  )
}

// ── Topological: braided Majorana modes ──────────────────────────────────────

function TopologicalTopology({ color }: TopologyProps) {
  // Two braided curves crossing 3 times
  // Curve A: starts top-left, weaves through crossings
  // Curve B: starts bottom-left, weaves

  // Crossing points at x: 110, 200, 290
  // y range: 60 to 140 (center 100)
  const startA = { x: 20, y: 65 }
  const startB = { x: 20, y: 135 }
  const endA = { x: 380, y: 65 }
  const endB = { x: 380, y: 135 }
  const crossX = [110, 200, 290]

  // Path A: starts high, crosses to low at x1, back high at x2, back low at x3
  const pathA = `
    M ${startA.x} ${startA.y}
    C ${crossX[0] - 40} ${startA.y}, ${crossX[0] - 10} 130, ${crossX[0]} 100
    C ${crossX[0] + 10} 70, ${crossX[1] - 40} ${startA.y}, ${crossX[1]} 100
    C ${crossX[1] + 10} 130, ${crossX[2] - 40} 135, ${crossX[2]} 100
    C ${crossX[2] + 10} 70, ${endA.x - 40} ${endA.y}, ${endA.x} ${endA.y}
  `

  // Path B: starts low, opposite weave
  const pathB = `
    M ${startB.x} ${startB.y}
    C ${crossX[0] - 40} ${startB.y}, ${crossX[0] - 10} 70, ${crossX[0]} 100
    C ${crossX[0] + 10} 130, ${crossX[1] - 40} ${startB.y}, ${crossX[1]} 100
    C ${crossX[1] + 10} 70, ${crossX[2] - 40} 65, ${crossX[2]} 100
    C ${crossX[2] + 10} 130, ${endB.x - 40} ${endB.y}, ${endB.x} ${endB.y}
  `

  return (
    <svg viewBox="0 0 400 200" width="400" height="200" aria-label="Topological qubit braiding diagram" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect width="400" height="200" fill="rgba(16,20,26,0.5)" rx="8" />
      {/* Background glows at crossing points */}
      {crossX.map(x => (
        <circle key={x} cx={x} cy={100} r="18" fill={color} fillOpacity="0.08" />
      ))}
      {/* Draw path B (behind) */}
      <path d={pathB} fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Draw path A (in front) with interruptions at crossing overs */}
      {/* Segment before first crossing */}
      <path
        d={`M ${startA.x} ${startA.y} C ${crossX[0] - 40} ${startA.y}, ${crossX[0] - 10} 130, ${crossX[0]} 100`}
        fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.85" strokeLinecap="round"
      />
      {/* Gap at first crossing (B is on top here), then A continues */}
      <path
        d={`M ${crossX[0]} 100 C ${crossX[0] + 10} 70, ${crossX[1] - 40} ${startA.y}, ${crossX[1]} 100`}
        fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.85" strokeLinecap="round"
      />
      <path
        d={`M ${crossX[1]} 100 C ${crossX[1] + 10} 130, ${crossX[2] - 40} 135, ${crossX[2]} 100`}
        fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.85" strokeLinecap="round"
      />
      <path
        d={`M ${crossX[2]} 100 C ${crossX[2] + 10} 70, ${endA.x - 40} ${endA.y}, ${endA.x} ${endA.y}`}
        fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.85" strokeLinecap="round"
      />
      {/* Crossing indicators */}
      {crossX.map(x => (
        <circle key={x} cx={x} cy={100} r="5" fill={color} fillOpacity="0.9" />
      ))}
      {/* Endpoint nodes */}
      {[startA, startB, endA, endB].map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={color} fillOpacity="0.7" />
      ))}
      <text x="200" y="196" fontSize="8" fontFamily="monospace" textAnchor="middle" fill={color} fillOpacity="0.5" letterSpacing="0.1em">
        MAJORANA BRAIDING · 3 CROSSINGS
      </text>
    </svg>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

export interface ArchitectureTopologyProps {
  architecture: ArchitectureType
  className?: string
}

export function ArchitectureTopology({ architecture, className }: ArchitectureTopologyProps) {
  const color = ARCH_COLORS[architecture]

  const inner = (() => {
    switch (architecture) {
      case 'superconducting':
        return <SuperconductingTopology color={color} />
      case 'trapped-ion':
        return <TrappedIonTopology color={color} />
      case 'neutral-atom':
        return <NeutralAtomTopology color={color} />
      case 'photonic':
        return <PhotonicTopology color={color} />
      case 'quantum-annealing':
        return <AnnealingTopology color={color} />
      case 'topological':
        return <TopologicalTopology color={color} />
    }
  })()

  return <div className={className}>{inner}</div>
}
