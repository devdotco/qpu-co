/**
 * Hero SVG for Quantum Annealing architecture page.
 * Shows Chimera/Pegasus-style graph with dense internal connections,
 * energy landscape gradient, and highlighted ground state path.
 */
export default function AnnealingSVG() {
  const color = '#FB923C'
  const W = 400
  const H = 240

  // Pegasus-inspired layout: 4 cells of 4 qubits each, with intra and inter-cell connections
  // Simplified to 16 nodes in a structured layout
  const cells = [
    { cx: 90,  cy: 80  },
    { cx: 200, cy: 80  },
    { cx: 90,  cy: 170 },
    { cx: 200, cy: 170 },
  ]

  // Within each cell: 4 qubits arranged in a small square
  const cellNodeOffset = [
    [-22, -18], [22, -18], [-22, 18], [22, 18],
  ]

  const allNodes: { x: number; y: number; cell: number; local: number; id: number }[] = []
  cells.forEach((c, ci) => {
    cellNodeOffset.forEach((o, oi) => {
      allNodes.push({ x: c.cx + o[0], y: c.cy + o[1], cell: ci, local: oi, id: ci * 4 + oi })
    })
  })

  // Intra-cell connections (dense — all-to-all within cell)
  const intraEdges: [number, number][] = []
  for (let ci = 0; ci < 4; ci++) {
    const base = ci * 4
    for (let a = 0; a < 4; a++) {
      for (let b = a + 1; b < 4; b++) {
        intraEdges.push([base + a, base + b])
      }
    }
  }

  // Inter-cell connections (sparse — between cells)
  const interEdges: [number, number][] = [
    // Cell 0–1
    [1, 4], [3, 6],
    // Cell 0–2
    [2, 8], [3, 11],
    // Cell 1–3
    [6, 13], [7, 14],
    // Cell 2–3
    [10, 13], [11, 14],
    // Cross connections
    [1, 8], [7, 12],
  ]

  // Highlighted "ground state" path
  const gsPath = [0, 1, 4, 5, 13, 12, 8, 10]
  const gsEdges: [number, number][] = []
  for (let i = 0; i < gsPath.length - 1; i++) {
    gsEdges.push([gsPath[i], gsPath[i + 1]])
  }

  // Energy landscape background (gradient left-to-right, higher=more orange)
  const extraNodes = [
    { x: 306, y: 80  },
    { x: 340, y: 65  },
    { x: 370, y: 95  },
    { x: 306, cy: 170, y: 165 },
    { x: 340, y: 145 },
    { x: 370, y: 175 },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-label="Quantum annealing Pegasus-style graph with ground state path"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <pattern id="qa-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="energy-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.06" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
        {/* Dashed gradient for energy landscape area */}
        <linearGradient id="gs-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#qa-grid)" />

      {/* Energy landscape panel (right side) */}
      <rect x={286} y={36} width={102} height={H - 60} rx={4}
        fill="url(#energy-grad)"
        stroke={color} strokeWidth="0.6" strokeOpacity="0.2"
      />
      <text x={337} y={53} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={color} opacity="0.4">ENERGY</text>
      <text x={337} y={63} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={color} opacity="0.4">LANDSCAPE</text>

      {/* Simulated energy bumps in landscape panel */}
      {extraNodes.map((n, i) => (
        <circle key={`en-${i}`} cx={n.x} cy={n.y} r={6} fill={color} opacity={i === 4 ? 0.55 : 0.2} />
      ))}
      <path d="M 306,80 Q 323,65 340,65 Q 355,65 370,95 Q 355,125 340,145 Q 323,145 306,165"
        fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
      {/* Ground state marker */}
      <circle cx={340} cy={145} r={9} fill={color} opacity="0.08" />
      <circle cx={340} cy={145} r={5.5} fill={color} opacity="0.65" />
      <text x={340} y={162} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.5">min E</text>

      {/* Section label */}
      <text x={41} y={20} fontSize="9" fontFamily="monospace" fill={color} opacity="0.4">PEGASUS GRAPH</text>

      {/* Intra-cell edges */}
      {intraEdges.map(([a, b], i) => (
        <line
          key={`intra-${i}`}
          x1={allNodes[a].x} y1={allNodes[a].y}
          x2={allNodes[b].x} y2={allNodes[b].y}
          stroke={color}
          strokeWidth="0.8"
          opacity="0.22"
        />
      ))}

      {/* Inter-cell edges */}
      {interEdges.map(([a, b], i) => (
        <line
          key={`inter-${i}`}
          x1={allNodes[a].x} y1={allNodes[a].y}
          x2={allNodes[b].x} y2={allNodes[b].y}
          stroke={color}
          strokeWidth="0.6"
          strokeDasharray="3 3"
          opacity="0.18"
        />
      ))}

      {/* Ground state path highlight */}
      {gsEdges.map(([a, b], i) => (
        <line
          key={`gs-${i}`}
          x1={allNodes[a].x} y1={allNodes[a].y}
          x2={allNodes[b].x} y2={allNodes[b].y}
          stroke={color}
          strokeWidth="2"
          opacity="0.55"
        />
      ))}

      {/* Nodes */}
      {allNodes.map(n => {
        const isGs = gsPath.includes(n.id)
        return (
          <g key={`node-${n.id}`}>
            {isGs && <circle cx={n.x} cy={n.y} r={9} fill={color} opacity="0.09" />}
            <circle
              cx={n.x} cy={n.y} r={isGs ? 5.5 : 4}
              fill={isGs ? color : 'var(--color-bg-base, #06080B)'}
              stroke={color}
              strokeWidth={isGs ? 0 : 0.8}
              opacity={isGs ? 0.85 : 0.45}
            />
          </g>
        )
      })}

      {/* Cell boundary rectangles */}
      {cells.map((c, i) => (
        <rect
          key={`cell-${i}`}
          x={c.cx - 34} y={c.cy - 30}
          width={68} height={60}
          rx={4}
          fill="none"
          stroke={color}
          strokeWidth="0.6"
          strokeOpacity="0.15"
          strokeDasharray="3 4"
        />
      ))}

      {/* Legend */}
      <text x={W / 2 - 50} y={H - 10} fontSize="9" fontFamily="monospace" fill={color} opacity="0.35">
        QUBO ISING GRAPH — GROUND STATE PATH HIGHLIGHTED
      </text>
    </svg>
  )
}
