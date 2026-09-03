'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type WorkloadType = 'chemistry' | 'optimization' | 'ml' | 'finance' | 'materials' | 'research' | 'other'
type FrameworkType = 'Qiskit' | 'Cirq' | 'CUDA-Q' | 'PennyLane' | 'Q#' | 'Braket' | 'Not sure'
type AccessType = 'Cloud' | 'Direct' | 'Either'
type PriorityType = 'Lowest cost' | 'Highest quality' | 'Fastest access' | 'Research capability'

const WORKLOADS: { value: WorkloadType; label: string }[] = [
  { value: 'chemistry',    label: 'Chemistry' },
  { value: 'optimization', label: 'Optimization' },
  { value: 'ml',          label: 'ML' },
  { value: 'finance',     label: 'Finance' },
  { value: 'materials',   label: 'Materials' },
  { value: 'research',    label: 'Research' },
  { value: 'other',       label: 'Other' },
]

const FRAMEWORKS: FrameworkType[] = ['Qiskit', 'Cirq', 'CUDA-Q', 'PennyLane', 'Q#', 'Braket', 'Not sure']
const ACCESS:    AccessType[]     = ['Cloud', 'Direct', 'Either']
const PRIORITIES: PriorityType[]  = ['Lowest cost', 'Highest quality', 'Fastest access', 'Research capability']

function ChipSelector<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: T[]
  selected: T | null
  onSelect: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: `1px solid ${selected === opt ? 'var(--color-accent)' : 'var(--color-border)'}`,
            background: selected === opt ? 'rgba(34,211,238,0.1)' : 'transparent',
            color: selected === opt ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
            fontWeight: selected === opt ? '500' : '400',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function WorkloadChips({
  options,
  selected,
  onSelect,
}: {
  options: { value: WorkloadType; label: string }[]
  selected: WorkloadType | null
  onSelect: (v: WorkloadType) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: `1px solid ${selected === opt.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
            background: selected === opt.value ? 'rgba(34,211,238,0.1)' : 'transparent',
            color: selected === opt.value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
            fontWeight: selected === opt.value ? '500' : '400',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function FrameworkSelect({
  value,
  onChange,
}: {
  value: FrameworkType | null
  onChange: (v: FrameworkType) => void
}) {
  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value as FrameworkType)}
      style={{
        background: 'var(--color-bg-raised)',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '13px',
        color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        width: '200px',
      }}
      aria-label="Select framework"
    >
      <option value="">Select framework...</option>
      {FRAMEWORKS.map(f => (
        <option key={f} value={f}>{f}</option>
      ))}
    </select>
  )
}

export default function AdvisorSection() {
  const [workload, setWorkload] = useState<WorkloadType | null>(null)
  const [framework, setFramework] = useState<FrameworkType | null>(null)
  const [access, setAccess] = useState<AccessType | null>(null)
  const [priority, setPriority] = useState<PriorityType | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (workload)   params.set('workload', workload)
    if (framework)  params.set('framework', framework)
    if (access)     params.set('access', access)
    if (priority)   params.set('priority', priority)
    router.push(`/qpu-advisor?${params.toString()}`)
  }

  const fieldLabel: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    marginBottom: '10px',
  }

  return (
    <section style={{
      background: 'var(--color-bg-raised)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '64px',
          alignItems: 'start',
        }}
          className="advisor-grid"
        >
          {/* Form */}
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              QPU ADVISOR
            </span>
            <h2 style={{ margin: '0 0 8px' }}>Tell Us the Problem.</h2>
            <h2 style={{ margin: '0 0 32px', color: 'var(--color-text-secondary)' }}>
              We&apos;ll Help Find the Hardware.
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <label style={fieldLabel}>1. Workload type</label>
                <WorkloadChips options={WORKLOADS} selected={workload} onSelect={setWorkload} />
              </div>

              <div>
                <label style={fieldLabel}>2. Preferred framework</label>
                <FrameworkSelect value={framework} onChange={setFramework} />
              </div>

              <div>
                <label style={fieldLabel}>3. Access preference</label>
                <ChipSelector<AccessType> options={ACCESS} selected={access} onSelect={setAccess} />
              </div>

              <div>
                <label style={fieldLabel}>4. Priority</label>
                <ChipSelector<PriorityType> options={PRIORITIES} selected={priority} onSelect={setPriority} />
              </div>

              <div style={{ paddingTop: '4px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '11px 28px',
                    background: 'var(--color-accent)',
                    color: '#06080B',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '0.01em',
                  }}
                >
                  Analyze My Workload →
                </button>
              </div>

              <p style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                maxWidth: '52ch',
                margin: 0,
                lineHeight: '1.5',
              }}>
                Recommendations are informational and should be independently evaluated before hardware selection decisions.
              </p>
            </form>
          </div>

          {/* Results preview */}
          <div style={{
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>Advisor Output</span>
              <span style={{ color: 'var(--color-text-faint)', fontSize: '9px' }}>EXAMPLE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Recommended Architecture', value: 'Trapped Ion', color: '#A78BFA' },
                { label: 'Best Matches', value: '4 QPUs', color: 'var(--color-text-primary)' },
                { label: 'Confidence', value: 'High', color: 'var(--color-success)' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '8px',
                }}>
                  <div style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '5px',
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: item.color,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}

              <div style={{
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px dashed var(--color-border)',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                  Reasoning, access paths, and framework compatibility appear here after workload analysis.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .advisor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
