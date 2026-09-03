'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { QPU, ArchitectureType } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { Tooltip } from '@/components/ui/Tooltip'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_COMPARE = 4
const STORAGE_KEY = 'qpu-compare-selection'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompareClientProps {
  qpus: QPU[]
  initialSlugs: string[]
}

type CellValue = string | number | null | undefined | string[]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(v: CellValue): string {
  if (v === null || v === undefined || v === '') return '—'
  if (Array.isArray(v)) return v.length > 0 ? v.join(', ') : '—'
  return String(v)
}

function cloudPlatformLabel(slug: string): string {
  const labels: Record<string, string> = {
    'aws-braket': 'AWS Braket',
    'azure-quantum': 'Azure Quantum',
    'ibm-quantum': 'IBM Quantum',
    'ionq-cloud': 'IonQ Cloud',
    'dwave-leap': 'D-Wave Leap',
    'quantinuum-nexus': 'Quantinuum Nexus',
  }
  return labels[slug] ?? slug
}

function frameworkLabel(slug: string): string {
  const labels: Record<string, string> = {
    qiskit: 'Qiskit',
    cirq: 'Cirq',
    pennylane: 'PennyLane',
    'cuda-q': 'CUDA-Q',
    qsharp: 'Q#',
    'amazon-braket-sdk': 'Braket SDK',
    bloqade: 'Bloqade',
    tket: 'TKET',
    pyquil: 'pyQuil',
  }
  return labels[slug] ?? slug
}

function accessModelLabel(m: string): string {
  const labels: Record<string, string> = {
    'pay-per-shot': 'Pay-per-shot',
    'pay-per-task': 'Pay-per-task',
    reservation: 'Reservation',
    subscription: 'Subscription',
    enterprise: 'Enterprise',
    research: 'Research',
    'open-access': 'Open access',
  }
  return labels[m] ?? m
}

// Safely extracts a comparable cell value for a QPU
function getCell(qpu: QPU, rowId: string): CellValue {
  switch (rowId) {
    case 'provider': return qpu.providerId
    case 'name': return qpu.name
    case 'status': return qpu.status
    case 'architecture': return qpu.architecture
    case 'paradigm': return qpu.paradigm
    case 'physicalQubits': return qpu.physicalQubits
    case 'logicalQubits': return qpu.logicalQubits
    case 'algorithmicQubits': return qpu.algorithmicQubits ?? null
    case 'qubitType': {
      const archToQubit: Record<ArchitectureType, string> = {
        superconducting: 'Superconducting transmon',
        'trapped-ion': 'Trapped ion (Yb/Ca)',
        'neutral-atom': 'Neutral atom (Rb)',
        photonic: 'Photon',
        'quantum-annealing': 'Flux qubit',
        topological: 'Topological qubit',
      }
      return archToQubit[qpu.architecture] ?? null
    }
    case 'topology': return qpu.topology ?? qpu.connectivity?.topology ?? null
    case 'connectivityType': return qpu.connectivity?.allToAll ? 'All-to-all' : 'Limited'
    case 'avgDegree': return qpu.connectivity?.avgDegree ?? null
    case 'twoQubitFidelity': {
      const v = qpu.fidelity?.twoQubitGate?.value
      return v !== null && v !== undefined ? `${v}%` : null
    }
    case 'readoutFidelity': {
      const v = qpu.fidelity?.readout?.value
      return v !== null && v !== undefined ? `${v}%` : null
    }
    case 't1': {
      const m = qpu.coherence?.t1
      return m?.value !== null && m?.value !== undefined ? `${m.value} ${m.unit}` : null
    }
    case 't2': {
      const m = qpu.coherence?.t2
      return m?.value !== null && m?.value !== undefined ? `${m.value} ${m.unit}` : null
    }
    case 'nativeGates': return qpu.nativeGates ?? null
    case 'quantumVolume': {
      const b = qpu.benchmarks?.find(b => b.metric === 'quantum-volume')
      return b ? `QV ${b.value}` : null
    }
    case 'clops': {
      const b = qpu.benchmarks?.find(b => b.metric === 'clops')
      return b ? `${b.value.toLocaleString()} CLOPS` : null
    }
    case 'algoQubits': {
      const b = qpu.benchmarks?.find(b => b.metric === 'algorithmic-qubits')
      const aq = qpu.algorithmicQubits
      return b ? b.value : (aq ?? null)
    }
    case 'frameworks': return qpu.frameworks.map(frameworkLabel)
    case 'qiskitSupport': return qpu.frameworks.includes('qiskit') ? 'Yes' : 'No'
    case 'cirqSupport': return qpu.frameworks.includes('cirq') ? 'Yes' : 'No'
    case 'cudaqSupport': return qpu.frameworks.includes('cuda-q') ? 'Yes' : 'No'
    case 'pennylaneSupport': return qpu.frameworks.includes('pennylane') ? 'Yes' : 'No'
    case 'qsharpSupport': return qpu.frameworks.includes('qsharp') ? 'Yes' : 'No'
    case 'braketSupport': return qpu.frameworks.includes('amazon-braket-sdk') ? 'Yes' : 'No'
    case 'cloudPlatforms': return qpu.cloudPlatforms.map(cloudPlatformLabel)
    case 'regions': return qpu.regions
    case 'accessModels': return qpu.accessModels.map(accessModelLabel)
    case 'pricingModel': return qpu.pricing?.model ?? null
    case 'approxCost': {
      const p = qpu.pricing
      if (!p) return null
      if (p.pricePerShot !== null && p.pricePerShot !== undefined) return `$${p.pricePerShot}/shot`
      if (p.pricePerTask !== null && p.pricePerTask !== undefined) return `$${p.pricePerTask}/task`
      return null
    }
    case 'freeTier': return qpu.accessModels.includes('open-access') ? 'Yes' : 'No'
    case 'currentStatus': return qpu.status
    default: return null
  }
}

// Check if all selected QPUs have the same value for a row
function allSame(qpuList: QPU[], rowId: string): boolean {
  if (qpuList.length < 2) return true
  const values = qpuList.map(q => fmt(getCell(q, rowId)))
  return values.every(v => v === values[0])
}

// Check if any QPU is an annealer (different paradigm)
function hasMixedParadigms(qpuList: QPU[]): boolean {
  if (qpuList.length < 2) return false
  const paradigms = new Set(qpuList.map(q => q.paradigm))
  return paradigms.size > 1
}

// ─── Table Row Config ─────────────────────────────────────────────────────────

interface TableRow {
  id: string
  label: string
  section: string
  tooltip?: string
  render?: (qpu: QPU) => React.ReactNode
}

const TABLE_ROWS: TableRow[] = [
  // Overview
  { id: 'provider', label: 'Provider', section: 'Overview', tooltip: 'Manufacturer of the quantum processor.' },
  { id: 'name', label: 'Processor', section: 'Overview' },
  { id: 'status', label: 'Status', section: 'Overview', render: (q) => <StatusBadge status={q.status} /> },
  { id: 'architecture', label: 'Architecture', section: 'Overview', render: (q) => <ArchitectureBadge architecture={q.architecture} /> },
  { id: 'paradigm', label: 'Paradigm', section: 'Overview', tooltip: 'Computational paradigm: gate-based, annealing, or analog.' },

  // Scale
  { id: 'physicalQubits', label: 'Physical Qubits', section: 'Scale', tooltip: 'Total number of physical qubits on the processor.' },
  { id: 'logicalQubits', label: 'Logical Qubits', section: 'Scale', tooltip: 'Error-corrected logical qubits, if applicable.' },
  { id: 'algorithmicQubits', label: 'Algorithmic Qubits (#AQ)', section: 'Scale', tooltip: 'IonQ\'s Algorithmic Qubit metric capturing usable scale.' },
  { id: 'qubitType', label: 'Qubit Type', section: 'Scale' },

  // Connectivity
  { id: 'topology', label: 'Topology', section: 'Connectivity', tooltip: 'Physical layout/graph of qubit connections.' },
  { id: 'connectivityType', label: 'Connectivity', section: 'Connectivity', tooltip: 'Whether qubits can directly interact with all others (all-to-all) or only neighbors.' },
  { id: 'avgDegree', label: 'Average Degree', section: 'Connectivity', tooltip: 'Mean number of connections per qubit.' },

  // Performance
  { id: 'twoQubitFidelity', label: '2-Qubit Gate Fidelity', section: 'Performance', tooltip: 'Average two-qubit gate fidelity. Higher is better. Directly limits algorithm depth.' },
  { id: 'readoutFidelity', label: 'Readout Fidelity', section: 'Performance', tooltip: 'Probability of correctly measuring qubit state.' },
  { id: 't1', label: 'T1 Coherence', section: 'Performance', tooltip: 'Amplitude damping time — how long qubits retain energy.' },
  { id: 't2', label: 'T2 Coherence', section: 'Performance', tooltip: 'Phase coherence time — limits circuit depth.' },

  // Gates
  { id: 'nativeGates', label: 'Native Gates', section: 'Gates', tooltip: 'Gate set natively implemented in hardware (no decomposition needed).' },

  // Benchmarks
  { id: 'quantumVolume', label: 'Quantum Volume', section: 'Benchmarks', tooltip: 'IBM\'s QV metric — captures scale, connectivity, and fidelity in one number. Higher is better.' },
  { id: 'clops', label: 'CLOPS', section: 'Benchmarks', tooltip: 'Circuit Layer Operations Per Second — measures throughput.' },
  { id: 'algoQubits', label: 'Algorithmic Qubits', section: 'Benchmarks', tooltip: 'Largest random circuit successfully executed by the system.' },

  // Software
  { id: 'frameworks', label: 'Native Frameworks', section: 'Software', tooltip: 'Quantum programming frameworks with first-class hardware support.' },
  { id: 'qiskitSupport', label: 'Qiskit', section: 'Software' },
  { id: 'cirqSupport', label: 'Cirq', section: 'Software' },
  { id: 'cudaqSupport', label: 'CUDA-Q', section: 'Software' },
  { id: 'pennylaneSupport', label: 'PennyLane', section: 'Software' },
  { id: 'qsharpSupport', label: 'Q#', section: 'Software' },
  { id: 'braketSupport', label: 'Braket SDK', section: 'Software' },

  // Cloud Access
  { id: 'cloudPlatforms', label: 'Available On', section: 'Cloud Access' },
  { id: 'regions', label: 'Regions', section: 'Cloud Access' },
  { id: 'accessModels', label: 'Access Models', section: 'Cloud Access' },

  // Pricing
  { id: 'pricingModel', label: 'Pricing Model', section: 'Pricing' },
  { id: 'approxCost', label: 'Approximate Cost', section: 'Pricing' },
  { id: 'freeTier', label: 'Free Tier', section: 'Pricing' },

  // Availability
  { id: 'currentStatus', label: 'Current Status', section: 'Availability', render: (q) => <StatusBadge status={q.status} /> },
]

const SECTIONS = Array.from(new Set(TABLE_ROWS.map(r => r.section)))

// ─── Suggested Pairs ──────────────────────────────────────────────────────────

const SUGGESTED_PAIRS: { label: string; slugs: string[] }[] = [
  { label: 'IonQ Forte vs IBM Heron r2', slugs: ['ionq-forte', 'ibm-heron-r2'] },
  { label: 'IBM Eagle r1 vs Rigetti Ankaa-3', slugs: ['ibm-eagle-r1', 'rigetti-ankaa-3'] },
  { label: 'Quantinuum H2 vs IonQ Forte', slugs: ['quantinuum-h2-1', 'ionq-forte'] },
]

// ─── Slot Selector ────────────────────────────────────────────────────────────

interface SlotProps {
  value: string | null
  qpus: QPU[]
  onChange: (slug: string | null) => void
  disabled?: boolean
}

function QPUSlot({ value, qpus, onChange, disabled }: SlotProps) {
  const selected = value ? qpus.find(q => q.slug === value) : null
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return qpus.filter(
      qpu => qpu.name.toLowerCase().includes(q) || qpu.providerId.toLowerCase().includes(q)
    )
  }, [qpus, search])

  return (
    <div style={{ position: 'relative', minWidth: 0 }}>
      <button
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: selected ? 'var(--color-bg-panel)' : 'var(--color-bg-raised)',
          border: `1px solid ${selected ? 'var(--color-border-strong)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          color: selected ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          fontSize: '13px',
          opacity: disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
        aria-label={selected ? `Selected: ${selected.name}. Click to change.` : 'Select a QPU'}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.name : 'Select a QPU…'}
        </span>
        {selected ? (
          <span
            role="button"
            aria-label={`Remove ${selected.name}`}
            onClick={(e) => { e.stopPropagation(); onChange(null) }}
            style={{
              fontSize: 16,
              lineHeight: 1,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              flexShrink: 0,
              padding: '0 2px',
            }}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onChange(null) } }}
          >
            ×
          </span>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--color-text-muted)', flexShrink: 0 }}>▼</span>
        )}
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 10,
              maxHeight: 300,
              display: 'flex',
              flexDirection: 'column',
            }}
            role="listbox"
            aria-label="Select a QPU"
          >
            <input
              autoFocus
              type="search"
              placeholder="Search QPUs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
                outline: 'none',
              }}
              aria-label="Search QPUs"
            />
            <div style={{ overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  No QPUs found
                </div>
              )}
              {filtered.map(qpu => (
                <button
                  key={qpu.slug}
                  role="option"
                  aria-selected={qpu.slug === value}
                  onClick={() => { onChange(qpu.slug); setOpen(false); setSearch('') }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    background: qpu.slug === value ? 'var(--color-accent-muted)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: qpu.slug === value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <span style={{ fontWeight: 500, color: qpu.slug === value ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
                    {qpu.name}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                    {qpu.providerId} · {qpu.architecture.replace(/-/g, ' ')} · {qpu.physicalQubits ?? '?'} qubits
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompareClient({ qpus, initialSlugs }: CompareClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Selected slugs — up to 4
  const [slots, setSlots] = useState<(string | null)[]>(() => {
    // Try to restore from localStorage first, then use initialSlugs
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored && initialSlugs.length === 0) {
          const parsed: unknown = JSON.parse(stored)
          if (Array.isArray(parsed)) return (parsed as unknown[]).slice(0, MAX_COMPARE) as (string | null)[]
        }
      } catch { /* ignore */ }
    }
    // Pad to 2 slots minimum
    const base: (string | null)[] = initialSlugs.slice(0, MAX_COMPARE)
    while (base.length < 2) base.push(null)
    return base
  })

  const [diffOnly, setDiffOnly] = useState(false)
  const [copied, setCopied] = useState(false)

  // Selected QPU objects
  const selectedQpus = useMemo(
    () => slots.map(s => (s ? qpus.find(q => q.slug === s) ?? null : null)).filter((q): q is QPU => q !== null),
    [slots, qpus]
  )

  const filledCount = selectedQpus.length

  // Sync URL
  const syncUrl = useCallback(
    (newSlots: (string | null)[]) => {
      const filled = newSlots.filter(Boolean) as string[]
      const params = new URLSearchParams(searchParams.toString())
      if (filled.length > 0) {
        params.set('qpus', filled.join(','))
      } else {
        params.delete('qpus')
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
    } catch { /* ignore */ }
  }, [slots])

  const updateSlot = useCallback(
    (index: number, slug: string | null) => {
      setSlots(prev => {
        const next = [...prev]
        next[index] = slug
        syncUrl(next)
        return next
      })
    },
    [syncUrl]
  )

  const addSlot = useCallback(() => {
    setSlots(prev => {
      if (prev.length >= MAX_COMPARE) return prev
      const next = [...prev, null]
      return next
    })
  }, [])

  const removeSlot = useCallback(
    (index: number) => {
      setSlots(prev => {
        if (prev.length <= 2) {
          // Keep 2 slots but clear the value
          const next = [...prev]
          next[index] = null
          syncUrl(next)
          return next
        }
        const next = prev.filter((_, i) => i !== index)
        syncUrl(next)
        return next
      })
    },
    [syncUrl]
  )

  const clearAll = useCallback(() => {
    const next = [null, null]
    setSlots(next)
    syncUrl(next)
  }, [syncUrl])

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }, [])

  // Rows to show (optionally filter same-value rows)
  const visibleRows = useMemo(() => {
    if (!diffOnly || filledCount < 2) return TABLE_ROWS
    return TABLE_ROWS.filter(row => !allSame(selectedQpus, row.id))
  }, [diffOnly, filledCount, selectedQpus])

  const mixedParadigms = hasMixedParadigms(selectedQpus)

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: 'var(--color-bg-base)', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        className="grid-bg"
        style={{ borderBottom: '1px solid var(--color-border)', padding: '40px 0 32px' }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ margin: '0 0 6px' }}>Compare Quantum Processors</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', maxWidth: '56ch' }}>
            Select up to 4 QPUs to compare side by side. Specs, fidelity, access options, and more.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Selector row */}
        <div
          style={{
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${slots.length}, 1fr)`,
              gap: 12,
              marginBottom: 16,
            }}
          >
            {slots.map((slug, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="mono-label">Processor {i + 1}</span>
                <QPUSlot
                  value={slug}
                  qpus={qpus}
                  onChange={v => (v === null && slots.length > 2 ? removeSlot(i) : updateSlot(i, v))}
                />
              </div>
            ))}
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {slots.length < MAX_COMPARE && (
              <button
                onClick={addSlot}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: 'var(--color-bg-raised)',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                }}
              >
                + Add processor
              </button>
            )}

            <button
              onClick={clearAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              Clear all
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Diff only toggle */}
              {filledCount >= 2 && (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    userSelect: 'none',
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 18,
                      borderRadius: 9,
                      background: diffOnly ? 'var(--color-accent)' : 'var(--color-bg-raised)',
                      border: '1px solid var(--color-border)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      flexShrink: 0,
                    }}
                    onClick={() => setDiffOnly(d => !d)}
                    role="switch"
                    aria-checked={diffOnly}
                    aria-label="Show differences only"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDiffOnly(d => !d) } }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: diffOnly ? 14 : 2,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: diffOnly ? 'var(--color-bg-base)' : 'var(--color-text-muted)',
                        transition: 'left 0.15s',
                      }}
                    />
                  </span>
                  Show differences only
                </label>
              )}

              {/* Copy link */}
              <button
                onClick={copyLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: copied ? 'var(--color-success-dim)' : 'var(--color-bg-raised)',
                  border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: copied ? 'var(--color-success)' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s',
                }}
                aria-label="Copy comparison link"
              >
                {copied ? '✓ Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>

        {/* Mixed paradigm warning */}
        {mixedParadigms && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--color-warning-dim)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 20,
              fontSize: '13px',
              color: 'var(--color-warning)',
            }}
            role="alert"
          >
            <strong>Note:</strong> You are comparing QPUs from different paradigms. Some metrics are not directly comparable across architectures.
          </div>
        )}

        {/* Empty state */}
        {filledCount < 2 ? (
          <div
            style={{
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '64px 32px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
              Select at least 2 QPUs to start comparing
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '0 0 28px' }}>
              Use the selectors above to choose quantum processors.
            </p>

            {/* Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', paddingTop: 6 }}>Try:</span>
              {SUGGESTED_PAIRS.map(pair => (
                <button
                  key={pair.label}
                  onClick={() => {
                    const newSlots = [...pair.slugs, null, null].slice(0, MAX_COMPARE) as (string | null)[]
                    // Ensure at least 2
                    while (newSlots.filter(Boolean).length < 2 && newSlots.length < 2) newSlots.push(null)
                    setSlots(newSlots)
                    syncUrl(newSlots)
                  }}
                  style={{
                    padding: '6px 14px',
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                  }}
                >
                  {pair.label} →
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Comparison table
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
              }}
              aria-label="QPU comparison table"
            >
              <colgroup>
                <col style={{ width: 200 }} />
                {selectedQpus.map((_, i) => <col key={i} />)}
              </colgroup>

              <thead>
                <tr>
                  <th
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      position: 'sticky',
                      left: 0,
                      background: 'var(--color-bg-base)',
                      borderBottom: '1px solid var(--color-border)',
                      zIndex: 2,
                    }}
                  />
                  {selectedQpus.map(qpu => (
                    <th
                      key={qpu.id}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '2px solid var(--color-border)',
                        background: 'var(--color-bg-raised)',
                      }}
                    >
                      <Link href={`/qpus/${qpu.slug}`} style={{ textDecoration: 'none' }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                          {qpu.name}
                        </span>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {qpu.providerId}
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {SECTIONS.map(section => {
                  const rows = visibleRows.filter(r => r.section === section)
                  if (rows.length === 0) return null

                  return (
                    <>
                      {/* Section separator */}
                      <tr key={`section-${section}`}>
                        <td
                          colSpan={selectedQpus.length + 1}
                          style={{
                            padding: '10px 16px 6px',
                            position: 'sticky',
                            left: 0,
                          }}
                        >
                          <span
                            className="mono-label"
                            style={{ color: 'var(--color-accent)', fontSize: '10px', letterSpacing: '0.1em' }}
                          >
                            {section.toUpperCase()}
                          </span>
                        </td>
                      </tr>

                      {rows.map((row, rowIdx) => {
                        const isDiff = filledCount >= 2 && !allSame(selectedQpus, row.id)
                        return (
                          <tr
                            key={row.id}
                            style={{
                              background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                            }}
                          >
                            {/* Label cell */}
                            <td
                              style={{
                                padding: '10px 16px',
                                fontSize: '12px',
                                color: 'var(--color-text-muted)',
                                position: 'sticky',
                                left: 0,
                                background: rowIdx % 2 === 0 ? 'var(--color-bg-base)' : 'rgba(11,14,19,1)',
                                borderRight: '1px solid var(--color-border-subtle)',
                                whiteSpace: 'nowrap',
                                zIndex: 1,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {row.label}
                                {row.tooltip && (
                                  <Tooltip content={row.tooltip}>
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        background: 'var(--color-bg-panel)',
                                        border: '1px solid var(--color-border)',
                                        fontSize: '9px',
                                        color: 'var(--color-text-muted)',
                                        cursor: 'help',
                                        flexShrink: 0,
                                      }}
                                      aria-label={`Info: ${row.tooltip}`}
                                    >
                                      i
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            </td>

                            {/* Value cells */}
                            {selectedQpus.map(qpu => {
                              const cellValue = getCell(qpu, row.id)
                              const displayValue = fmt(cellValue)
                              return (
                                <td
                                  key={qpu.id}
                                  style={{
                                    padding: '10px 16px',
                                    fontSize: '13px',
                                    color: 'var(--color-text-secondary)',
                                    borderBottom: '1px solid var(--color-border-subtle)',
                                    background: isDiff
                                      ? 'rgba(34,211,238,0.03)'
                                      : undefined,
                                    borderLeft: isDiff
                                      ? '2px solid rgba(34,211,238,0.12)'
                                      : '1px solid var(--color-border-subtle)',
                                    verticalAlign: 'middle',
                                  }}
                                >
                                  {row.render ? (
                                    row.render(qpu)
                                  ) : displayValue === '—' ? (
                                    <span style={{ color: 'var(--color-text-faint)' }}>—</span>
                                  ) : (
                                    <span style={{ color: isDiff ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                                      {displayValue}
                                    </span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
