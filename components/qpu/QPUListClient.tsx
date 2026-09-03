'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LayoutList, LayoutGrid, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react'
import type { QPU, Provider, ArchitectureType, QPUStatus } from '@/types'
import { architectureLabel, statusLabel, formatQubits, cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { QPUCard } from '@/components/qpu/QPUCard'
import { QPUFilters } from '@/components/qpu/QPUFilters'
import type { QPUFiltersValue } from '@/components/qpu/QPUFilters'
import { useCompareTray } from '@/hooks/useCompareTray'
import CompareTray from '@/components/navigation/CompareTray'

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12

type SortKey = 'updated' | 'qubits' | 'provider' | 'architecture' | 'availability'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'updated', label: 'Recently Updated' },
  { value: 'qubits', label: 'Most Qubits' },
  { value: 'provider', label: 'Provider' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'availability', label: 'Availability' },
]

// ── Helper ────────────────────────────────────────────────────────────────────

function getAllFrameworks(qpus: QPU[]): string[] {
  const set = new Set<string>()
  qpus.forEach(q => q.frameworks.forEach(f => set.add(f)))
  return Array.from(set).sort()
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface QPUListClientProps {
  qpus: QPU[]
  providers: Provider[]
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function QPUListClient({ qpus, providers }: QPUListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ── Read filters from URL ──
  const architecture = (searchParams.get('architecture') as ArchitectureType) || null
  const provider = searchParams.get('provider') || null
  const status = (searchParams.get('status') as QPUStatus) || null
  const minQubits = Math.max(0, Number(searchParams.get('minQubits') ?? 0))
  const framework = searchParams.get('framework') || null
  const search = searchParams.get('search') ?? ''
  const view = (searchParams.get('view') === 'cards' ? 'cards' : 'table') as 'table' | 'cards'
  const sort = (searchParams.get('sort') ?? 'updated') as SortKey
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? 1))

  // ── Update URL helper ──
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === '') {
          params.delete(key)
        } else {
          params.set(key, val)
        }
      })
      // Reset page unless explicitly setting it
      if (!('page' in updates)) params.delete('page')
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  // ── Filter handler ──
  const handleFilterChange = useCallback(
    (updates: Partial<QPUFiltersValue>) => {
      const mapped: Record<string, string | null> = {}
      if ('architecture' in updates) mapped.architecture = updates.architecture ?? null
      if ('provider' in updates) mapped.provider = updates.provider ?? null
      if ('status' in updates) mapped.status = updates.status ?? null
      if ('minQubits' in updates) mapped.minQubits = (updates.minQubits ?? 0) > 0 ? String(updates.minQubits) : null
      if ('framework' in updates) mapped.framework = updates.framework ?? null
      if ('search' in updates) mapped.search = updates.search || null
      updateParams(mapped)
    },
    [updateParams],
  )

  // ── Provider lookup map ──
  const providerMap = useMemo(
    () => Object.fromEntries(providers.map(p => [p.id, p.shortName])),
    [providers],
  )

  // ── Filtered QPUs ──
  const filtered = useMemo(() => {
    return qpus.filter(qpu => {
      if (architecture && qpu.architecture !== architecture) return false
      if (provider && qpu.providerId !== provider) return false
      if (status && qpu.status !== status) return false
      if (minQubits > 0 && (qpu.physicalQubits === null || qpu.physicalQubits < minQubits)) return false
      if (framework && !qpu.frameworks.includes(framework)) return false
      if (search) {
        const q = search.toLowerCase()
        const hit =
          qpu.name.toLowerCase().includes(q) ||
          qpu.providerId.toLowerCase().includes(q) ||
          (qpu.description?.toLowerCase().includes(q) ?? false)
        if (!hit) return false
      }
      return true
    })
  }, [qpus, architecture, provider, status, minQubits, framework, search])

  // ── Sorted QPUs ──
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'qubits':
          return (b.physicalQubits ?? -1) - (a.physicalQubits ?? -1)
        case 'provider':
          return a.providerId.localeCompare(b.providerId)
        case 'architecture':
          return a.architecture.localeCompare(b.architecture)
        case 'availability':
          return a.status.localeCompare(b.status)
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })
  }, [filtered, sort])

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // ── Compare tray ──
  const compareTray = useCompareTray()

  // ── Active filters for chips ──
  type FilterChip = { key: string; label: string; onRemove: () => void }
  const activeFilters: FilterChip[] = [
    architecture
      ? { key: 'architecture', label: architectureLabel(architecture), onRemove: () => updateParams({ architecture: null }) }
      : null,
    provider
      ? { key: 'provider', label: providerMap[provider] ?? provider, onRemove: () => updateParams({ provider: null }) }
      : null,
    status
      ? { key: 'status', label: statusLabel(status), onRemove: () => updateParams({ status: null }) }
      : null,
    minQubits > 0
      ? { key: 'minQubits', label: `≥${minQubits} qubits`, onRemove: () => updateParams({ minQubits: null }) }
      : null,
    framework
      ? { key: 'framework', label: framework, onRemove: () => updateParams({ framework: null }) }
      : null,
    search
      ? { key: 'search', label: `"${search}"`, onRemove: () => updateParams({ search: null }) }
      : null,
  ].filter((f): f is FilterChip => f !== null)

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (view !== 'table') params.set('view', view)
    if (sort !== 'updated') params.set('sort', sort)
    router.push(params.toString() ? `?${params.toString()}` : window.location.pathname, { scroll: false })
  }

  const frameworks = useMemo(() => getAllFrameworks(qpus), [qpus])

  const filterValue: QPUFiltersValue = { architecture, provider, status, minQubits, framework, search }

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[var(--color-text-primary)] mb-2">Quantum Processing Units</h1>
            <p className="text-[var(--color-text-secondary)] text-sm max-w-xl">
              Explore quantum processors across architectures, manufacturers, cloud platforms, and access models.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span
              className="inline-flex items-center text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-panel)] border border-[var(--color-border)] px-3 py-1.5 rounded-full"
              aria-live="polite"
              aria-label={`${filtered.length} processors match current filters`}
            >
              {filtered.length} processor{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] mb-3">
          <QPUFilters
            value={filterValue}
            providers={providers}
            frameworks={frameworks}
            onChange={handleFilterChange}
          />
        </div>

        {/* ── Active Filter Chips ── */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4" aria-label="Active filters">
            {activeFilters.map(filter => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.onRemove}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-[rgba(34,211,238,0.25)] bg-[var(--color-accent-dim)] text-[var(--color-accent)] hover:bg-[rgba(34,211,238,0.2)] transition-colors"
                aria-label={`Remove ${filter.label} filter`}
              >
                {filter.label}
                <X size={10} aria-hidden="true" />
              </button>
            ))}
            {activeFilters.length > 1 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* ── Controls Row ── */}
        <div className="flex items-center justify-between mb-4 gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-0.5" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => updateParams({ view: null })}
              aria-pressed={view === 'table'}
              aria-label="Table view"
              className={cn(
                'flex items-center justify-center w-8 h-7 rounded-[var(--radius-sm)] transition-colors',
                view === 'table'
                  ? 'bg-[var(--color-bg-overlay)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              )}
            >
              <LayoutList size={14} />
            </button>
            <button
              type="button"
              onClick={() => updateParams({ view: 'cards' })}
              aria-pressed={view === 'cards'}
              aria-label="Card view"
              className={cn(
                'flex items-center justify-center w-8 h-7 rounded-[var(--radius-sm)] transition-colors',
                view === 'cards'
                  ? 'bg-[var(--color-bg-overlay)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              )}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="qpu-sort" className="text-xs text-[var(--color-text-muted)] sr-only">Sort by</label>
            <select
              id="qpu-sort"
              value={sort}
              onChange={e => updateParams({ sort: e.target.value })}
              className="h-8 px-2.5 pr-7 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-panel)] border border-[var(--color-border)] text-[var(--color-text-secondary)] appearance-none cursor-pointer focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2366717F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 6px center',
              }}
              aria-label="Sort processors by"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Content Area ── */}
        {paginated.length === 0 ? (
          <EmptyState
            title="No QPUs match your filters"
            description="Try adjusting the architecture, provider, or status filter. You can also clear all active filters."
            action={{ label: 'Clear filters', onClick: clearAllFilters }}
          />
        ) : view === 'table' ? (
          <QPUTable
            qpus={paginated}
            providerMap={providerMap}
            compareTray={compareTray}
            sort={sort}
            onSort={key => updateParams({ sort: key })}
            onRowClick={slug => router.push(`/qpus/${slug}`)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginated.map(qpu => (
              <QPUCard
                key={qpu.id}
                qpu={qpu}
                providerName={providerMap[qpu.providerId]}
                showCompare
                isInCompareTray={compareTray.has(qpu.id)}
                onCompare={slug => {
                  if (compareTray.has(qpu.id)) compareTray.remove(qpu.id)
                  else if (!compareTray.isFull) compareTray.add(qpu.id)
                }}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={p => updateParams({ page: String(p) })}
          />
        )}
      </div>

      {/* ── Compare Tray (fixed bottom) ── */}
      <CompareTray />
    </>
  )
}

// ── Table View ────────────────────────────────────────────────────────────────

interface QPUTableProps {
  qpus: QPU[]
  providerMap: Record<string, string>
  compareTray: ReturnType<typeof useCompareTray>
  sort: SortKey
  onSort: (key: SortKey) => void
  onRowClick: (slug: string) => void
}

function SortIcon({ col, active, dir }: { col: string; active: boolean; dir?: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={11} className="text-[var(--color-text-faint)]" />
  return dir === 'asc'
    ? <ArrowUp size={11} className="text-[var(--color-accent)]" />
    : <ArrowDown size={11} className="text-[var(--color-accent)]" />
}

const COL_SORT_MAP: Partial<Record<string, SortKey>> = {
  processor: 'updated',
  qubits: 'qubits',
  provider: 'provider',
  architecture: 'architecture',
  status: 'availability',
}

function QPUTable({ qpus, providerMap, compareTray, sort, onSort, onRowClick }: QPUTableProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden overflow-x-auto">
      <table className="w-full text-sm min-w-[800px]" role="table">
        <thead>
          <tr
            role="row"
            className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]"
          >
            {/* Compare checkbox */}
            <th scope="col" className="w-10 px-3 py-2.5 text-left">
              <span className="sr-only">Compare</span>
            </th>
            {/* Processor */}
            <th scope="col" className="px-4 py-2.5 text-left">
              <button
                type="button"
                onClick={() => onSort('updated')}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                Processor
                <SortIcon col="processor" active={sort === 'updated'} dir="desc" />
              </button>
            </th>
            {/* Provider */}
            <th scope="col" className="px-4 py-2.5 text-left">
              <button
                type="button"
                onClick={() => onSort('provider')}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                Provider
                <SortIcon col="provider" active={sort === 'provider'} dir="asc" />
              </button>
            </th>
            {/* Architecture */}
            <th scope="col" className="px-4 py-2.5 text-left">
              <button
                type="button"
                onClick={() => onSort('architecture')}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                Architecture
                <SortIcon col="architecture" active={sort === 'architecture'} dir="asc" />
              </button>
            </th>
            {/* Qubits */}
            <th scope="col" className="px-4 py-2.5 text-left">
              <button
                type="button"
                onClick={() => onSort('qubits')}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                Qubits
                <SortIcon col="qubits" active={sort === 'qubits'} dir="desc" />
              </button>
            </th>
            {/* Connectivity */}
            <th scope="col" className="px-4 py-2.5 text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">Connectivity</span>
            </th>
            {/* Access */}
            <th scope="col" className="px-4 py-2.5 text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">Access</span>
            </th>
            {/* Status */}
            <th scope="col" className="px-4 py-2.5 text-left">
              <button
                type="button"
                onClick={() => onSort('availability')}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                Status
                <SortIcon col="status" active={sort === 'availability'} dir="asc" />
              </button>
            </th>
            {/* Actions */}
            <th scope="col" className="px-4 py-2.5 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {qpus.map(qpu => {
            const inTray = compareTray.has(qpu.id)
            const connectivity = qpu.connectivity?.topology ?? '—'

            return (
              <tr
                key={qpu.id}
                role="row"
                onClick={() => onRowClick(qpu.slug)}
                className="border-b border-[var(--color-border-subtle)] last:border-none hover:bg-[var(--color-bg-raised)] transition-colors cursor-pointer"
              >
                {/* Compare checkbox */}
                <td
                  role="cell"
                  className="px-3 py-3 w-10"
                  onClick={e => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={inTray}
                    onChange={() => {
                      if (inTray) compareTray.remove(qpu.id)
                      else if (!compareTray.isFull) compareTray.add(qpu.id)
                    }}
                    aria-label={`Add ${qpu.name} to comparison`}
                    className="w-3.5 h-3.5 rounded accent-[var(--color-accent)] cursor-pointer"
                  />
                </td>

                {/* Processor */}
                <td role="cell" className="px-4 py-3">
                  <div>
                    <span className="font-medium text-[var(--color-text-primary)] text-sm leading-snug">
                      {qpu.name}
                    </span>
                    <code className="block text-[10px] text-[var(--color-text-faint)] font-mono mt-0.5">
                      {qpu.id}
                    </code>
                  </div>
                </td>

                {/* Provider */}
                <td role="cell" className="px-4 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                  {providerMap[qpu.providerId] ?? qpu.providerId}
                </td>

                {/* Architecture */}
                <td role="cell" className="px-4 py-3">
                  <ArchitectureBadge architecture={qpu.architecture} size="sm" />
                </td>

                {/* Qubits */}
                <td role="cell" className="px-4 py-3">
                  <span className="font-mono text-sm text-[var(--color-text-primary)]">
                    {formatQubits(qpu.physicalQubits)}
                  </span>
                </td>

                {/* Connectivity */}
                <td role="cell" className="px-4 py-3 text-sm text-[var(--color-text-secondary)] max-w-[120px] truncate">
                  {connectivity}
                </td>

                {/* Access platforms */}
                <td role="cell" className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[160px]">
                    {qpu.cloudPlatforms.slice(0, 2).map(p => (
                      <span
                        key={p}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-mono"
                      >
                        {p}
                      </span>
                    ))}
                    {qpu.cloudPlatforms.length > 2 && (
                      <span className="text-[10px] px-1 py-0.5 text-[var(--color-text-faint)]">
                        +{qpu.cloudPlatforms.length - 2}
                      </span>
                    )}
                    {qpu.cloudPlatforms.length === 0 && (
                      <span className="text-[11px] text-[var(--color-text-faint)]">—</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td role="cell" className="px-4 py-3">
                  <StatusBadge status={qpu.status} size="sm" />
                </td>

                {/* Actions */}
                <td
                  role="cell"
                  className="px-4 py-3 text-right"
                  onClick={e => e.stopPropagation()}
                >
                  <Link
                    href={`/qpus/${qpu.slug}`}
                    className="text-xs font-medium text-[var(--color-accent)] hover:underline underline-offset-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 rounded-sm"
                    aria-label={`View ${qpu.name} details`}
                  >
                    View →
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages: (number | '…')[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('…')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-8"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 px-3 text-xs font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-overlay)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-[var(--color-text-faint)]">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              'w-8 h-8 text-xs font-medium rounded-[var(--radius-md)] border transition-colors',
              p === currentPage
                ? 'bg-[var(--color-accent)] text-[var(--color-bg-base)] border-transparent'
                : 'border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-overlay)]',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 px-3 text-xs font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-overlay)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}
