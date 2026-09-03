import * as React from 'react'
import Link from 'next/link'
import type { QPU, CloudPlatform, QPUStatus } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { formatDate } from '@/lib/utils'

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  qpus: QPU[]
  platforms: CloudPlatform[]
}

// ── Status ordering for sort ───────────────────────────────────────────────────

const STATUS_ORDER: Record<QPUStatus, number> = {
  public: 0,
  cloud: 1,
  reservation: 2,
  research: 3,
  private: 4,
  announced: 5,
  offline: 6,
  retired: 7,
}

// ── Status legend config ───────────────────────────────────────────────────────

interface StatusLegendItem {
  status: QPUStatus
  dot: string
  description: string
}

const STATUS_LEGEND: StatusLegendItem[] = [
  {
    status: 'public',
    dot: '#4ADE80',
    description: 'Available for general use via cloud platform or direct access',
  },
  {
    status: 'cloud',
    dot: '#22D3EE',
    description: 'Available through cloud provider; may require account creation',
  },
  {
    status: 'reservation',
    dot: '#F59E0B',
    description: 'Available by advance reservation or time-slot booking',
  },
  {
    status: 'private',
    dot: '#66717F',
    description: 'Restricted access; contact provider to apply',
  },
  {
    status: 'research',
    dot: '#818CF8',
    description: 'Available to qualified research institutions',
  },
  {
    status: 'announced',
    dot: '#F59E0B',
    description: 'Hardware announced; access not yet available',
  },
  {
    status: 'offline',
    dot: '#F87171',
    description: 'No longer available or temporarily offline',
  },
  {
    status: 'retired',
    dot: '#3D4754',
    description: 'Permanently retired from service',
  },
]

// ── Summary metric card ────────────────────────────────────────────────────────

function SummaryCard({
  count,
  label,
  color,
}: {
  count: number
  label: string
  color?: string
}) {
  return (
    <div
      style={{
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 700,
          lineHeight: 1,
          color: color ?? 'var(--color-text-primary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {count}
      </span>
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ── Platform card ──────────────────────────────────────────────────────────────

function PlatformCard({
  platform,
  qpuCount,
  architectures,
}: {
  platform: CloudPlatform
  qpuCount: number
  architectures: string[]
}) {
  return (
    <div
      style={{
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <h3
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {platform.name}
        </h3>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-accent)',
            background: 'var(--color-accent-dim)',
            border: '1px solid rgba(34,211,238,0.2)',
            borderRadius: '9999px',
            padding: '1px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {qpuCount} QPU{qpuCount !== 1 ? 's' : ''}
        </span>
      </div>

      {architectures.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Architectures
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {architectures.map((arch) => (
              <span
                key={arch}
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-bg-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1px 6px',
                }}
              >
                {arch}
              </span>
            ))}
          </div>
        </div>
      )}

      <a
        href={platform.website}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-accent)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        View platform →
      </a>
    </div>
  )
}

// ── Main component (server) ────────────────────────────────────────────────────

export default function AvailabilityDashboard({ qpus, platforms }: Props) {
  const updatedAt = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Sort QPUs by status priority, then provider name
  const sortedQpus = [...qpus].sort((a, b) => {
    const statusDiff = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
    if (statusDiff !== 0) return statusDiff
    return a.providerId.localeCompare(b.providerId)
  })

  // Summary counts
  const publicCloudCount = qpus.filter(
    (q) => q.status === 'public' || q.status === 'cloud'
  ).length
  const reservationCount = qpus.filter((q) => q.status === 'reservation').length
  const privateResearchCount = qpus.filter(
    (q) => q.status === 'private' || q.status === 'research'
  ).length
  const announcedCount = qpus.filter((q) => q.status === 'announced').length

  // Platform stats
  const platformStats = platforms.map((platform) => {
    const platformQpus = qpus.filter((q) => q.cloudPlatforms.includes(platform.id))
    const archs = Array.from(new Set(platformQpus.map((q) => q.architecture)))
    return { platform, qpuCount: platformQpus.length, architectures: archs }
  })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <div>
          <div style={{ marginBottom: 4 }}>
            <span className="eyebrow">Live</span>
          </div>
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 8 }}>
            QPU Availability
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '56ch',
              lineHeight: 1.65,
            }}
          >
            Current access status for all tracked quantum processors across providers and
            cloud platforms.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
            }}
          >
            Updated
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            {updatedAt}
          </span>
        </div>
      </div>

      {/* Status legend */}
      <div
        style={{
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: 32,
        }}
        aria-label="Availability status legend"
      >
        <p
          style={{
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-muted)',
            marginBottom: 12,
          }}
        >
          Status legend
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 24px',
          }}
        >
          {STATUS_LEGEND.map((item) => (
            <div
              key={item.status}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 200 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: item.dot,
                  flexShrink: 0,
                  marginTop: 4,
                }}
                aria-hidden="true"
              />
              <div>
                <StatusBadge status={item.status} size="sm" />
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: 2,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}
        aria-label="Availability summary"
      >
        <SummaryCard
          count={publicCloudCount}
          label="Public / Cloud Access"
          color="var(--color-success)"
        />
        <SummaryCard
          count={reservationCount}
          label="Reservation Only"
          color="var(--color-warning)"
        />
        <SummaryCard
          count={privateResearchCount}
          label="Private / Research"
          color="var(--color-text-muted)"
        />
        <SummaryCard
          count={announcedCount}
          label="Announced"
          color="var(--color-accent)"
        />
      </div>

      {/* Availability table */}
      <div style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 4,
          }}
        >
          All QPUs
        </h2>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            marginBottom: 16,
          }}
        >
          Sorted by access availability (most accessible first).
        </p>
      </div>

      <div
        style={{
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            className="data-table"
            style={{ width: '100%', borderCollapse: 'collapse' }}
            aria-label="QPU availability status"
          >
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>QPU</th>
                <th style={{ textAlign: 'left' }}>Provider</th>
                <th style={{ textAlign: 'left' }}>Architecture</th>
                <th style={{ textAlign: 'left' }}>Platform</th>
                <th style={{ textAlign: 'left' }}>Region</th>
                <th style={{ textAlign: 'left' }}>Status</th>
                <th style={{ textAlign: 'left' }}>Last Verified</th>
              </tr>
            </thead>
            <tbody>
              {sortedQpus.map((qpu) => {
                const primaryPlatformId = qpu.cloudPlatforms[0]
                const primaryPlatform = platforms.find((p) => p.id === primaryPlatformId)
                const platformDisplay = primaryPlatform?.name ?? (primaryPlatformId || 'Direct')
                const region = qpu.regions[0] ?? null

                return (
                  <tr key={qpu.id}>
                    <td>
                      <Link
                        href={`/qpus/${qpu.slug}`}
                        style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
                        className="hover:text-[var(--color-accent)] transition-colors"
                      >
                        {qpu.name}
                      </Link>
                      {qpu.physicalQubits != null && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {qpu.physicalQubits.toLocaleString()} qubits
                        </div>
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/providers/${qpu.providerId}`}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                        className="hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {qpu.providerId
                          .split('-')
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}
                      </Link>
                    </td>
                    <td>
                      <ArchitectureBadge architecture={qpu.architecture} />
                    </td>
                    <td
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {platformDisplay}
                      {qpu.cloudPlatforms.length > 1 && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            marginLeft: 4,
                          }}
                        >
                          +{qpu.cloudPlatforms.length - 1}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {region ?? '—'}
                    </td>
                    <td>
                      <StatusBadge status={qpu.status} />
                    </td>
                    <td
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {qpu.verifiedAt ? formatDate(qpu.verifiedAt) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* By platform section */}
      <section style={{ marginTop: 56 }}>
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 8,
          }}
        >
          Access by Platform
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            marginBottom: 20,
          }}
        >
          Cloud platforms providing access to multiple QPU hardware types.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {platformStats.map(({ platform, qpuCount, architectures }) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              qpuCount={qpuCount}
              architectures={architectures}
            />
          ))}
        </div>
      </section>

      {/* Footer notes */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: 24,
          marginTop: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Availability information is sourced from provider and cloud platform documentation.
          Access terms, waitlists, and availability can change without notice. Always verify
          current status before planning workloads.
        </p>
        <p style={{ fontSize: '0.8125rem' }}>
          <Link
            href="/contact"
            style={{ color: 'var(--color-accent)' }}
            className="hover:underline"
          >
            See something out of date? Report outdated data →
          </Link>
        </p>
      </div>
    </div>
  )
}
