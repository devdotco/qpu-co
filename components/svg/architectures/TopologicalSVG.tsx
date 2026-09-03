/**
 * Hero SVG for Topological architecture page.
 * Shows spacetime braiding diagram with 4 worldlines,
 * two braid exchange points, and anyon labels.
 */
export default function TopologicalSVG() {
  const color = '#FBBF24'
  const W = 400
  const H = 240

  // 4 worldlines flowing from bottom (t=0) to top (t=T)
  // Time flows upward in this diagram
  const timeTop = 30
  const timeBot = 210
  const lineXs = [90, 160, 240, 310]

  // Braid event 1 at t=0.35: lines[1] and lines[2] exchange
  // Braid event 2 at t=0.65: lines[0] and lines[1] exchange
  const braid1Y = timeBot - (timeBot - timeTop) * 0.35
  const braid2Y = timeBot - (timeBot - timeTop) * 0.65

  // Worldline paths — using cubic bezier for smooth braiding
  // Line 0: stays left, dips slightly at braid2
  // Line 1: goes over line 2 at braid1, then under line 0 at braid2
  // Line 2: goes under line 1 at braid1, stays right
  // Line 3: stays far right, no braid

  const path0 = `M ${lineXs[0]},${timeBot}
    L ${lineXs[0]},${braid2Y + 35}
    C ${lineXs[0]},${braid2Y + 15} ${lineXs[1] - 10},${braid2Y + 5} ${lineXs[1]},${braid2Y}
    C ${lineXs[1] + 10},${braid2Y - 5} ${lineXs[0] + 10},${braid2Y - 15} ${lineXs[0]},${braid2Y - 35}
    L ${lineXs[0]},${timeTop}`

  // Line 1 goes OVER line 2 at braid1 (drawn last so it's on top there)
  const path1_bot = `M ${lineXs[1]},${timeBot} L ${lineXs[1]},${braid1Y + 35}
    C ${lineXs[1]},${braid1Y + 15} ${lineXs[2] - 10},${braid1Y + 5} ${lineXs[2]},${braid1Y}`
  const path1_top_after_braid1 = `C ${lineXs[2] + 10},${braid1Y - 5} ${lineXs[1] + 10},${braid1Y - 15} ${lineXs[1]},${braid1Y - 35}
    L ${lineXs[1]},${braid2Y + 35}
    C ${lineXs[1]},${braid2Y + 15} ${lineXs[0] + 10},${braid2Y + 5} ${lineXs[0]},${braid2Y}
    C ${lineXs[0] - 10},${braid2Y - 5} ${lineXs[1] - 10},${braid2Y - 15} ${lineXs[1]},${braid2Y - 35}
    L ${lineXs[1]},${timeTop}`

  // Line 2 goes UNDER line 1 at braid1 (drawn first)
  const path2 = `M ${lineXs[2]},${timeBot} L ${lineXs[2]},${braid1Y + 35}
    C ${lineXs[2]},${braid1Y + 15} ${lineXs[1] + 10},${braid1Y + 5} ${lineXs[1]},${braid1Y}
    C ${lineXs[1] - 10},${braid1Y - 5} ${lineXs[2] - 10},${braid1Y - 15} ${lineXs[2]},${braid1Y - 35}
    L ${lineXs[2]},${timeTop}`

  const path3 = `M ${lineXs[3]},${timeBot} L ${lineXs[3]},${timeTop}`

  // Anyon labels at top and bottom
  const anyons = ['γ₁', 'γ₂', 'γ₃', 'γ₄']

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-label="Non-Abelian anyon braiding spacetime diagram for topological qubits"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <pattern id="top-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
        </pattern>
        <marker id="braid-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M 0,0 L 6,3 L 0,6 Z" fill={color} opacity="0.5" />
        </marker>
      </defs>
      <rect width={W} height={H} fill="url(#top-grid)" />

      {/* Time axis */}
      <line x1={42} y1={timeBot} x2={42} y2={timeTop + 10} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x={38} y={timeBot + 8} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="rgba(255,255,255,0.3)">t=0</text>
      <text x={38} y={timeTop - 4} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="rgba(255,255,255,0.3)">t=T</text>
      <polygon points={`42,${timeTop + 10} 39,${timeTop + 18} 45,${timeTop + 18}`} fill="rgba(255,255,255,0.2)" />

      {/* Braid event time markers */}
      <line x1={50} y1={braid1Y} x2={W - 30} y2={braid1Y} stroke={color} strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 5" />
      <line x1={50} y1={braid2Y} x2={W - 30} y2={braid2Y} stroke={color} strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 5" />
      <text x={W - 26} y={braid1Y + 4} fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.35">σ₁</text>
      <text x={W - 26} y={braid2Y + 4} fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.35">σ₂</text>

      {/* Line 2 (under) — draw before line 1 so line 1 overlaps */}
      <path d={path2} fill="none" stroke={color} strokeWidth="2.2" opacity="0.45" />

      {/* Line 0 */}
      <path d={path0} fill="none" stroke={color} strokeWidth="2.2" opacity="0.65" />

      {/* Line 3 (rightmost, no braid) */}
      <path d={path3} fill="none" stroke={color} strokeWidth="2.2" opacity="0.35" />

      {/* Line 1 bottom segment (before braid1) */}
      <path d={path1_bot} fill="none" stroke={color} strokeWidth="2.5" opacity="0.75" />
      {/* Mask for the under-crossing: draw a gap before rendering line 1 on top */}
      <path
        d={`M ${lineXs[1]},${braid1Y - 4} C ${lineXs[2] + 2},${braid1Y - 2} ${lineXs[1] + 5},${braid1Y - 6} ${lineXs[1]},${braid1Y}`}
        fill="none"
        stroke="var(--color-bg-base, #06080B)"
        strokeWidth="5"
        opacity="1"
      />
      {/* Line 1 top (after braid1, over line 2, then braid2 under line 0) */}
      <path d={path1_top_after_braid1} fill="none" stroke={color} strokeWidth="2.5" opacity="0.75" />

      {/* Anyon circles at start and end of each worldline */}
      {lineXs.map((x, i) => (
        <g key={`anyon-${i}`}>
          <circle cx={x} cy={timeBot + 8} r={7} fill={color} opacity="0.1" />
          <circle cx={x} cy={timeBot + 8} r={4.5} fill={color} opacity="0.65" />
          <text x={x} y={timeBot + 22} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={color} opacity="0.6">
            {anyons[i]}
          </text>
          <circle cx={x} cy={timeTop - 8} r={3.5} fill={color} opacity="0.45" />
        </g>
      ))}

      {/* Braid exchange indicators */}
      <text x={(lineXs[1] + lineXs[2]) / 2} y={braid1Y - 24} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={color} opacity="0.5">
        exchange
      </text>
      <text x={(lineXs[0] + lineXs[1]) / 2} y={braid2Y - 24} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={color} opacity="0.5">
        exchange
      </text>

      {/* Title */}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={color} opacity="0.35">
        NON-ABELIAN ANYON BRAIDING — TOPOLOGICAL GATE
      </text>
    </svg>
  )
}
