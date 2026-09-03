// Server component — no 'use client'

interface Step {
  label: string
  sublabel: string
  accent: boolean
}

const STEPS: Step[] = [
  {
    label: 'Your Workload',
    sublabel: 'Circuit requirements, qubit count, fidelity needs',
    accent: false,
  },
  {
    label: 'QPU.co API',
    sublabel: 'Hardware intelligence routing layer',
    accent: true,
  },
  {
    label: 'Architecture Selection',
    sublabel: 'Trapped-ion vs. superconducting vs. annealing',
    accent: false,
  },
  {
    label: 'Processor Selection',
    sublabel: 'Best available QPU for your parameters',
    accent: true,
  },
  {
    label: 'Cloud / Direct Access',
    sublabel: 'AWS Braket, IBM Quantum, Azure Quantum',
    accent: false,
  },
  {
    label: 'Execution',
    sublabel: 'Submit and retrieve results',
    accent: false,
  },
]

export default function APIRoutingDiagram() {
  return (
    <div
      aria-label="Future QPU routing layer flow diagram showing workload through QPU.co API to execution"
      style={{ maxWidth: '420px', width: '100%' }}
    >
      {STEPS.map((step, i) => (
        <div key={step.label}>
          {/* Step box */}
          <div
            style={{
              background: step.accent
                ? 'rgba(34,211,238,0.08)'
                : 'var(--color-bg-panel)',
              border: `1px solid ${step.accent ? 'rgba(34,211,238,0.35)' : 'var(--color-border)'}`,
              borderRadius: '8px',
              padding: '14px 20px',
              position: 'relative',
            }}
          >
            {/* Step number */}
            <span
              style={{
                position: 'absolute',
                top: '50%',
                right: '16px',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: step.accent ? 'rgba(34,211,238,0.5)' : 'var(--color-text-faint)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: step.accent ? 'var(--color-accent)' : 'var(--color-text-primary)',
                marginBottom: '3px',
              }}
            >
              {step.label}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: step.accent ? 'rgba(34,211,238,0.65)' : 'var(--color-text-muted)',
                lineHeight: 1.4,
              }}
            >
              {step.sublabel}
            </div>
          </div>

          {/* Arrow connector — not after last step */}
          {i < STEPS.length - 1 && (
            <div
              aria-hidden="true"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0',
                padding: '4px 0',
              }}
            >
              <div
                style={{
                  width: '1px',
                  height: '12px',
                  background: 'rgba(255,255,255,0.12)',
                }}
              />
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
                <path
                  d="M6 8L0.803848 0.5H11.1962L6 8Z"
                  fill="rgba(255,255,255,0.18)"
                />
              </svg>
            </div>
          )}
        </div>
      ))}

      {/* Footer label */}
      <p
        style={{
          marginTop: '16px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-faint)',
        }}
      >
        Future QPU Routing Layer — under development
      </p>
    </div>
  )
}
