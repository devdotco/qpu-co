import Link from 'next/link'

function WaveformSVG() {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', margin: '0 auto' }}
    >
      {/* Waveform path that trails off and collapses to a dot */}
      <path
        d="M4 20 C8 20 10 8 16 8 C22 8 24 32 30 32 C36 32 38 8 44 8 C50 8 52 32 58 32 C64 32 66 8 72 8 C78 8 80 32 86 32 C90 32 92 20 96 20 L116 20"
        stroke="var(--color-border-strong)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
        opacity="0.4"
      />
      {/* Collapsed dot */}
      <circle
        cx="116"
        cy="20"
        r="4"
        fill="var(--color-accent)"
        opacity="0.8"
      />
      {/* Glow ring */}
      <circle
        cx="116"
        cy="20"
        r="7"
        stroke="var(--color-accent)"
        strokeWidth="1"
        opacity="0.25"
      />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        background: 'var(--color-bg-base)',
      }}
    >
      {/* Waveform */}
      <div style={{ marginBottom: 32 }}>
        <WaveformSVG />
      </div>

      {/* 404 label */}
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: 16,
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 12,
          letterSpacing: '-0.025em',
        }}
      >
        Lost in Superposition?
      </h1>

      <p
        style={{
          fontSize: 15,
          color: 'var(--color-text-secondary)',
          maxWidth: 360,
          lineHeight: 1.65,
          marginBottom: 36,
        }}
      >
        The page you&apos;re looking for isn&apos;t in this observable state. It may have
        collapsed to a different URL, or it may not exist yet.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/qpus"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 38,
            padding: '0 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent)',
            color: 'var(--color-bg-base)',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
        >
          Explore QPUs
        </Link>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 38,
            padding: '0 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
            color: 'var(--color-text-primary)',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Go Home
        </Link>
      </div>

      {/* Faint grid hint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      />
    </div>
  )
}
