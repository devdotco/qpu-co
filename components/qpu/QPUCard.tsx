'use client'

import Link from 'next/link'
import { Plus, Check } from 'lucide-react'
import type { QPU, ArchitectureType } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { formatQubits, cn } from '@/lib/utils'

const ARCH_COLORS: Record<ArchitectureType, string> = {
  superconducting: '#60A5FA',
  'trapped-ion': '#A78BFA',
  'neutral-atom': '#34D399',
  photonic: '#F472B6',
  'quantum-annealing': '#FB923C',
  topological: '#FBBF24',
}

export interface QPUCardProps {
  qpu: QPU
  providerName?: string
  showCompare?: boolean
  compact?: boolean
  onCompare?: (slug: string) => void
  isInCompareTray?: boolean
}

export function QPUCard({
  qpu,
  providerName,
  showCompare = false,
  compact = false,
  onCompare,
  isInCompareTray = false,
}: QPUCardProps) {
  const archColor = ARCH_COLORS[qpu.architecture]
  const twoQubitFidelity = qpu.fidelity?.twoQubitGate?.value

  return (
    <div className={cn('group relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] overflow-hidden transition-all duration-150 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-overlay)]', compact && 'text-xs')}>
      {/* Architecture color bar */}
      <div
        style={{ backgroundColor: archColor, height: 3 }}
        className="w-full"
        aria-hidden="true"
      />

      <div className={cn('flex flex-col', compact ? 'p-3 gap-2' : 'p-4 gap-3')}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {providerName && (
              <p className="text-[11px] text-[var(--color-text-muted)] mb-0.5 truncate font-mono">
                {providerName}
              </p>
            )}
            <h3
              className={cn(
                'font-semibold text-[var(--color-text-primary)] leading-snug truncate',
                compact ? 'text-sm' : 'text-base',
              )}
            >
              {qpu.name}
            </h3>
          </div>
          <StatusBadge status={qpu.status} size="sm" />
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <ArchitectureBadge architecture={qpu.architecture} size="sm" />
        </div>

        {/* Key metrics */}
        {!compact && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <p className="mono-label mb-0.5">Qubits</p>
              <p className="text-sm font-mono font-medium text-[var(--color-text-primary)]">
                {formatQubits(qpu.physicalQubits)}
              </p>
            </div>
            {twoQubitFidelity !== null && twoQubitFidelity !== undefined ? (
              <div>
                <p className="mono-label mb-0.5">2Q Fidelity</p>
                <p className="text-sm font-mono font-medium text-[var(--color-text-primary)]">
                  {twoQubitFidelity.toFixed(2)}%
                </p>
              </div>
            ) : qpu.algorithmicQubits ? (
              <div>
                <p className="mono-label mb-0.5">#AQ</p>
                <p className="text-sm font-mono font-medium text-[var(--color-text-primary)]">
                  {qpu.algorithmicQubits}
                </p>
              </div>
            ) : (
              <div>
                <p className="mono-label mb-0.5">Topology</p>
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {qpu.topology ?? qpu.connectivity?.topology ?? '—'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cloud platforms */}
        {qpu.cloudPlatforms.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1">
            {qpu.cloudPlatforms.slice(0, 3).map(platform => (
              <span
                key={platform}
                className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-raised)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-mono"
              >
                {platform}
              </span>
            ))}
            {qpu.cloudPlatforms.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-raised)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                +{qpu.cloudPlatforms.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--color-border-subtle)]">
          <Link
            href={`/qpus/${qpu.slug}`}
            className="text-xs font-medium text-[var(--color-accent)] hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 rounded-sm"
            aria-label={`View ${qpu.name} specifications`}
          >
            View →
          </Link>

          {showCompare && onCompare && (
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                onCompare(qpu.slug)
              }}
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border transition-colors',
                isInCompareTray
                  ? 'border-[rgba(34,211,238,0.3)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]',
              )}
              aria-label={isInCompareTray ? `Remove ${qpu.name} from comparison` : `Add ${qpu.name} to comparison`}
            >
              {isInCompareTray ? <Check size={10} /> : <Plus size={10} />}
              {isInCompareTray ? 'Added' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
