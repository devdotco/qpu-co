// Server component — no 'use client' needed
// Diagram showing CPU, GPU, and QPU as distinct compute units with workload routing

export function ComputeStack() {
  return (
    <figure
      role="img"
      aria-label="Diagram showing classical workloads routing to CPU and GPU, quantum-suited workloads routing to QPU, and a hybrid quantum-classical loop between CPU and QPU"
      className="my-8"
    >
      <svg
        viewBox="0 0 760 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
        aria-hidden="true"
      >
        {/* Background */}
        <rect width="760" height="380" rx="10" fill="#10141A" />
        <rect width="760" height="380" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* ── WORKLOAD SOURCES (top) ────────────────────────────────── */}
        {/* Classical workload bubble */}
        <rect x="80" y="30" width="180" height="44" rx="8" fill="#0B0E13" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <text x="170" y="51" textAnchor="middle" fontFamily="system-ui" fontSize="12" fontWeight="600" fill="#F5F7F9">Classical Workloads</text>
        <text x="170" y="66" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">OS · databases · ML · web</text>

        {/* Quantum workload bubble */}
        <rect x="500" y="30" width="180" height="44" rx="8" fill="#0B0E13" stroke="rgba(34,211,238,0.25)" strokeWidth="1" />
        <text x="590" y="51" textAnchor="middle" fontFamily="system-ui" fontSize="12" fontWeight="600" fill="#22D3EE">Quantum-Suited</text>
        <text x="590" y="66" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">chemistry · crypto · certain opt.</text>

        {/* ── ARROWS from workloads down ────────────────────────────── */}
        {/* Classical → CPU */}
        <line x1="140" y1="74" x2="140" y2="155" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#arr-white)" />
        {/* Classical → GPU */}
        <line x1="200" y1="74" x2="310" y2="155" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#arr-white)" />
        {/* Quantum → QPU */}
        <line x1="590" y1="74" x2="590" y2="155" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" markerEnd="url(#arr-cyan)" />

        {/* ── CPU BLOCK ────────────────────────────────────────────── */}
        <rect x="50" y="155" width="180" height="130" rx="10" fill="#0B0E13" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <text x="140" y="180" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="11" letterSpacing="2" fill="#9AA4B2">CPU</text>
        {/* Core grid — 4 cores */}
        {[0,1,2,3].map(i => (
          <rect
            key={i}
            x={75 + (i % 2) * 55}
            y={190 + Math.floor(i / 2) * 40}
            width="40" height="28" rx="4"
            fill="#141820" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
          />
        ))}
        <text x="140" y="275" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">General purpose</text>
        <text x="140" y="290" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">Sequential + few cores</text>

        {/* ── GPU BLOCK ────────────────────────────────────────────── */}
        <rect x="260" y="155" width="200" height="130" rx="10" fill="#0B0E13" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <text x="360" y="180" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="11" letterSpacing="2" fill="#9AA4B2">GPU</text>
        {/* Many cores — 5x4 grid */}
        {Array.from({ length: 20 }, (_, i) => (
          <rect
            key={i}
            x={275 + (i % 5) * 34}
            y={190 + Math.floor(i / 5) * 22}
            width="22" height="15" rx="2"
            fill="#141820" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
          />
        ))}
        <text x="360" y="285" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">Massively parallel</text>
        <text x="360" y="300" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#66717F">Thousands of cores · ML</text>

        {/* ── QPU BLOCK ────────────────────────────────────────────── */}
        <rect x="500" y="155" width="200" height="130" rx="10" fill="#0B0E13" stroke="rgba(34,211,238,0.3)" strokeWidth="1.5" />
        <text x="600" y="180" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="11" letterSpacing="2" fill="#22D3EE">QPU</text>
        {/* Qubit circles — 3x3 with connecting lines */}
        {[
          [545, 205], [600, 205], [655, 205],
          [545, 240], [600, 240], [655, 240],
          [545, 275], [600, 275], [655, 275],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="10" fill="#0B1018" stroke="rgba(34,211,238,0.35)" strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r="3" fill="rgba(34,211,238,0.6)" />
          </g>
        ))}
        {/* Entanglement connections */}
        <line x1="555" y1="205" x2="590" y2="205" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
        <line x1="610" y1="205" x2="645" y2="205" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
        <line x1="600" y1="215" x2="600" y2="230" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
        <line x1="555" y1="240" x2="590" y2="240" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
        <line x1="610" y1="240" x2="645" y2="240" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />

        {/* ── HYBRID ARROW (CPU ↔ QPU) ─────────────────────────────── */}
        <path d="M 230 250 Q 380 340 500 250" fill="none" stroke="rgba(34,211,238,0.35)" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-cyan-sm)" />
        <path d="M 500 260 Q 380 350 230 260" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arr-cyan-sm2)" />
        <rect x="330" y="328" width="100" height="20" rx="4" fill="#0B0E13" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
        <text x="380" y="341" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="#22D3EE">Hybrid loop</text>
        <text x="380" y="354" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="#66717F">VQE · QAOA · iterative</text>

        {/* ── WIN LABELS (bottom of each block) ────────────────────── */}
        <rect x="60" y="295" width="160" height="18" rx="3" fill="rgba(255,255,255,0.04)" />
        <text x="140" y="308" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="#9AA4B2">Wins: most real-world software</text>

        <rect x="270" y="308" width="180" height="18" rx="3" fill="rgba(255,255,255,0.04)" />
        <text x="360" y="321" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="#9AA4B2">Wins: ML training, graphics, HPC</text>

        <rect x="510" y="295" width="180" height="18" rx="3" fill="rgba(34,211,238,0.06)" />
        <text x="600" y="308" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="#22D3EE">Future wins: chemistry, certain opt.</text>

        {/* ── ARROW MARKER DEFS ────────────────────────────────────── */}
        <defs>
          <marker id="arr-white" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,1 L4,4 L0,7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />
          </marker>
          <marker id="arr-cyan" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,1 L4,4 L0,7" stroke="rgba(34,211,238,0.6)" strokeWidth="1.2" fill="none" />
          </marker>
          <marker id="arr-cyan-sm" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0.5 L3,3 L0,5.5" stroke="rgba(34,211,238,0.5)" strokeWidth="1" fill="none" />
          </marker>
          <marker id="arr-cyan-sm2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0.5 L3,3 L0,5.5" stroke="rgba(34,211,238,0.4)" strokeWidth="1" fill="none" />
          </marker>
        </defs>
      </svg>

      <figcaption className="text-center text-xs text-[var(--color-text-muted)] mt-3 font-mono">
        CPU: sequential general-purpose · GPU: massively parallel classical · QPU: quantum-state computation
        — most near-term quantum algorithms use a hybrid CPU↔QPU loop
      </figcaption>
    </figure>
  )
}
