'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { QPU } from '@/types'
import type {
  AdvisorInput,
  AdvisorOutput,
  WorkloadCategory,
  CircuitDepth,
  ErrorSensitivity,
  AccessPreference,
  BudgetTier,
  Timeline,
} from '@/lib/advisor'
import { computeRecommendation } from '@/lib/advisor'
import { architectureLabel } from '@/lib/utils'

// ── Props ─────────────────────────────────────────────────────────────────────

interface QPUAdvisorPageProps {
  qpus: QPU[]
}

// ── Default input ─────────────────────────────────────────────────────────────

const DEFAULT_INPUT: AdvisorInput = {
  problemDescription: '',
  workloadCategory: 'chemistry',
  circuitDepth: 'unknown',
  estimatedQubits: null,
  errorSensitivity: 'moderate',
  hybridClassicalQuantum: null,
  preferredFramework: null,
  accessPreference: 'either',
  budgetTier: 'research-free',
  timeline: 'experimental',
}

// ── Chip selector ─────────────────────────────────────────────────────────────

interface ChipOption {
  id: string
  label: string
}

interface ChipSelectorProps<T extends string> {
  options: ChipOption[]
  value: T | null
  onChange: (val: T) => void
  name: string
}

function ChipSelector<T extends string>({
  options,
  value,
  onChange,
  name,
}: ChipSelectorProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
    >
      {options.map((opt) => {
        const selected = opt.id === value
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id as T)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: selected
                ? '1px solid var(--color-accent)'
                : '1px solid var(--color-border)',
              background: selected
                ? 'var(--color-accent-dim)'
                : 'var(--color-bg-panel)',
              color: selected
                ? 'var(--color-accent)'
                : 'var(--color-text-secondary)',
              fontSize: '13px',
              fontWeight: selected ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Step progress ─────────────────────────────────────────────────────────────

const STEP_LABELS = ['Problem', 'Requirements', 'Framework & Access', 'Review']

interface StepProgressProps {
  current: number
  total: number
}

function StepProgress({ current, total }: StepProgressProps) {
  return (
    <nav
      role="status"
      aria-label="Form progress"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        marginBottom: '40px',
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isActive = step === current
        const isCompleted = step < current
        const isLast = step === total

        return (
          <div
            key={step}
            style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1 }}
          >
            {/* Circle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                aria-current={isActive ? 'step' : undefined}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: isActive
                    ? '2px solid var(--color-accent)'
                    : isCompleted
                      ? '2px solid var(--color-success)'
                      : '2px solid var(--color-border-strong)',
                  background: isActive
                    ? 'var(--color-accent-dim)'
                    : isCompleted
                      ? 'var(--color-success-dim)'
                      : 'transparent',
                  color: isActive
                    ? 'var(--color-accent)'
                    : isCompleted
                      ? 'var(--color-success)'
                      : 'var(--color-text-faint)',
                  flexShrink: 0,
                }}
              >
                {isCompleted ? '✓' : step}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive
                    ? 'var(--color-text-primary)'
                    : isCompleted
                      ? 'var(--color-success)'
                      : 'var(--color-text-faint)',
                  whiteSpace: 'nowrap',
                }}
              >
                {STEP_LABELS[i]}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  marginBottom: '18px',
                  marginLeft: '6px',
                  marginRight: '6px',
                  background: isCompleted
                    ? 'var(--color-success)'
                    : 'var(--color-border)',
                }}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

// ── Field label ───────────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode
  required?: boolean
  htmlFor?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--color-text-primary)',
      }}
    >
      {children}
      {required && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: '600',
            color: 'var(--color-accent)',
            background: 'var(--color-accent-muted)',
            border: '1px solid var(--color-accent-dim)',
            borderRadius: 'var(--radius-sm)',
            padding: '1px 5px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Required
        </span>
      )}
    </label>
  )
}

// ── Navigation buttons ────────────────────────────────────────────────────────

interface NavButtonsProps {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  isLoading?: boolean
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = 'Next →',
  nextDisabled = false,
  isLoading = false,
}: NavButtonsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginTop: '32px',
        justifyContent: onBack ? 'space-between' : 'flex-end',
      }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background:
              nextDisabled || isLoading
                ? 'var(--color-bg-overlay)'
                : 'var(--color-accent)',
            color:
              nextDisabled || isLoading
                ? 'var(--color-text-faint)'
                : '#06080B',
            fontSize: '14px',
            fontWeight: '600',
            cursor: nextDisabled || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.12s ease',
          }}
        >
          {isLoading ? 'Analyzing…' : nextLabel}
        </button>
      )}
    </div>
  )
}

// ── Workload category options ─────────────────────────────────────────────────

const CATEGORY_OPTIONS: ChipOption[] = [
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'optimization', label: 'Optimization' },
  { id: 'machine-learning', label: 'Machine Learning' },
  { id: 'finance', label: 'Finance' },
  { id: 'materials', label: 'Materials Science' },
  { id: 'cryptography', label: 'Cryptography' },
  { id: 'research', label: 'Research' },
  { id: 'other', label: 'Other' },
]

const CIRCUIT_DEPTH_OPTIONS: ChipOption[] = [
  { id: 'shallow', label: 'Shallow (<100 gates)' },
  { id: 'medium', label: 'Medium (100–1,000 gates)' },
  { id: 'deep', label: 'Deep (>1,000 gates)' },
  { id: 'unknown', label: 'Unknown' },
]

const ERROR_SENSITIVITY_OPTIONS: ChipOption[] = [
  { id: 'high-fidelity', label: 'High Fidelity Required' },
  { id: 'moderate', label: 'Moderate Tolerance' },
  { id: 'nisq-tolerant', label: 'NISQ-Tolerant' },
]

const HYBRID_OPTIONS: ChipOption[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'unsure', label: 'Unsure' },
]

const FRAMEWORK_OPTIONS: ChipOption[] = [
  { id: 'qiskit', label: 'Qiskit' },
  { id: 'cirq', label: 'Cirq' },
  { id: 'cuda-q', label: 'CUDA-Q' },
  { id: 'pennylane', label: 'PennyLane' },
  { id: 'qsharp', label: 'Q#' },
  { id: 'amazon-braket-sdk', label: 'Braket SDK' },
  { id: 'none', label: 'No Preference' },
]

const ACCESS_OPTIONS: ChipOption[] = [
  { id: 'cloud', label: 'Cloud (Fastest)' },
  { id: 'direct', label: 'Direct (Research)' },
  { id: 'either', label: 'Either' },
]

const BUDGET_OPTIONS: ChipOption[] = [
  { id: 'research-free', label: 'Research / Free' },
  { id: 'low-cost', label: 'Low Cost' },
  { id: 'performance-first', label: 'Performance First' },
]

const TIMELINE_OPTIONS: ChipOption[] = [
  { id: 'experimental', label: 'Experimental' },
  { id: 'near-term', label: 'Near-Term Production' },
  { id: 'future-planning', label: 'Future Planning' },
]

// ── Architecture color map ────────────────────────────────────────────────────

const ARCH_COLORS: Record<string, string> = {
  superconducting: '#60A5FA',
  'trapped-ion': '#A78BFA',
  'neutral-atom': '#34D399',
  photonic: '#F472B6',
  'quantum-annealing': '#FB923C',
  topological: '#FBBF24',
}

// ── Loading dots ──────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--color-text-secondary)',
        fontSize: '14px',
      }}
    >
      <span>Analyzing hardware characteristics</span>
      <span style={{ display: 'flex', gap: '4px' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'inline-block',
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </span>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// ── Confidence bar ────────────────────────────────────────────────────────────

function ConfidenceBar({
  label,
  confidence,
  color,
  large,
}: {
  label: string
  confidence: number
  color: string
  large?: boolean
}) {
  return (
    <div style={{ marginBottom: large ? '20px' : '12px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontSize: large ? '18px' : '14px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: large ? '16px' : '13px',
            fontWeight: '700',
            color,
          }}
        >
          {confidence}%
        </span>
      </div>
      <div
        style={{
          height: large ? '8px' : '6px',
          borderRadius: '999px',
          background: 'var(--color-bg-overlay)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${confidence}%`,
            height: '100%',
            borderRadius: '999px',
            background: color,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}

// ── Fit score bar ─────────────────────────────────────────────────────────────

function FitScoreBar({ score }: { score: number }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Fit Score
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--color-accent)',
          }}
        >
          {score}%
        </span>
      </div>
      <div
        style={{
          height: '5px',
          borderRadius: '999px',
          background: 'var(--color-bg-overlay)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            borderRadius: '999px',
            background: 'var(--color-accent)',
          }}
        />
      </div>
    </div>
  )
}

// ── Summary row ───────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '10px 0',
        borderBottom: '1px solid var(--color-border-subtle)',
        gap: '16px',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          width: '160px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'var(--color-text-primary)',
          fontWeight: '500',
        }}
      >
        {value}
      </span>
    </div>
  )
}

// ── Main page component ───────────────────────────────────────────────────────

export function QPUAdvisorPage({ qpus }: QPUAdvisorPageProps) {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [input, setInput] = useState<AdvisorInput>(DEFAULT_INPUT)
  const [result, setResult] = useState<AdvisorOutput | null>(null)
  const [isComputing, setIsComputing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Hybrid helper — bridge boolean | null to chip string values ────────────
  const hybridValue =
    input.hybridClassicalQuantum === true
      ? 'yes'
      : input.hybridClassicalQuantum === false
        ? 'no'
        : 'unsure'

  const setHybrid = (val: string) => {
    setInput((prev) => ({
      ...prev,
      hybridClassicalQuantum:
        val === 'yes' ? true : val === 'no' ? false : null,
    }))
  }

  // ── Compute recommendations ────────────────────────────────────────────────
  const handleCompute = () => {
    setIsComputing(true)
    setError(null)
    try {
      // Simulate a brief computation delay for UX
      const output = computeRecommendation(input, qpus)
      // Use a tiny timeout so the loading state is briefly visible
      setTimeout(() => {
        setResult(output)
        setIsComputing(false)
      }, 800)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      )
      setIsComputing(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setCurrentStep(1)
    setInput(DEFAULT_INPUT)
    setError(null)
  }

  // ── Slug lookup helper ─────────────────────────────────────────────────────
  const qpuSlug = (qpuId: string) =>
    qpus.find((q) => q.id === qpuId)?.slug ?? qpuId

  // ── Step validation ────────────────────────────────────────────────────────
  const step1Valid = !!input.workloadCategory
  const step2Valid = !!input.circuitDepth && !!input.errorSensitivity
  const step3Valid =
    !!input.accessPreference && !!input.budgetTier && !!input.timeline

  // ── Render results ─────────────────────────────────────────────────────────
  if (result) {
    const primaryColor =
      ARCH_COLORS[result.primaryArchitecture] ?? 'var(--color-accent)'
    const secondaryColor = result.secondaryArchitecture
      ? (ARCH_COLORS[result.secondaryArchitecture] ?? 'var(--color-text-muted)')
      : 'var(--color-text-muted)'

    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '48px 20px 80px',
          }}
        >
          {/* Back link */}
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '32px',
              padding: 0,
            }}
          >
            ← Start Over
          </button>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              marginBottom: '8px',
            }}
          >
            Hardware Recommendations
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginBottom: '40px',
              maxWidth: '60ch',
            }}
          >
            Based on your workload profile, here are the most suitable quantum
            processor architectures and systems.
          </p>

          {/* Architecture recommendations */}
          <section
            aria-label="Architecture recommendations"
            style={{
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              marginBottom: '28px',
            }}
          >
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)',
                marginBottom: '20px',
              }}
            >
              Architecture Match
            </h2>

            <ConfidenceBar
              label={architectureLabel(result.primaryArchitecture)}
              confidence={result.primaryArchitectureConfidence}
              color={primaryColor}
              large
            />

            {result.secondaryArchitecture && result.secondaryArchitectureConfidence !== null && (
              <ConfidenceBar
                label={architectureLabel(result.secondaryArchitecture)}
                confidence={result.secondaryArchitectureConfidence}
                color={secondaryColor}
              />
            )}
          </section>

          {/* QPU cards */}
          <section aria-label="Recommended QPUs">
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)',
                marginBottom: '16px',
              }}
            >
              Recommended Systems
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {result.recommendations.map((rec) => {
                const slug = qpuSlug(rec.qpuId)
                return (
                  <article
                    key={rec.qpuId}
                    style={{
                      background: 'var(--color-bg-panel)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '24px',
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: '17px',
                            fontWeight: '700',
                            color: 'var(--color-text-primary)',
                            marginBottom: '2px',
                          }}
                        >
                          {rec.qpuName}
                        </h3>
                        <p
                          style={{
                            fontSize: '13px',
                            color: 'var(--color-text-muted)',
                            margin: 0,
                          }}
                        >
                          {rec.provider}
                        </p>
                      </div>
                      <Link
                        href={`/qpus/${slug}`}
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-accent)',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        View full specs →
                      </Link>
                    </div>

                    {/* Fit score */}
                    <div style={{ marginBottom: '20px' }}>
                      <FitScoreBar score={rec.fitScore} />
                    </div>

                    {/* Grid: reasons + risks */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '20px',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--color-success)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginBottom: '8px',
                          }}
                        >
                          Why this QPU
                        </p>
                        <ul
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          {rec.reasons.map((r, i) => (
                            <li
                              key={i}
                              style={{
                                fontSize: '13px',
                                color: 'var(--color-text-secondary)',
                                display: 'flex',
                                gap: '8px',
                              }}
                            >
                              <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>
                                ✓
                              </span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--color-warning)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginBottom: '8px',
                          }}
                        >
                          Risks to Consider
                        </p>
                        <ul
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          {rec.risks.map((r, i) => (
                            <li
                              key={i}
                              style={{
                                fontSize: '13px',
                                color: 'var(--color-text-secondary)',
                                display: 'flex',
                                gap: '8px',
                              }}
                            >
                              <span style={{ color: 'var(--color-warning)', flexShrink: 0 }}>
                                ⚠
                              </span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Access routes */}
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: '8px',
                        }}
                      >
                        How to Access
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {rec.accessRoutes.map((route) => (
                          <span
                            key={route}
                            style={{
                              fontSize: '12px',
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text-secondary)',
                              background: 'var(--color-bg-overlay)',
                            }}
                          >
                            {route}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Framework suggestions */}
          {result.frameworkSuggestions.length > 0 && (
            <section
              aria-label="Framework suggestions"
              style={{
                background: 'var(--color-bg-panel)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                marginTop: '28px',
              }}
            >
              <h2
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-muted)',
                  marginBottom: '14px',
                }}
              >
                Framework Compatibility
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.frameworkSuggestions.map((fw) => (
                  <Link
                    key={fw}
                    href={`/frameworks/${fw}`}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-accent-dim)',
                      background: 'var(--color-accent-muted)',
                      color: 'var(--color-accent)',
                      fontSize: '13px',
                      fontWeight: '500',
                      textDecoration: 'none',
                    }}
                  >
                    {fw}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Compare link */}
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Link
              href="/compare"
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Open Full Comparison →
            </Link>
          </div>

          {/* Disclaimer */}
          <div
            role="note"
            aria-label="Disclaimer"
            style={{
              marginTop: '32px',
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-warning-dim)',
              background: 'rgba(245,158,11,0.05)',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: '1.6',
                maxWidth: '100%',
              }}
            >
              <span
                style={{
                  fontWeight: '600',
                  color: 'var(--color-warning)',
                  marginRight: '6px',
                }}
              >
                Disclaimer:
              </span>
              {result.disclaimer}
            </p>
          </div>

          {/* Methodology */}
          <p
            style={{
              marginTop: '16px',
              fontSize: '12px',
              color: 'var(--color-text-faint)',
              maxWidth: '100%',
            }}
          >
            <strong style={{ fontWeight: '500', color: 'var(--color-text-muted)' }}>
              Methodology:{' '}
            </strong>
            {result.methodology}
          </p>
        </div>
      </div>
    )
  }

  // ── Render form ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '48px 20px 80px',
        }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: '48px' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-accent)',
              marginBottom: '10px',
            }}
          >
            QPU Advisor
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              marginBottom: '12px',
            }}
          >
            Find the Right Quantum Hardware
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              maxWidth: '52ch',
            }}
          >
            Answer a few questions about your workload. We&apos;ll recommend the
            best-fit architectures and specific QPUs.
          </p>
        </div>

        {/* Step progress */}
        <StepProgress current={currentStep} total={4} />

        {/* Error display */}
        {error && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-danger-dim)',
              background: 'rgba(248,113,113,0.05)',
              marginBottom: '24px',
              fontSize: '14px',
              color: 'var(--color-danger)',
            }}
          >
            {error}
          </div>
        )}

        {/* Computing state */}
        {isComputing && (
          <div style={{ padding: '24px 0' }}>
            <LoadingDots />
          </div>
        )}

        {/* Form */}
        {!isComputing && (
          <form
            aria-label="QPU Advisor workload form"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* ── Step 1: Problem ───────────────────────────────────────── */}
            {currentStep === 1 && (
              <section aria-labelledby="step1-heading">
                <h2
                  id="step1-heading"
                  style={{ marginBottom: '28px', color: 'var(--color-text-primary)' }}
                >
                  What are you trying to compute?
                </h2>

                {/* Problem description */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel htmlFor="problem-desc">Problem Description</FieldLabel>
                  <textarea
                    id="problem-desc"
                    value={input.problemDescription}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        problemDescription: e.target.value,
                      }))
                    }
                    placeholder="Be as specific as possible — e.g. 'Molecular energy estimation for drug-likeness screening'"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-panel)',
                      color: 'var(--color-text-primary)',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      outline: 'none',
                    }}
                  />
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      marginTop: '6px',
                    }}
                  >
                    Optional — helps refine the recommendation.
                  </p>
                </div>

                {/* Workload category */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel required>Workload Category</FieldLabel>
                  <ChipSelector<WorkloadCategory>
                    name="Workload Category"
                    options={CATEGORY_OPTIONS}
                    value={input.workloadCategory}
                    onChange={(val) =>
                      setInput((prev) => ({ ...prev, workloadCategory: val }))
                    }
                  />
                </div>

                <NavButtons
                  onNext={() => setCurrentStep(2)}
                  nextDisabled={!step1Valid}
                />
              </section>
            )}

            {/* ── Step 2: Technical Requirements ───────────────────────── */}
            {currentStep === 2 && (
              <section aria-labelledby="step2-heading">
                <h2
                  id="step2-heading"
                  style={{ marginBottom: '28px', color: 'var(--color-text-primary)' }}
                >
                  Technical Requirements
                </h2>

                {/* Circuit depth */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel required>Circuit Depth</FieldLabel>
                  <ChipSelector<CircuitDepth>
                    name="Circuit Depth"
                    options={CIRCUIT_DEPTH_OPTIONS}
                    value={input.circuitDepth}
                    onChange={(val) =>
                      setInput((prev) => ({ ...prev, circuitDepth: val }))
                    }
                  />
                </div>

                {/* Qubit count */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel htmlFor="qubit-count">Estimated Qubit Count</FieldLabel>
                  <input
                    id="qubit-count"
                    type="number"
                    min={1}
                    max={10000}
                    placeholder="Leave blank if unknown"
                    value={input.estimatedQubits ?? ''}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        estimatedQubits: e.target.value
                          ? parseInt(e.target.value, 10)
                          : null,
                      }))
                    }
                    style={{
                      width: '100%',
                      maxWidth: '240px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-panel)',
                      color: 'var(--color-text-primary)',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Error sensitivity */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel required>Error Sensitivity</FieldLabel>
                  <ChipSelector<ErrorSensitivity>
                    name="Error Sensitivity"
                    options={ERROR_SENSITIVITY_OPTIONS}
                    value={input.errorSensitivity}
                    onChange={(val) =>
                      setInput((prev) => ({ ...prev, errorSensitivity: val }))
                    }
                  />
                </div>

                {/* Hybrid */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel>Hybrid Classical-Quantum?</FieldLabel>
                  <ChipSelector<string>
                    name="Hybrid Classical-Quantum"
                    options={HYBRID_OPTIONS}
                    value={hybridValue}
                    onChange={setHybrid}
                  />
                </div>

                <NavButtons
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                  nextDisabled={!step2Valid}
                />
              </section>
            )}

            {/* ── Step 3: Framework & Access ────────────────────────────── */}
            {currentStep === 3 && (
              <section aria-labelledby="step3-heading">
                <h2
                  id="step3-heading"
                  style={{ marginBottom: '28px', color: 'var(--color-text-primary)' }}
                >
                  Framework &amp; Access
                </h2>

                {/* Preferred framework */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel>Preferred Framework</FieldLabel>
                  <ChipSelector<string>
                    name="Preferred Framework"
                    options={FRAMEWORK_OPTIONS}
                    value={input.preferredFramework ?? 'none'}
                    onChange={(val) =>
                      setInput((prev) => ({
                        ...prev,
                        preferredFramework: val === 'none' ? null : val,
                      }))
                    }
                  />
                </div>

                {/* Access preference */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel required>Access Preference</FieldLabel>
                  <ChipSelector<AccessPreference>
                    name="Access Preference"
                    options={ACCESS_OPTIONS}
                    value={input.accessPreference}
                    onChange={(val) =>
                      setInput((prev) => ({ ...prev, accessPreference: val }))
                    }
                  />
                </div>

                {/* Budget */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel required>Budget</FieldLabel>
                  <ChipSelector<BudgetTier>
                    name="Budget"
                    options={BUDGET_OPTIONS}
                    value={input.budgetTier}
                    onChange={(val) =>
                      setInput((prev) => ({ ...prev, budgetTier: val }))
                    }
                  />
                </div>

                {/* Timeline */}
                <div style={{ marginBottom: '28px' }}>
                  <FieldLabel required>Timeline</FieldLabel>
                  <ChipSelector<Timeline>
                    name="Timeline"
                    options={TIMELINE_OPTIONS}
                    value={input.timeline}
                    onChange={(val) =>
                      setInput((prev) => ({ ...prev, timeline: val }))
                    }
                  />
                </div>

                <NavButtons
                  onBack={() => setCurrentStep(2)}
                  onNext={() => setCurrentStep(4)}
                  nextDisabled={!step3Valid}
                />
              </section>
            )}

            {/* ── Step 4: Review ────────────────────────────────────────── */}
            {currentStep === 4 && (
              <section aria-labelledby="step4-heading">
                <h2
                  id="step4-heading"
                  style={{ marginBottom: '28px', color: 'var(--color-text-primary)' }}
                >
                  Review Your Selections
                </h2>

                <div
                  style={{
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px 24px',
                    marginBottom: '32px',
                  }}
                >
                  <SummaryRow
                    label="Workload Category"
                    value={
                      CATEGORY_OPTIONS.find((o) => o.id === input.workloadCategory)
                        ?.label ?? input.workloadCategory
                    }
                  />
                  {input.problemDescription && (
                    <SummaryRow
                      label="Problem Description"
                      value={
                        input.problemDescription.length > 80
                          ? input.problemDescription.slice(0, 80) + '…'
                          : input.problemDescription
                      }
                    />
                  )}
                  <SummaryRow
                    label="Circuit Depth"
                    value={
                      CIRCUIT_DEPTH_OPTIONS.find((o) => o.id === input.circuitDepth)
                        ?.label ?? input.circuitDepth
                    }
                  />
                  {input.estimatedQubits !== null && (
                    <SummaryRow
                      label="Estimated Qubits"
                      value={input.estimatedQubits.toString()}
                    />
                  )}
                  <SummaryRow
                    label="Error Sensitivity"
                    value={
                      ERROR_SENSITIVITY_OPTIONS.find(
                        (o) => o.id === input.errorSensitivity
                      )?.label ?? input.errorSensitivity
                    }
                  />
                  <SummaryRow
                    label="Hybrid Quantum"
                    value={
                      HYBRID_OPTIONS.find((o) => o.id === hybridValue)?.label ??
                      'Unsure'
                    }
                  />
                  <SummaryRow
                    label="Preferred Framework"
                    value={
                      FRAMEWORK_OPTIONS.find(
                        (o) =>
                          o.id === (input.preferredFramework ?? 'none')
                      )?.label ?? 'No Preference'
                    }
                  />
                  <SummaryRow
                    label="Access Preference"
                    value={
                      ACCESS_OPTIONS.find((o) => o.id === input.accessPreference)
                        ?.label ?? input.accessPreference
                    }
                  />
                  <SummaryRow
                    label="Budget"
                    value={
                      BUDGET_OPTIONS.find((o) => o.id === input.budgetTier)
                        ?.label ?? input.budgetTier
                    }
                  />
                  <SummaryRow
                    label="Timeline"
                    value={
                      TIMELINE_OPTIONS.find((o) => o.id === input.timeline)
                        ?.label ?? input.timeline
                    }
                  />
                </div>

                <NavButtons
                  onBack={() => setCurrentStep(3)}
                  onNext={handleCompute}
                  nextLabel="Get Recommendations →"
                  isLoading={isComputing}
                />
              </section>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
