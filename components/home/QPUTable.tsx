'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { QPU, ArchitectureType, QPUStatus } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { architectureLabel, formatQubits } from '@/lib/utils'

interface QPUTableProps {
  qpus: QPU[]
}

const ARCH_COLORS: Record<ArchitectureType, string> = {
  'superconducting': '#60A5FA',
  'trapped-ion':     '#A78BFA',
  'neutral-atom':    '#34D399',
  'photonic':        '#F472B6',
  'quantum-annealing': '#FB923C',
  'topological':     '#FBBF24',
}

const ARCH_OPTIONS: { value: ArchitectureType | ''; label: string }[] = [
  { value: '', label: 'All Architectures' },
  { value: 'superconducting',   label: 'Superconducting' },
  { value: 'trapped-ion',       label: 'Trapped Ion' },
  { value: 'neutral-atom',      label: 'Neutral Atom' },
  { value: 'photonic',          label: 'Photonic' },
  { value: 'quantum-annealing', label: 'Quantum Annealing' },
  { value: 'topological',       label: 'Topological' },
]

const STATUS_OPTIONS: { value: QPUStatus | ''; label: string }[] = [
  { value: '',            label: 'All Statuses' },
  { value: 'cloud',       label: 'Cloud Access' },
  { value: 'public',      label: 'Public Access' },
  { value: 'reservation', label: 'By Reservation' },
  { value: 'research',    label: 'Research' },
  { value: 'private',     label: 'Private' },
  { value: 'announced',   label: 'Announced' },
]

const selectStyle: React.CSSProperties = {
  background: 'var(--color-bg-panel)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  padding: '7px 10px',
  fontSize: '13px',
  color: 'var(--color-text-secondary)',
  fontFamily: 'inherit',
  cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2366717F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
}

// Mobile card for a QPU
function QPUCard({ qpu }: { qpu: QPU }) {
  const archColor = ARCH_COLORS[qpu.architecture] ?? '#9AA4B2'
  return (
    <Link href={`/qpus/${qpu.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
              {qpu.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {qpu.providerId.toUpperCase()}
            </div>
          </div>
          <StatusBadge status={qpu.status} size="sm" />
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: archColor, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ color: archColor }}>{architectureLabel(qpu.architecture)}</span>
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            {qpu.physicalQubits !== null ? `${formatQubits(qpu.physicalQubits)} qubits` : 'N/A'}
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            {qpu.cloudPlatforms.length > 0 ? 'Cloud' : 'Direct'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function QPUTable({ qpus }: QPUTableProps) {
  const [arch, setArch] = useState<ArchitectureType | ''>('')
  const [status, setStatus] = useState<QPUStatus | ''>('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return qpus.filter(q => {
      if (arch && q.architecture !== arch) return false
      if (status && q.status !== status) return false
      if (search) {
        const s = search.toLowerCase()
        return (
          q.name.toLowerCase().includes(s) ||
          q.providerId.toLowerCase().includes(s) ||
          q.architecture.toLowerCase().includes(s)
        )
      }
      return true
    }).slice(0, 8)
  }, [qpus, arch, status, search])

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        alignItems: 'center',
      }}>
        <select
          value={arch}
          onChange={e => setArch(e.target.value as ArchitectureType | '')}
          style={selectStyle}
          aria-label="Filter by architecture"
        >
          {ARCH_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={e => setStatus(e.target.value as QPUStatus | '')}
          style={selectStyle}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search processors..."
          style={{
            ...selectStyle,
            backgroundImage: 'none',
            paddingRight: '10px',
            minWidth: '180px',
          }}
          aria-label="Search QPUs"
        />

        {(arch || status || search) && (
          <button
            onClick={() => { setArch(''); setStatus(''); setSearch('') }}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '7px 12px',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div className="table-wrapper" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', display: 'table' }}
          aria-label="Quantum processor comparison table"
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Processor</th>
              <th style={{ textAlign: 'left' }}>Provider</th>
              <th style={{ textAlign: 'left' }}>Architecture</th>
              <th style={{ textAlign: 'right' }}>Qubits</th>
              <th style={{ textAlign: 'left' }}>Connectivity</th>
              <th style={{ textAlign: 'left' }}>Access</th>
              <th style={{ textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => {
              const archColor = ARCH_COLORS[q.architecture] ?? '#9AA4B2'
              return (
                <tr
                  key={q.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => { window.location.href = `/qpus/${q.slug}` }}
                >
                  <td>
                    <span style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                      {q.name}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '12px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                      {q.providerId}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: archColor, flexShrink: 0, display: 'inline-block',
                      }} />
                      <span style={{ color: archColor, fontSize: '13px' }}>
                        {architectureLabel(q.architecture)}
                      </span>
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      {formatQubits(q.physicalQubits)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {q.connectivity?.topology ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {q.cloudPlatforms.length > 0 ? 'Cloud' : 'Direct'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={q.status} size="sm" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px 0', fontSize: '14px' }}>
          No processors match the current filters.
        </p>
      )}

      {/* Mobile cards */}
      <div className="mobile-cards" style={{ display: 'none' }}>
        {filtered.map(q => <QPUCard key={q.id} qpu={q} />)}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .table-wrapper { display: none; }
          .mobile-cards { display: block !important; }
        }
      `}</style>
    </div>
  )
}
