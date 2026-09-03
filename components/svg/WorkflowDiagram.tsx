// Server component — no 'use client' needed

interface FlowStep {
  step: number
  label: string
  desc: string
  role: 'classical' | 'quantum'
}

const STEPS: FlowStep[] = [
  {
    step: 1,
    label: 'Problem Definition',
    desc: 'Formulate the computational problem as a Hamiltonian, QUBO, or amplitude estimation task.',
    role: 'classical',
  },
  {
    step: 2,
    label: 'Problem Encoding',
    desc: 'Map the problem to a qubit representation via Jordan-Wigner, Bravyi-Kitaev, or Pauli operators.',
    role: 'classical',
  },
  {
    step: 3,
    label: 'Quantum Circuit Design',
    desc: 'Construct gate sequences — VQE ansatz, QAOA layers, Trotterized Hamiltonian evolution, or Shor circuit.',
    role: 'classical',
  },
  {
    step: 4,
    label: 'QPU Execution',
    desc: 'Execute the quantum circuit on physical hardware; gates are applied to physical or logical qubits.',
    role: 'quantum',
  },
  {
    step: 5,
    label: 'Measurement & Sampling',
    desc: 'Collapse the quantum state via measurement; collect bitstring samples across many circuit shots.',
    role: 'quantum',
  },
  {
    step: 6,
    label: 'Classical Post-Processing',
    desc: 'Aggregate measurements, compute expectation values, update variational parameters for next iteration.',
    role: 'classical',
  },
  {
    step: 7,
    label: 'Result Interpretation',
    desc: 'Extract the solution: ground-state energy, optimal variable assignment, or probability distribution.',
    role: 'classical',
  },
]

export function WorkflowDiagram() {
  return (
    <div
      style={{
        position: 'relative',
        padding: '24px 20px',
        background: 'var(--color-bg-raised)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 20,
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
          Classical
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 2,
              background: 'rgba(34,211,238,0.15)',
              border: '1px solid rgba(34,211,238,0.3)',
            }}
          />
          Quantum (QPU)
        </span>
      </div>

      {/* Steps */}
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map((s, idx) => {
          const isQuantum = s.role === 'quantum'
          const isLast = idx === STEPS.length - 1

          return (
            <li key={s.step} style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
              {/* Connector column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 32,
                  flexShrink: 0,
                }}
              >
                {/* Step circle */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    background: isQuantum
                      ? 'rgba(34,211,238,0.15)'
                      : 'rgba(255,255,255,0.05)',
                    border: isQuantum
                      ? '1.5px solid rgba(34,211,238,0.4)'
                      : '1.5px solid rgba(255,255,255,0.10)',
                    color: isQuantum
                      ? 'var(--color-accent)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {s.step}
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div
                    style={{
                      width: 1.5,
                      flex: 1,
                      minHeight: 16,
                      background: isQuantum
                        ? 'rgba(34,211,238,0.25)'
                        : 'rgba(255,255,255,0.08)',
                      margin: '3px 0',
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: '4px 0 16px 12px',
                }}
              >
                <p
                  style={{
                    margin: '4px 0 3px',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: isQuantum
                      ? 'var(--color-accent)'
                      : 'var(--color-text-primary)',
                  }}
                >
                  {s.label}
                  {isQuantum && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'rgba(34,211,238,0.6)',
                        fontWeight: 400,
                      }}
                    >
                      QPU
                    </span>
                  )}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.55,
                    maxWidth: '60ch',
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
