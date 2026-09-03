export function EnterpriseFlow() {
  const BOX_W = 180
  const BOX_H = 40
  const CORNER = 6

  // Positions
  const topCX = 300
  const topCY = 40
  const midCX = 300
  const midCY = 130
  const providerY = 220
  const providerCXs = [100, 300, 500]
  const providerLabels = ['IBM Quantum', 'IonQ', 'Quantinuum']

  const ACCENT = '#22D3EE'
  const BORDER = 'rgba(255,255,255,0.12)'
  const BG_PANEL = '#10141A'
  const BG_RAISED = '#0B0E13'
  const TEXT_PRIMARY = '#F5F7F9'
  const TEXT_MUTED = '#66717F'
  const TEXT_SECONDARY = '#9AA4B2'

  return (
    <svg
      viewBox="0 0 600 280"
      width="100%"
      aria-label="QPU.co workload routing diagram"
      role="img"
      style={{ display: 'block', maxWidth: 600 }}
    >
      {/* Arrow marker */}
      <defs>
        <marker
          id="ef-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={ACCENT} fillOpacity={0.6} />
        </marker>
      </defs>

      {/* Top box: Enterprise / Research Team */}
      <rect
        x={topCX - BOX_W / 2}
        y={topCY - BOX_H / 2}
        width={BOX_W}
        height={BOX_H}
        rx={CORNER}
        fill={BG_RAISED}
        stroke={BORDER}
        strokeWidth={1.5}
      />
      <text
        x={topCX}
        y={topCY - 5}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={TEXT_PRIMARY}
        fontFamily="var(--font-sans), system-ui, sans-serif"
      >
        Enterprise / Research Team
      </text>
      <text
        x={topCX}
        y={topCY + 10}
        textAnchor="middle"
        fontSize={9}
        fill={TEXT_MUTED}
        fontFamily="var(--font-mono), monospace"
        letterSpacing="0.04em"
      >
        YOUR ORGANIZATION
      </text>

      {/* Arrow: top → mid */}
      <line
        x1={topCX}
        y1={topCY + BOX_H / 2}
        x2={midCX}
        y2={midCY - BOX_H / 2 - 6}
        stroke={ACCENT}
        strokeWidth={1.5}
        strokeOpacity={0.5}
        markerEnd="url(#ef-arrow)"
      />

      {/* Mid box: QPU.co Assessment */}
      <rect
        x={midCX - BOX_W / 2}
        y={midCY - BOX_H / 2}
        width={BOX_W}
        height={BOX_H}
        rx={CORNER}
        fill={BG_PANEL}
        stroke={ACCENT}
        strokeWidth={1.5}
        strokeOpacity={0.4}
      />
      <text
        x={midCX}
        y={midCY - 5}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={ACCENT}
        fontFamily="var(--font-sans), system-ui, sans-serif"
      >
        QPU.co Assessment
      </text>
      <text
        x={midCX}
        y={midCY + 10}
        textAnchor="middle"
        fontSize={9}
        fill={TEXT_MUTED}
        fontFamily="var(--font-mono), monospace"
        letterSpacing="0.04em"
      >
        INDEPENDENT ANALYSIS
      </text>

      {/* Arrows: mid → providers */}
      {providerCXs.map((cx, i) => (
        <line
          key={i}
          x1={midCX}
          y1={midCY + BOX_H / 2}
          x2={cx}
          y2={providerY - BOX_H / 2 - 6}
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeOpacity={0.35}
          markerEnd="url(#ef-arrow)"
        />
      ))}

      {/* Provider boxes */}
      {providerCXs.map((cx, i) => (
        <g key={i}>
          <rect
            x={cx - 72}
            y={providerY - BOX_H / 2}
            width={144}
            height={BOX_H}
            rx={CORNER}
            fill={BG_RAISED}
            stroke={BORDER}
            strokeWidth={1.5}
          />
          <text
            x={cx}
            y={providerY + 5}
            textAnchor="middle"
            fontSize={11}
            fontWeight={500}
            fill={TEXT_SECONDARY}
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            {providerLabels[i]}
          </text>
        </g>
      ))}

      {/* Bottom label */}
      <text
        x={300}
        y={268}
        textAnchor="middle"
        fontSize={9}
        fill={TEXT_MUTED}
        fontFamily="var(--font-mono), monospace"
        letterSpacing="0.06em"
      >
        PROVIDER / ARCHITECTURE ROUTING
      </text>
    </svg>
  )
}
