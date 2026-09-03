'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Provider, QPU, ArchitectureType } from '@/types'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { Badge } from '@/components/ui/Badge'

interface ProviderListClientProps {
  providers: Provider[]
  qpus: QPU[]
}

const ARCH_FILTERS: { value: ArchitectureType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'superconducting', label: 'Superconducting' },
  { value: 'trapped-ion', label: 'Trapped Ion' },
  { value: 'neutral-atom', label: 'Neutral Atom' },
  { value: 'photonic', label: 'Photonic' },
  { value: 'quantum-annealing', label: 'Annealing' },
  { value: 'topological', label: 'Topological' },
]

const COUNTRY_LABELS: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  FI: 'Finland',
  FR: 'France',
  DE: 'Germany',
  GB: 'United Kingdom',
  JP: 'Japan',
  AU: 'Australia',
  CN: 'China',
}

function countryLabel(code: string): string {
  return COUNTRY_LABELS[code] ?? code
}

function cloudPlatformLabel(slug: string): string {
  const labels: Record<string, string> = {
    'aws-braket': 'AWS Braket',
    'azure-quantum': 'Azure Quantum',
    'ibm-quantum': 'IBM Quantum',
    'ionq-cloud': 'IonQ Cloud',
    'dwave-leap': 'D-Wave Leap',
    'quantinuum-nexus': 'Quantinuum Nexus',
    'google-cloud': 'Google Cloud',
  }
  return labels[slug] ?? slug
}

function statusVariant(status: Provider['status']): 'success' | 'muted' | 'warning' {
  if (status === 'active') return 'success'
  if (status === 'acquired') return 'warning'
  return 'muted'
}

function statusLabel(status: Provider['status']): string {
  const labels: Record<Provider['status'], string> = {
    active: 'Active',
    acquired: 'Acquired',
    defunct: 'Defunct',
    stealth: 'Stealth',
  }
  return labels[status]
}

const selectStyle: React.CSSProperties = {
  background: 'var(--color-bg-panel)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '7px 32px 7px 10px',
  fontSize: '13px',
  color: 'var(--color-text-secondary)',
  fontFamily: 'inherit',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2366717F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
}

export default function ProviderListClient({ providers, qpus }: ProviderListClientProps) {
  const [archFilter, setArchFilter] = useState<ArchitectureType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<Provider['status'] | 'all'>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  // Build unique countries list
  const countries = useMemo(() => {
    const set = new Set(providers.map(p => p.country))
    return Array.from(set).sort()
  }, [providers])

  // Build QPU count map per provider
  const qpuCountByProvider = useMemo(() => {
    const map: Record<string, number> = {}
    for (const qpu of qpus) {
      map[qpu.providerId] = (map[qpu.providerId] ?? 0) + 1
    }
    return map
  }, [qpus])

  // Build cloud platform map per provider
  const cloudsByProvider = useMemo(() => {
    const map: Record<string, Set<string>> = {}
    for (const qpu of qpus) {
      if (!map[qpu.providerId]) map[qpu.providerId] = new Set()
      for (const cp of qpu.cloudPlatforms) {
        map[qpu.providerId].add(cp)
      }
    }
    return map
  }, [qpus])

  const filtered = useMemo(() => {
    let results = [...providers]

    if (archFilter !== 'all') {
      results = results.filter(
        p =>
          p.primaryArchitecture === archFilter ||
          p.secondaryArchitectures.includes(archFilter)
      )
    }

    if (statusFilter !== 'all') {
      results = results.filter(p => p.status === statusFilter)
    }

    if (countryFilter !== 'all') {
      results = results.filter(p => p.country === countryFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q)
      )
    }

    return results
  }, [providers, archFilter, statusFilter, countryFilter, search])

  return (
    <div style={{ background: 'var(--color-bg-base)', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        className="grid-bg"
        style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '52px 0 40px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="flex items-baseline gap-3 mb-3">
            <h1 style={{ margin: 0 }}>Quantum Hardware Providers</h1>
            <span
              className="mono-label"
              style={{ color: 'var(--color-accent)', fontSize: '13px', letterSpacing: '0.04em', textTransform: 'none' }}
            >
              {providers.length} companies
            </span>
          </div>
          <p style={{ marginTop: 0, maxWidth: '60ch', color: 'var(--color-text-secondary)' }}>
            Quantum hardware is being developed by a small number of specialized companies, each
            pursuing different physical approaches to qubit implementation.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {/* Filter bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          {/* Architecture chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {ARCH_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setArchFilter(f.value as ArchitectureType | 'all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid',
                  transition: 'all 0.15s',
                  background:
                    archFilter === f.value
                      ? 'var(--color-accent-dim)'
                      : 'var(--color-bg-panel)',
                  borderColor:
                    archFilter === f.value
                      ? 'rgba(34,211,238,0.35)'
                      : 'var(--color-border)',
                  color:
                    archFilter === f.value
                      ? 'var(--color-accent)'
                      : 'var(--color-text-secondary)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 24,
              background: 'var(--color-border)',
              flexShrink: 0,
            }}
          />

          {/* Status select */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as Provider['status'] | 'all')}
            style={selectStyle}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="acquired">Acquired</option>
            <option value="defunct">Defunct</option>
            <option value="stealth">Stealth</option>
          </select>

          {/* Country select */}
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            style={selectStyle}
            aria-label="Filter by country"
          >
            <option value="all">All Countries</option>
            {countries.map(c => (
              <option key={c} value={c}>
                {countryLabel(c)}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="search"
            placeholder="Search providers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              ...selectStyle,
              backgroundImage: 'none',
              paddingRight: '10px',
              minWidth: 180,
            }}
            aria-label="Search providers"
          />

          {/* Result count */}
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
            {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'}
          </span>
        </div>

        {/* Provider grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              color: 'var(--color-text-muted)',
              fontSize: '14px',
            }}
          >
            No providers match the current filters.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '16px',
            }}
          >
            {filtered.map(provider => {
              const qpuCount = qpuCountByProvider[provider.id] ?? 0
              const clouds = Array.from(cloudsByProvider[provider.id] ?? [])

              return (
                <div
                  key={provider.id}
                  style={{
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'border-color 0.15s',
                  }}
                  className="provider-card"
                >
                  {/* Top: name, country, year */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <h2 style={{ fontSize: '1.0625rem', margin: 0, fontWeight: 600 }}>
                        {provider.name}
                      </h2>
                      <Badge variant={statusVariant(provider.status)} size="sm">
                        {statusLabel(provider.status)}
                      </Badge>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                      {countryLabel(provider.country)}
                      {provider.founded ? ` · Founded ${provider.founded}` : ''}
                    </p>
                  </div>

                  {/* Architecture badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <ArchitectureBadge architecture={provider.primaryArchitecture} size="sm" />
                    {provider.secondaryArchitectures.map(arch => (
                      <ArchitectureBadge key={arch} architecture={arch} size="sm" />
                    ))}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: 'none',
                    }}
                  >
                    {provider.description}
                  </p>

                  {/* Stats row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      paddingTop: 12,
                      borderTop: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <div>
                      <p className="mono-label" style={{ marginBottom: 2 }}>Processors</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                        {qpuCount} {qpuCount === 1 ? 'QPU' : 'QPUs'}
                      </p>
                    </div>
                    {clouds.length > 0 && (
                      <div style={{ minWidth: 0 }}>
                        <p className="mono-label" style={{ marginBottom: 2 }}>Cloud access</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {clouds.slice(0, 3).map(cp => (
                            <span
                              key={cp}
                              style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: 'var(--color-bg-raised)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {cloudPlatformLabel(cp)}
                            </span>
                          ))}
                          {clouds.length > 3 && (
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              +{clouds.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/providers/${provider.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-accent)',
                      textDecoration: 'none',
                      marginTop: 2,
                    }}
                  >
                    View Provider →
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
