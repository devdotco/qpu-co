// Server component — no 'use client' needed
// A simple diagram comparing a classical bit vs a qubit

export function QPUDiagram() {
  return (
    <figure
      role="img"
      aria-label="Diagram comparing a classical bit (binary 0 or 1) with a qubit (superposition state on the Bloch sphere)"
      className="my-8"
    >
      <svg
        viewBox="0 0 680 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto rounded-[var(--radius-lg)] overflow-visible"
        aria-hidden="true"
      >
        {/* Background */}
        <rect width="680" height="320" rx="10" fill="#10141A" />
        <rect width="680" height="320" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* ── LEFT PANEL: Classical Bit ─────────────────────────────────── */}
        <g transform="translate(40, 20)">
          {/* Panel label */}
          <text x="140" y="22" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="10" letterSpacing="2" fill="#66717F">CLASSICAL BIT</text>

          {/* 0 state box */}
          <rect x="50" y="50" width="80" height="80" rx="8" fill="#0B0E13" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <text x="90" y="103" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="36" fontWeight="600" fill="#F5F7F9">0</text>

          {/* OR divider */}
          <line x1="145" y1="90" x2="165" y2="90" stroke="#3D4754" strokeWidth="1" />
          <text x="155" y="95" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">or</text>

          {/* 1 state box */}
          <rect x="170" y="50" width="80" height="80" rx="8" fill="#0B0E13" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <text x="210" y="103" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="36" fontWeight="600" fill="#F5F7F9">1</text>

          {/* Arrow + label */}
          <line x1="140" y1="155" x2="140" y2="170" stroke="#3D4754" strokeWidth="1" strokeDasharray="3,2" />
          <text x="140" y="185" textAnchor="middle" fontFamily="system-ui" fontSize="12" fill="#9AA4B2">Always exactly 0 or 1</text>
          <text x="140" y="202" textAnchor="middle" fontFamily="system-ui" fontSize="11" fill="#66717F">binary: two definite states</text>

          {/* Switch icon metaphor */}
          <rect x="95" y="220" width="90" height="24" rx="12" fill="#0B0E13" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="165" cy="232" r="9" fill="#4ADE80" />
          <text x="140" y="237" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" fill="#66717F">ON / OFF</text>
        </g>

        {/* ── CENTER DIVIDER ────────────────────────────────────────────── */}
        <line x1="340" y1="30" x2="340" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,3" />
        <text x="340" y="164" textAnchor="middle" fontFamily="system-ui" fontSize="11" fill="#3D4754" transform="rotate(-90,340,164)">vs</text>

        {/* ── RIGHT PANEL: Qubit (Bloch Sphere) ────────────────────────── */}
        <g transform="translate(360, 20)">
          {/* Panel label */}
          <text x="140" y="22" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="10" letterSpacing="2" fill="#22D3EE">QUBIT</text>

          {/* Bloch sphere — circle representing the sphere */}
          <ellipse cx="140" cy="110" rx="75" ry="75" fill="#0B0E13" stroke="rgba(34,211,238,0.25)" strokeWidth="1.5" />

          {/* Equator (horizontal ellipse) */}
          <ellipse cx="140" cy="110" rx="75" ry="22" fill="none" stroke="rgba(34,211,238,0.12)" strokeWidth="1" strokeDasharray="4,3" />

          {/* North pole |0⟩ */}
          <circle cx="140" cy="35" r="4" fill="#22D3EE" />
          <text x="152" y="38" fontFamily="'Geist Mono', monospace" fontSize="11" fill="#9AA4B2">|0⟩</text>

          {/* South pole |1⟩ */}
          <circle cx="140" cy="185" r="4" fill="#22D3EE" />
          <text x="152" y="189" fontFamily="'Geist Mono', monospace" fontSize="11" fill="#9AA4B2">|1⟩</text>

          {/* State vector — pointing to a superposition */}
          <line x1="140" y1="110" x2="183" y2="68" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
          {/* Arrowhead */}
          <polygon points="183,68 172,72 176,60" fill="#22D3EE" />

          {/* Vertical axis */}
          <line x1="140" y1="30" x2="140" y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />

          {/* Angle arc hint */}
          <path d="M 140 80 A 30 30 0 0 1 162 92" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
          <text x="158" y="82" fontFamily="'Geist Mono', monospace" fontSize="9" fill="rgba(34,211,238,0.7)">θ</text>

          {/* Superposition label */}
          <text x="140" y="220" textAnchor="middle" fontFamily="system-ui" fontSize="12" fill="#9AA4B2">α|0⟩ + β|1⟩ simultaneously</text>
          <text x="140" y="237" textAnchor="middle" fontFamily="system-ui" fontSize="11" fill="#66717F">continuous probability amplitudes</text>

          {/* State sphere label */}
          <text x="62" y="113" fontFamily="'Geist Mono', monospace" fontSize="9" fill="rgba(255,255,255,0.2)">|+⟩</text>
          <text x="200" y="113" fontFamily="'Geist Mono', monospace" fontSize="9" fill="rgba(255,255,255,0.2)">|−⟩</text>

          {/* Measurement note */}
          <rect x="60" y="255" width="160" height="26" rx="4" fill="#0B0E13" stroke="rgba(34,211,238,0.15)" strokeWidth="1" />
          <text x="140" y="270" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">
            Measurement collapses
          </text>
          <text x="140" y="282" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#22D3EE">
            to 0 or 1 (probabilistic)
          </text>
        </g>
      </svg>

      <figcaption className="text-center text-xs text-[var(--color-text-muted)] mt-3 font-mono">
        Classical bit: binary switch (0 or 1) · Qubit: quantum state on the Bloch sphere — superposition of |0⟩ and |1⟩ until measured
      </figcaption>
    </figure>
  )
}
