import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showMark?: boolean
}

const sizeConfig = {
  sm: { mark: 20, text: 'text-sm', gap: 'gap-1.5' },
  md: { mark: 26, text: 'text-base', gap: 'gap-2' },
  lg: { mark: 32, text: 'text-lg', gap: 'gap-2.5' },
}

export default function Logo({ size = 'md', showMark = true }: LogoProps) {
  const cfg = sizeConfig[size]
  const s = cfg.mark

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${cfg.gap} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm`}
      aria-label="QPU.co — Home"
    >
      {showMark && (
        <svg
          width={s}
          height={s}
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Main circle — the Q body */}
          <circle
            cx="11"
            cy="11"
            r="8"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Connection node: top-left of circle */}
          <rect
            x="3"
            y="3"
            width="3"
            height="3"
            rx="0.5"
            fill="var(--color-accent)"
            opacity="0.7"
          />

          {/* Connection node: bottom-right of circle */}
          <rect
            x="16"
            y="16"
            width="3"
            height="3"
            rx="0.5"
            fill="var(--color-accent)"
          />

          {/* Gate line extending bottom-right — the Q tail as a circuit gate */}
          <line
            x1="18"
            y1="17.5"
            x2="24"
            y2="17.5"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Gate tick mark */}
          <line
            x1="21"
            y1="15"
            x2="21"
            y2="20"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      )}

      <span className={`font-semibold tracking-tight leading-none ${cfg.text}`}>
        <span style={{ color: 'var(--color-text-primary)' }}>QPU</span>
        <span
          style={{ color: 'var(--color-text-muted)' }}
          className="font-normal"
        >
          .co
        </span>
      </span>
    </Link>
  )
}
