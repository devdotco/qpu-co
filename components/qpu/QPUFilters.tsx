'use client'

import { useId } from 'react'
import { Search, X } from 'lucide-react'
import type { ArchitectureType, QPUStatus } from '@/types'
import type { Provider } from '@/types'
import { architectureLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ARCHITECTURES: ArchitectureType[] = [
  'superconducting',
  'trapped-ion',
  'neutral-atom',
  'photonic',
  'quantum-annealing',
  'topological',
]

const ARCH_COLORS: Record<ArchitectureType, string> = {
  superconducting: '#60A5FA',
  'trapped-ion': '#A78BFA',
  'neutral-atom': '#34D399',
  photonic: '#F472B6',
  'quantum-annealing': '#FB923C',
  topological: '#FBBF24',
}

const STATUSES: { value: QPUStatus; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'cloud', label: 'Cloud Access' },
  { value: 'reservation', label: 'By Reservation' },
  { value: 'research', label: 'Research' },
  { value: 'private', label: 'Private' },
  { value: 'announced', label: 'Announced' },
  { value: 'retired', label: 'Retired' },
]

const selectClass = [
  'h-8 px-2.5 pr-8 text-xs rounded-[var(--radius-md)]',
  'bg-[var(--color-bg-panel)] border border-[var(--color-border)]',
  'text-[var(--color-text-secondary)] font-medium',
  'appearance-none cursor-pointer',
  'focus:outline-none focus:border-[var(--color-accent)]',
  'transition-colors',
].join(' ')

const selectBg: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2366717F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
}

export interface QPUFiltersValue {
  architecture: ArchitectureType | null
  provider: string | null
  status: QPUStatus | null
  minQubits: number
  framework: string | null
  search: string
}

export interface QPUFiltersProps {
  value: QPUFiltersValue
  providers: Provider[]
  frameworks: string[]
  onChange: (updates: Partial<QPUFiltersValue>) => void
}

export function QPUFilters({ value, providers, frameworks, onChange }: QPUFiltersProps) {
  const searchId = useId()
  const providerId = useId()
  const statusId = useId()
  const frameworkId = useId()
  const minQubitsId = useId()

  return (
    <div className="space-y-3">
      {/* Architecture chip buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onChange({ architecture: null })}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap',
            value.architecture === null
              ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-base)] border-transparent'
              : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]',
          )}
        >
          All
        </button>
        {ARCHITECTURES.map(arch => {
          const isActive = value.architecture === arch
          const color = ARCH_COLORS[arch]
          return (
            <button
              key={arch}
              type="button"
              onClick={() => onChange({ architecture: isActive ? null : arch })}
              style={isActive ? { backgroundColor: color, color: '#06080B', borderColor: 'transparent' } : { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap',
                !isActive && 'hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]',
              )}
              aria-pressed={isActive}
            >
              {architectureLabel(arch)}
            </button>
          )
        })}
      </div>

      {/* Second row: dropdowns + search */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
          />
          <input
            id={searchId}
            type="text"
            value={value.search}
            onChange={e => onChange({ search: e.target.value })}
            placeholder="Search processors…"
            className={cn(
              'h-8 pl-8 pr-8 text-xs rounded-[var(--radius-md)]',
              'bg-[var(--color-bg-panel)] border border-[var(--color-border)]',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
              'w-48',
            )}
            aria-label="Search QPUs"
          />
          {value.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Provider */}
        <div className="relative">
          <label htmlFor={providerId} className="sr-only">Provider</label>
          <select
            id={providerId}
            value={value.provider ?? ''}
            onChange={e => onChange({ provider: e.target.value || null })}
            className={selectClass}
            style={selectBg}
          >
            <option value="">All Providers</option>
            {providers.map(p => (
              <option key={p.id} value={p.id}>{p.shortName}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <label htmlFor={statusId} className="sr-only">Status</label>
          <select
            id={statusId}
            value={value.status ?? ''}
            onChange={e => onChange({ status: (e.target.value as QPUStatus) || null })}
            className={selectClass}
            style={selectBg}
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Framework */}
        {frameworks.length > 0 && (
          <div className="relative">
            <label htmlFor={frameworkId} className="sr-only">Framework</label>
            <select
              id={frameworkId}
              value={value.framework ?? ''}
              onChange={e => onChange({ framework: e.target.value || null })}
              className={selectClass}
              style={selectBg}
            >
              <option value="">All Frameworks</option>
              {frameworks.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
          </div>
        )}

        {/* Min qubits */}
        <div className="flex items-center gap-1.5">
          <label htmlFor={minQubitsId} className="text-[11px] text-[var(--color-text-muted)] font-mono whitespace-nowrap">
            Min qubits
          </label>
          <input
            id={minQubitsId}
            type="number"
            min={0}
            step={1}
            value={value.minQubits || ''}
            onChange={e => onChange({ minQubits: Math.max(0, Number(e.target.value)) })}
            placeholder="0"
            className={cn(
              'h-8 w-20 px-2.5 text-xs rounded-[var(--radius-md)]',
              'bg-[var(--color-bg-panel)] border border-[var(--color-border)]',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
            )}
            aria-label="Minimum qubit count"
          />
        </div>
      </div>
    </div>
  )
}
