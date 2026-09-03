import Link from 'next/link'

function RoutingDiagram() {
  return (
    <svg
      viewBox="0 0 360 200"
      width="360"
      height="200"
      aria-label="QPU.co routes enterprise teams to quantum hardware"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Enterprise box */}
      <rect x="10" y="70" width="90" height="44" rx="6"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="55" y="89" fontSize="9" fontFamily="monospace" fill="#9AA4B2" textAnchor="middle" letterSpacing="0.06em">ENTERPRISE</text>
      <text x="55" y="103" fontSize="9" fontFamily="monospace" fill="#F5F7F9" textAnchor="middle" fontWeight="600">Team</text>

      {/* Arrow → QPU.co */}
      <line x1="100" y1="92" x2="140" y2="92" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
      <polygon points="140,89 147,92 140,95" fill="rgba(34,211,238,0.5)" />

      {/* QPU.co center box */}
      <rect x="147" y="70" width="66" height="44" rx="6"
        fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.35)" strokeWidth="1.2" />
      <text x="180" y="89" fontSize="9" fontFamily="monospace" fill="#22D3EE" textAnchor="middle" letterSpacing="0.04em">QPU.CO</text>
      <text x="180" y="103" fontSize="8" fontFamily="monospace" fill="rgba(34,211,238,0.7)" textAnchor="middle">PLATFORM</text>

      {/* Arrow → Hardware top */}
      <line x1="213" y1="84" x2="255" y2="50" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2" />
      <polygon points="252,48 260,47 258,55" fill="rgba(96,165,250,0.4)" />

      {/* Arrow → Hardware mid */}
      <line x1="213" y1="92" x2="255" y2="92" stroke="rgba(167,139,250,0.4)" strokeWidth="1.2" />
      <polygon points="255,89 262,92 255,95" fill="rgba(167,139,250,0.4)" />

      {/* Arrow → Hardware bottom */}
      <line x1="213" y1="100" x2="255" y2="134" stroke="rgba(52,211,153,0.4)" strokeWidth="1.2" />
      <polygon points="252,131 260,137 257,129" fill="rgba(52,211,153,0.4)" />

      {/* Hardware boxes */}
      {[
        { y: 28,  label: 'Superconducting', color: '#60A5FA' },
        { y: 70,  label: 'Trapped Ion',     color: '#A78BFA' },
        { y: 112, label: 'Neutral Atom',    color: '#34D399' },
      ].map(({ y, label, color }) => (
        <g key={label}>
          <rect x="262" y={y} width="88" height="30" rx="5"
            fill={`${color}12`} stroke={`${color}44`} strokeWidth="1" />
          <text x="306" y={y + 10} fontSize="8" fontFamily="monospace" fill={color} textAnchor="middle" opacity="0.9">
            {label}
          </text>
          <text x="306" y={y + 22} fontSize="7" fontFamily="monospace" fill="rgba(154,164,178,0.6)" textAnchor="middle">
            Hardware
          </text>
        </g>
      ))}

      {/* Labels */}
      <text x="120" y="86" fontSize="7" fontFamily="monospace" fill="rgba(34,211,238,0.5)" textAnchor="middle">evaluate</text>
      <text x="234" y="68" fontSize="7" fontFamily="monospace" fill="rgba(255,255,255,0.3)" textAnchor="middle">route</text>
    </svg>
  )
}

export default function EnterpriseCTA() {
  return (
    <section style={{
      background: 'var(--color-bg-raised)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '52px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '60px',
          alignItems: 'center',
        }}
          className="enterprise-inner"
        >
          {/* Left */}
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>
              FOR TECHNICAL & BUSINESS TEAMS
            </span>
            <h2 style={{ margin: '0 0 16px' }}>Evaluating Quantum Infrastructure?</h2>
            <p style={{ margin: '0 0 12px', fontSize: '15px', maxWidth: '56ch' }}>
              QPU.co helps technical and business teams understand processor architectures, evaluate providers, compare access options, and identify hardware appropriate for experimental workloads.
            </p>
            <p style={{ margin: '0 0 32px', fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '52ch' }}>
              From preliminary architecture selection to vendor evaluation and procurement guidance — without the vendor bias.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/enterprise"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '11px 24px',
                  background: 'var(--color-accent)',
                  color: '#06080B',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                Request a QPU Assessment
              </Link>
              <Link
                href="/enterprise"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '11px 24px',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Explore Enterprise
              </Link>
            </div>
          </div>

          {/* Right: routing diagram */}
          <div style={{ display: 'flex', justifyContent: 'center' }}
            className="enterprise-diagram"
          >
            <RoutingDiagram />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .enterprise-inner { grid-template-columns: 1fr !important; padding: 32px 24px !important; }
          .enterprise-diagram { display: none !important; }
        }
      `}</style>
    </section>
  )
}
