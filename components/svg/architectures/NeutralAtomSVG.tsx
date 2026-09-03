/**
 * Hero SVG for Neutral Atom architecture page.
 * Shows 6×5 optical tweezer array with crosshair markers,
 * Rydberg blockade radius, and entanglement arcs.
 */
export default function NeutralAtomSVG() {
  const color = '#34D399'
  const W = 400
  const H = 240
  const cols = 7
  const rows = 5
  const spacingX = 46
  const spacingY = 38
  const startX = (W - (cols - 1) * spacingX) / 2
  const startY = (H - (rows - 1) * spacingY) / 2 + 2

  const atoms: { x: number; y: number; row: number; col: number; id: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      atoms.push({ x: startX + c * spacingX, y: startY + r * spacingY, row: r, col: c, id: r * cols + c })
    }
  }

  // Highlighted pair for Rydberg blockade
  const hlA = 2 * cols + 3  // center
  const hlB = 2 * cols + 4  // right neighbor
  const blockadeAtom = atoms[hlA]
  const blockadeRadius = spacingX * 1.05

  // Nearby atoms within blockade radius (for highlighting)
  const withinRadius = atoms.filter(a => {
    const dx = a.x - blockadeAtom.x
    const dy = a.y - blockadeAtom.y
    return Math.sqrt(dx * dx + dy * dy) < blockadeRadius && a.id !== hlA
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-label="Neutral atom optical tweezer array with Rydberg blockade"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <pattern id="na-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#na-grid)" />

      {/* Rydberg blockade radius */}
      <circle
        cx={blockadeAtom.x}
        cy={blockadeAtom.y}
        r={blockadeRadius}
        fill={color}
        fillOpacity="0.04"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="5 4"
      />

      {/* Entanglement arc between hlA and hlB */}
      {(() => {
        const a = atoms[hlA]
        const b = atoms[hlB]
        const midX = (a.x + b.x) / 2
        const midY = (a.y + b.y) / 2 - 14
        return (
          <path
            d={`M ${a.x},${a.y} Q ${midX},${midY} ${b.x},${b.y}`}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            opacity="0.7"
          />
        )
      })()}

      {/* Tweezer crosshair markers at each atom position */}
      {atoms.map(a => (
        <g key={`cross-${a.id}`} opacity="0.2">
          <line x1={a.x - 5} y1={a.y} x2={a.x + 5} y2={a.y} stroke={color} strokeWidth="0.7" />
          <line x1={a.x} y1={a.y - 5} x2={a.x} y2={a.y + 5} stroke={color} strokeWidth="0.7" />
        </g>
      ))}

      {/* Atoms */}
      {atoms.map(a => {
        const isHlA = a.id === hlA
        const isHlB = a.id === hlB
        const isWithin = withinRadius.some(w => w.id === a.id)
        const isActive = isHlA || isHlB

        return (
          <g key={`atom-${a.id}`}>
            {isWithin && (
              <circle cx={a.x} cy={a.y} r={8} fill={color} opacity="0.06" />
            )}
            <circle
              cx={a.x} cy={a.y}
              r={isActive ? 6 : 4}
              fill={isActive ? color : 'var(--color-bg-base, #06080B)'}
              stroke={color}
              strokeWidth={isActive ? 0 : 0.8}
              opacity={isActive ? 0.9 : isWithin ? 0.55 : 0.35}
            />
            {isHlA && (
              <circle cx={a.x} cy={a.y} r={2.5} fill="white" opacity="0.35" />
            )}
          </g>
        )
      })}

      {/* Blockade radius label */}
      <text
        x={blockadeAtom.x + blockadeRadius + 4}
        y={blockadeAtom.y}
        fontSize="8"
        fontFamily="monospace"
        fill={color}
        opacity="0.45"
        dominantBaseline="middle"
      >
        r_b
      </text>

      {/* Labels */}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={color} opacity="0.35">
        RECONFIGURABLE TWEEZER ARRAY — RYDBERG BLOCKADE
      </text>
    </svg>
  )
}
