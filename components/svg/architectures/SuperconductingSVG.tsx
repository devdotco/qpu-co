/**
 * Hero SVG for Superconducting architecture page.
 * Shows a detailed heavy-hex chip lattice with qubit labels,
 * resonator lines, and chip boundary.
 */
export default function SuperconductingSVG() {
  const color = '#60A5FA'
  const W = 400
  const H = 240

  // 5-column × 6-row heavy-hex grid (qubits at vertices + edge midpoints)
  // We'll use a simplified 5×4 qubit grid with heavy-hex connectivity
  const cols = 5
  const rows = 4
  const startX = 56
  const startY = 44
  const spacingX = 64
  const spacingY = 48

  const qubits: { x: number; y: number; id: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      qubits.push({ x: startX + c * spacingX, y: startY + r * spacingY, id: r * cols + c })
    }
  }

  // Heavy-hex connections: horizontal + alternating vertical
  const connections: [number, number][] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      if (c < cols - 1) connections.push([i, i + 1])
      if (r < rows - 1 && (r + c) % 2 === 0) connections.push([i, i + cols])
    }
  }

  const highlighted = [2, 3, 7, 8, 12, 13]
  const labeledIds = [0, 2, 4, 10, 12, 14, 19]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-label="Superconducting qubit chip — heavy-hex lattice"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Grid background */}
      <rect width={W} height={H} fill="none" />
      <defs>
        <pattern id="sc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#sc-grid)" />

      {/* Chip boundary */}
      <rect
        x={30} y={22} width={W - 60} height={H - 40}
        rx={8}
        fill="rgba(96,165,250,0.02)"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.2"
        strokeDasharray="6 4"
      />

      {/* Chip label */}
      <text x={W - 44} y={36} fontSize="8" fontFamily="monospace" fill={color} opacity="0.35" textAnchor="middle">CHIP</text>

      {/* Resonator lines (coupling resonators between qubits — subtle thick lines) */}
      {connections.map(([a, b], i) => {
        const qa = qubits[a]
        const qb = qubits[b]
        const isHighlighted = highlighted.includes(a) && highlighted.includes(b)
        return (
          <line
            key={`res-${i}`}
            x1={qa.x} y1={qa.y}
            x2={qb.x} y2={qb.y}
            stroke={color}
            strokeWidth={isHighlighted ? 1.5 : 0.8}
            opacity={isHighlighted ? 0.45 : 0.18}
          />
        )
      })}

      {/* Midpoint resonator markers */}
      {connections.map(([a, b], i) => {
        const qa = qubits[a]
        const qb = qubits[b]
        const mx = (qa.x + qb.x) / 2
        const my = (qa.y + qb.y) / 2
        return (
          <rect
            key={`mid-${i}`}
            x={mx - 3} y={my - 3}
            width={6} height={6}
            rx={1}
            fill={color}
            opacity="0.12"
            transform={`rotate(45 ${mx} ${my})`}
          />
        )
      })}

      {/* Qubits */}
      {qubits.map(q => {
        const isHl = highlighted.includes(q.id)
        const isLabeled = labeledIds.includes(q.id)
        return (
          <g key={`q-${q.id}`}>
            {isHl && (
              <circle cx={q.x} cy={q.y} r={10} fill={color} opacity="0.1" />
            )}
            <circle
              cx={q.x} cy={q.y} r={isHl ? 6 : 4.5}
              fill={isHl ? color : 'var(--color-bg-base, #06080B)'}
              stroke={color}
              strokeWidth={isHl ? 0 : 1}
              opacity={isHl ? 0.9 : 0.5}
            />
            {isLabeled && (
              <text
                x={q.x} y={q.y - 9}
                textAnchor="middle"
                fontSize="7"
                fontFamily="monospace"
                fill={color}
                opacity="0.45"
              >
                Q{q.id}
              </text>
            )}
          </g>
        )
      })}

      {/* Legend */}
      <circle cx={38} cy={H - 18} r={4} fill={color} opacity="0.85" />
      <text x={47} y={H - 14} fontSize="8.5" fontFamily="monospace" fill={color} opacity="0.5">Active qubit</text>
      <text x={W / 2} y={H - 14} fontSize="9" fontFamily="monospace" fill={color} opacity="0.35" textAnchor="middle">HEAVY-HEX LATTICE</text>
    </svg>
  )
}
