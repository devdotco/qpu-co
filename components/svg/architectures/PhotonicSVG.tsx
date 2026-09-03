/**
 * Hero SVG for Photonic architecture page.
 * Shows 4 waveguide paths, beam splitters at crossings,
 * photon indicators, phase shifters, and directional arrows.
 */
export default function PhotonicSVG() {
  const color = '#F472B6'
  const W = 400
  const H = 240

  // 4 horizontal waveguide paths with S-curve routing
  // Each waveguide has amplitude (how much it curves toward crossing)
  const waveguides = [
    { y0: 56,  y1: 88,  y2: 56  },
    { y0: 88,  y1: 56,  y2: 88  },
    { y0: 134, y1: 166, y2: 134 },
    { y0: 166, y1: 134, y2: 166 },
  ]

  // Crossing X positions
  const cross1X = 152
  const cross2X = 248

  const wavePath = (w: typeof waveguides[0], xStart = 30, xEnd = 370): string => {
    const xMid = (xStart + xEnd) / 2
    return `M ${xStart},${w.y0} C ${xMid - 60},${w.y0} ${cross1X - 30},${w.y1} ${cross1X},${w.y1} S ${cross2X - 30},${w.y2} ${cross2X},${w.y2} C ${xMid + 60},${w.y2} ${xEnd - 30},${w.y2} ${xEnd},${w.y2}`
  }

  // Phase shifter positions
  const phaseShifters = [
    { x: 60,  wIdx: 0, label: 'φ₁' },
    { x: 60,  wIdx: 2, label: 'φ₂' },
    { x: 316, wIdx: 1, label: 'φ₃' },
    { x: 316, wIdx: 3, label: 'φ₄' },
  ]

  // Photon positions (on waveguide path, parametric t)
  const photons = [
    { x: 105, y: waveguides[0].y0, wIdx: 0 },
    { x: 200, y: (waveguides[1].y0 + waveguides[1].y1) / 2, wIdx: 1 },
    { x: 296, y: waveguides[2].y2, wIdx: 2 },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-label="Photonic integrated circuit with waveguides and beam splitters"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <pattern id="ph-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#ph-grid)" />

      {/* Chip boundary */}
      <rect x={22} y={28} width={W - 44} height={H - 44} rx={5}
        fill="rgba(244,114,182,0.02)" stroke={color} strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="5 4" />

      {/* Waveguides */}
      {waveguides.map((w, i) => (
        <path
          key={`wg-${i}`}
          d={wavePath(w)}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.4"
        />
      ))}

      {/* Beam splitter 1 */}
      {[
        [cross1X, waveguides[0].y1, waveguides[1].y1],
        [cross2X, waveguides[0].y2, waveguides[1].y2],
        [cross1X, waveguides[2].y1, waveguides[3].y1],
        [cross2X, waveguides[2].y2, waveguides[3].y2],
      ].map(([cx, y1, y2], i) => {
        const midY = ((y1 as number) + (y2 as number)) / 2
        const spread = Math.abs((y2 as number) - (y1 as number)) / 2 + 5
        return (
          <g key={`bs-${i}`}>
            {/* Beam splitter X shape */}
            <line x1={(cx as number) - spread} y1={(y1 as number) + 2} x2={(cx as number) + spread} y2={(y2 as number) - 2} stroke={color} strokeWidth="2" opacity="0.7" />
            <line x1={(cx as number) - spread} y1={(y2 as number) - 2} x2={(cx as number) + spread} y2={(y1 as number) + 2} stroke={color} strokeWidth="2" opacity="0.7" />
            {/* BS label */}
            <text x={cx as number} y={midY - spread - 4} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.45">BS</text>
          </g>
        )
      })}

      {/* Phase shifters */}
      {phaseShifters.map((ps, i) => {
        const w = waveguides[ps.wIdx]
        const yApprox = ps.x < 150 ? w.y0 : w.y2
        return (
          <g key={`ps-${i}`}>
            <rect
              x={ps.x - 9} y={yApprox - 8}
              width={18} height={16}
              rx={2}
              fill={color} fillOpacity="0.12"
              stroke={color} strokeWidth="0.8" strokeOpacity="0.5"
            />
            <text x={ps.x} y={yApprox + 4} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.6">{ps.label}</text>
          </g>
        )
      })}

      {/* Photons with direction arrows */}
      {photons.map((ph, i) => (
        <g key={`ph-${i}`}>
          <circle cx={ph.x} cy={ph.y} r={5} fill={color} opacity="0.9" />
          <circle cx={ph.x} cy={ph.y} r={9} fill={color} opacity="0.08" />
          {/* Arrow */}
          <line x1={ph.x + 7} y1={ph.y} x2={ph.x + 15} y2={ph.y} stroke={color} strokeWidth="1.2" opacity="0.55" />
          <polygon
            points={`${ph.x + 15},${ph.y} ${ph.x + 12},${ph.y - 2.5} ${ph.x + 12},${ph.y + 2.5}`}
            fill={color} opacity="0.55"
          />
        </g>
      ))}

      {/* Input / Output labels */}
      {[0, 1, 2, 3].map(i => (
        <g key={`io-${i}`}>
          <text x={18} y={waveguides[i].y0 + 4} textAnchor="end" fontSize="8" fontFamily="monospace" fill={color} opacity="0.35">in</text>
          <text x={382} y={waveguides[i].y2 + 4} fontSize="8" fontFamily="monospace" fill={color} opacity="0.35">out</text>
        </g>
      ))}

      {/* Bottom label */}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={color} opacity="0.35">
        PHOTONIC INTEGRATED CIRCUIT — LINEAR OPTICAL NETWORK
      </text>
    </svg>
  )
}
