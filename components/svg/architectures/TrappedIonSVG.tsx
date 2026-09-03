/**
 * Hero SVG for Trapped Ion architecture page.
 * Shows a linear Paul trap with ion chain, coulomb potential background,
 * laser beams, and all-to-all connectivity arcs.
 */
export default function TrappedIonSVG() {
  const color = '#A78BFA'
  const W = 400
  const H = 240
  const ions = [50, 82, 114, 146, 178, 210, 242, 274, 306, 338]
  const ionY = 118
  const numIons = ions.length

  // All-to-all arcs (draw lighter, only show subset)
  const arcPairs: [number, number][] = []
  for (let i = 0; i < numIons; i++) {
    for (let j = i + 2; j < numIons; j += 2) {
      arcPairs.push([i, j])
    }
  }

  // Highlighted gate: ions at index 2 and 7
  const gateA = 2
  const gateB = 7

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-label="Trapped ion linear Paul trap with ion chain and laser addressing"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <pattern id="ti-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
        </pattern>
        {/* Coulomb trap potential gradient */}
        <radialGradient id="trap-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ti-grid)" />

      {/* Trap potential background (pseudo-potential well shape) */}
      <ellipse cx="194" cy={ionY} rx="175" ry="45" fill="url(#trap-gradient)" />

      {/* Trap potential curve (parabolic, representing pseudo-potential) */}
      <path
        d={`M 30,${ionY - 40} Q 194,${ionY + 28} 358,${ionY - 40}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.12"
        strokeDasharray="4 4"
      />
      <path
        d={`M 30,${ionY + 40} Q 194,${ionY - 28} 358,${ionY + 40}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.12"
        strokeDasharray="4 4"
      />

      {/* Trap electrode rails */}
      <rect x={28} y={ionY - 2} width={344} height={4} rx={2} fill={color} opacity="0.12" />

      {/* All-to-all arcs (light) */}
      {arcPairs.map(([i, j], idx) => {
        const x1 = ions[i]
        const x2 = ions[j]
        const midX = (x1 + x2) / 2
        const arcH = ((x2 - x1) / 2) * 0.55
        const isGate = (i === gateA && j === gateB) || (i === gateB && j === gateA)
        return (
          <path
            key={idx}
            d={`M ${x1},${ionY} Q ${midX},${ionY - arcH} ${x2},${ionY}`}
            fill="none"
            stroke={color}
            strokeWidth={isGate ? 1.8 : 0.6}
            opacity={isGate ? 0.55 : 0.08}
          />
        )
      })}

      {/* Laser beams — dashed lines coming from top to specific ions */}
      {[2, 5, 7].map((ionIdx, i) => {
        const x = ions[ionIdx]
        return (
          <g key={`laser-${i}`}>
            <line
              x1={x} y1={0}
              x2={x} y2={ionY - 6}
              stroke={color}
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.4"
            />
            {/* Laser indicator at top */}
            <rect x={x - 6} y={4} width={12} height={5} rx={1} fill={color} opacity="0.25" />
          </g>
        )
      })}

      {/* Gate highlight arc (between ions 2 and 7) */}
      {(() => {
        const x1 = ions[gateA]
        const x2 = ions[gateB]
        const midX = (x1 + x2) / 2
        const arcH = ((x2 - x1) / 2) * 0.6
        return (
          <path
            d={`M ${x1},${ionY} Q ${midX},${ionY - arcH} ${x2},${ionY}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity="0.65"
          />
        )
      })()}

      {/* Gate label */}
      {(() => {
        const x1 = ions[gateA]
        const x2 = ions[gateB]
        const midX = (x1 + x2) / 2
        const arcH = ((x2 - x1) / 2) * 0.6
        return (
          <text x={midX} y={ionY - arcH - 4} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={color} opacity="0.55">
            MS gate
          </text>
        )
      })()}

      {/* Ions */}
      {ions.map((x, i) => {
        const isGateIon = i === gateA || i === gateB
        const isLaser = [2, 5, 7].includes(i)
        return (
          <g key={`ion-${i}`}>
            <circle cx={x} cy={ionY} r={isGateIon ? 8 : 6} fill={color} opacity="0.08" />
            <circle
              cx={x} cy={ionY} r={isGateIon ? 5.5 : 4}
              fill={color}
              opacity={isGateIon ? 0.9 : isLaser ? 0.75 : 0.55}
            />
            {/* Ion charge glow */}
            {isGateIon && (
              <circle cx={x} cy={ionY} r={2.5} fill="white" opacity="0.3" />
            )}
          </g>
        )
      })}

      {/* Ion labels for gated ions */}
      <text x={ions[gateA]} y={ionY + 16} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.55">i={gateA}</text>
      <text x={ions[gateB]} y={ionY + 16} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.55">i={gateB}</text>

      {/* Bottom label */}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={color} opacity="0.35">LINEAR PAUL TRAP — ALL-TO-ALL CONNECTIVITY</text>
    </svg>
  )
}
