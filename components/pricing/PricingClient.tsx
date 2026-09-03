'use client'

import * as React from 'react'
import Link from 'next/link'
import type { QPU, Provider, CloudPlatform, AccessModel } from '@/types'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  qpus: QPU[]
  providers: Provider[]
  platforms: CloudPlatform[]
}

// ── Constants ──────────────────────────────────────────────────────────────────

const ACCESS_MODEL_LABELS: Record<AccessModel, string> = {
  'pay-per-shot': 'Per-Shot',
  'pay-per-task': 'Per-Task',
  'reservation': 'Reservation',
  'subscription': 'Subscription',
  'enterprise': 'Enterprise',
  'research': 'Research',
  'open-access': 'Open Access',
}

interface ModelInfo {
  how: string
  who: string
  best: string
}

const ACCESS_MODEL_DESCRIPTIONS: Partial<Record<AccessModel, ModelInfo>> = {
  'pay-per-shot': {
    how: 'Charged per quantum circuit execution (shot). Total cost = shots × price per shot.',
    who: 'Amazon Braket, Azure Quantum for some hardware.',
    best: 'Exploratory work, algorithm testing with variable circuit counts.',
  },
  'pay-per-task': {
    how: 'Charged per submitted task/job, regardless of shot count (up to a limit). Some providers bundle shots per task.',
    who: 'Amazon Braket (task fee component), some IQM configurations.',
    best: 'Workloads with consistent circuit patterns and known shot counts.',
  },
  'reservation': {
    how: 'Reserve time blocks on specific hardware. Predictable cost, exclusive access during reserved window.',
    who: 'Quantinuum H-Series, IBM Quantum dedicated reservations.',
    best: 'Production workloads, large circuit depths, time-sensitive research requiring predictable access.',
  },
  'subscription': {
    how: 'Monthly or annual subscription with included credits or QPU time. Research programs often offer free access.',
    who: 'IBM Quantum Network, D-Wave Leap, academic programs.',
    best: 'Regular users needing predictable monthly budgets and consistent access.',
  },
}

function accessModelBadgeVariant(model: AccessModel): 'accent' | 'success' | 'warning' | 'muted' | 'default' {
  switch (model) {
    case 'open-access': return 'success'
    case 'pay-per-shot':
    case 'pay-per-task': return 'accent'
    case 'reservation': return 'warning'
    case 'subscription': return 'default'
    case 'enterprise':
    case 'research': return 'muted'
    default: return 'default'
  }
}

// ── Model explainer card ───────────────────────────────────────────────────────

function ModelCard({ model }: { model: AccessModel }) {
  const info = ACCESS_MODEL_DESCRIPTIONS[model]
  if (!info) return null
  const label = ACCESS_MODEL_LABELS[model]

  return (
    <div
      style={{
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <Badge variant={accessModelBadgeVariant(model)} size="md">{label}</Badge>
      </div>
      {(
        [
          { label: 'How it works', text: info.how },
          { label: 'Who uses it', text: info.who },
          { label: 'Best for', text: info.best },
        ] as const
      ).map(({ label: lbl, text }) => (
        <div key={lbl}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
            }}
          >
            {lbl}:{' '}
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            {text}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Platform display name ──────────────────────────────────────────────────────

function formatPlatformName(platformId: string | undefined, platforms: CloudPlatform[]): string {
  if (!platformId) return 'Direct'
  const p = platforms.find((x) => x.id === platformId)
  return p?.name ?? platformId
}

// ── Pricing cell ───────────────────────────────────────────────────────────────

function PriceCell({ qpu }: { qpu: QPU }) {
  const p = qpu.pricing
  if (!p) return <span style={{ color: 'var(--color-text-muted)' }}>—</span>

  if (p.model === 'open-access') {
    return (
      <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem' }}>
        Free tier
      </span>
    )
  }

  const hasExplicitPrice = p.pricePerShot != null || p.pricePerTask != null

  if (!hasExplicitPrice) {
    return (
      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
        Contact provider
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {p.pricePerShot != null && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-primary)',
          }}
        >
          ${p.pricePerShot.toFixed(5)}/shot
        </span>
      )}
      {p.pricePerTask != null && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          ${p.pricePerTask.toFixed(5)}/task
        </span>
      )}
    </div>
  )
}

// ── Research program card ──────────────────────────────────────────────────────

interface ProgramCardProps {
  name: string
  badge: string
  badgeVariant: 'success' | 'muted'
  description: string
  link: string
}

function ProgramCard({ name, badge, badgeVariant, description, link }: ProgramCardProps) {
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
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 10,
          gap: 8,
        }}
      >
        <h3
          style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}
        >
          {name}
        </h3>
        <Badge variant={badgeVariant} size="sm">
          {badge}
        </Badge>
      </div>
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        {description}
      </p>
      <a
        href={link}
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
        Learn more →
      </a>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PricingClient({ qpus, providers, platforms }: Props) {
  const [providerFilter, setProviderFilter] = React.useState<string>('all')
  const [platformFilter, setPlatformFilter] = React.useState<string>('all')
  const [modelFilter, setModelFilter] = React.useState<string>('all')

  const providerOptions = [
    { value: 'all', label: 'All providers' },
    ...providers.map((p) => ({ value: p.id, label: p.name })),
  ]

  const platformOptions = [
    { value: 'all', label: 'All platforms' },
    ...platforms.map((p) => ({ value: p.id, label: p.name })),
    { value: 'direct', label: 'Direct' },
  ]

  const modelOptions = [
    { value: 'all', label: 'All pricing models' },
    ...Object.entries(ACCESS_MODEL_LABELS).map(([k, v]) => ({ value: k, label: v })),
  ]

  const filteredQpus = qpus.filter((qpu) => {
    if (providerFilter !== 'all' && qpu.providerId !== providerFilter) return false
    if (platformFilter !== 'all') {
      if (platformFilter === 'direct') {
        if (qpu.cloudPlatforms.length > 0) return false
      } else {
        if (!qpu.cloudPlatforms.includes(platformFilter)) return false
      }
    }
    if (modelFilter !== 'all') {
      if (!qpu.accessModels.includes(modelFilter as AccessModel)) return false
    }
    return true
  })

  const hasActiveFilters =
    providerFilter !== 'all' || platformFilter !== 'all' || modelFilter !== 'all'

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 4 }}>
          <span className="eyebrow">Intelligence</span>
        </div>
        <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 12 }}>
          Quantum Computing Pricing
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '60ch',
            lineHeight: 1.65,
          }}
        >
          Compare access costs across providers and cloud platforms. Pricing models vary significantly
          by hardware type, access method, and workload requirements.
        </p>
      </div>

      {/* Accuracy disclaimer */}
      <div
        role="note"
        aria-label="Pricing accuracy disclaimer"
        style={{
          background: 'rgba(34,211,238,0.05)',
          border: '1px solid rgba(34,211,238,0.18)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          marginBottom: 40,
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--color-accent)' }}>Pricing accuracy:</strong>{' '}
        QPU.co only displays publicly documented pricing. Pricing changes frequently. Always verify
        current rates with the provider before committing to workloads.
      </div>

      {/* Model explainer grid */}
      <div style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 16,
          }}
        >
          Pricing Models Explained
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <ModelCard model="pay-per-shot" />
          <ModelCard model="pay-per-task" />
          <ModelCard model="reservation" />
          <ModelCard model="subscription" />
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
          padding: '16px',
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ minWidth: 180 }}>
          <Select
            label="Provider"
            options={providerOptions}
            value={providerFilter}
            onChange={setProviderFilter}
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <Select
            label="Platform"
            options={platformOptions}
            value={platformFilter}
            onChange={setPlatformFilter}
          />
        </div>
        <div style={{ minWidth: 200 }}>
          <Select
            label="Pricing model"
            options={modelOptions}
            value={modelFilter}
            onChange={setModelFilter}
          />
        </div>
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setProviderFilter('all')
                setPlatformFilter('all')
                setModelFilter('all')
              }}
              style={{
                height: 36,
                padding: '0 12px',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
        Showing {filteredQpus.length} of {qpus.length} QPUs
      </p>

      {/* Pricing table */}
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
            aria-label="QPU pricing comparison"
          >
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>QPU</th>
                <th style={{ textAlign: 'left' }}>Provider</th>
                <th style={{ textAlign: 'left' }}>Platform</th>
                <th style={{ textAlign: 'left' }}>Pricing Model</th>
                <th style={{ textAlign: 'left' }}>Price</th>
                <th style={{ textAlign: 'left' }}>Notes</th>
                <th style={{ textAlign: 'left' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredQpus.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: '32px 16px',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    No QPUs match the current filters.
                  </td>
                </tr>
              ) : (
                filteredQpus.map((qpu) => {
                  const provider = providers.find((p) => p.id === qpu.providerId)
                  const primaryPlatformId = qpu.cloudPlatforms[0]
                  const platformDisplayName = formatPlatformName(primaryPlatformId, platforms)
                  const primaryModel = qpu.pricing?.model ?? qpu.accessModels[0]

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
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {qpu.physicalQubits.toLocaleString()} qubits
                          </div>
                        )}
                      </td>
                      <td>
                        {provider ? (
                          <Link
                            href={`/providers/${provider.slug}`}
                            style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}
                            className="hover:text-[var(--color-text-primary)] transition-colors"
                          >
                            {provider.shortName}
                          </Link>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        {platformDisplayName}
                        {qpu.cloudPlatforms.length > 1 && (
                          <span
                            style={{
                              color: 'var(--color-text-muted)',
                              fontSize: '0.75rem',
                              marginLeft: 4,
                            }}
                          >
                            +{qpu.cloudPlatforms.length - 1}
                          </span>
                        )}
                      </td>
                      <td>
                        {primaryModel && (
                          <Badge variant={accessModelBadgeVariant(primaryModel)} size="sm">
                            {ACCESS_MODEL_LABELS[primaryModel] ?? primaryModel}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <PriceCell qpu={qpu} />
                      </td>
                      <td
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          maxWidth: 220,
                        }}
                      >
                        {qpu.pricing?.notes ? (
                          <span title={qpu.pricing.notes}>
                            {qpu.pricing.notes.length > 80
                              ? qpu.pricing.notes.slice(0, 80) + '…'
                              : qpu.pricing.notes}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        {qpu.pricing?.source ? (
                          <a
                            href={qpu.pricing.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                            className="hover:text-[var(--color-text-secondary)] transition-colors"
                          >
                            {qpu.pricing.source.publisher}
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 48 }}>
        Enterprise, research, and reserved-capacity pricing typically requires direct provider
        engagement. Prices shown are indicative and may not reflect current rates.
      </p>

      {/* Research & free access section */}
      <section>
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 8,
          }}
        >
          Research and Free Access Programs
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            marginBottom: 20,
          }}
        >
          Several providers offer subsidized or free access for academic research and learning.
          Details change frequently — see provider documentation for current eligibility and terms.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <ProgramCard
            name="IBM Quantum Network"
            badge="Research / Free tier"
            badgeVariant="success"
            description="IBM Quantum Open Plan provides free access to a subset of quantum systems with fair-share queuing. The IBM Quantum Network offers additional access for research institutions and enterprise members."
            link="https://quantum.ibm.com/network"
          />
          <ProgramCard
            name="Amazon Braket Free Tier"
            badge="Free tier"
            badgeVariant="success"
            description="AWS provides free simulator minutes per month for new Braket users. Hardware access is charged at standard rates. Braket notebooks and managed jobs have separate free tier allowances."
            link="https://aws.amazon.com/braket/pricing/"
          />
          <ProgramCard
            name="Azure Quantum Credits"
            badge="Free credits"
            badgeVariant="success"
            description="New Azure Quantum accounts receive free credits applicable to select hardware providers. Credits can be used across IonQ, Quantinuum, and Rigetti hardware within Azure Quantum."
            link="https://azure.microsoft.com/products/quantum"
          />
          <ProgramCard
            name="IonQ Academic Access"
            badge="Research"
            badgeVariant="muted"
            description="IonQ offers academic research access programs for universities and research institutions. Applications typically reviewed quarterly. Contact IonQ partnerships for eligibility."
            link="https://ionq.com/programs"
          />
          <ProgramCard
            name="Quantinuum Research Partnership"
            badge="Research"
            badgeVariant="muted"
            description="Quantinuum offers research partnerships providing H-Series hardware access for collaborative research. Applications subject to scientific review."
            link="https://www.quantinuum.com/partnerprogram"
          />
          <ProgramCard
            name="D-Wave Leap Free Tier"
            badge="Free tier"
            badgeVariant="success"
            description="D-Wave Leap provides a free developer tier with limited monthly QPU time on Advantage systems. Suitable for learning the annealing model and small optimization experiments."
            link="https://cloud.dwavesys.com/leap/"
          />
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Free tier and research program details change frequently. See provider documentation for
          current terms, eligibility, and application processes.
        </p>
      </section>
    </div>
  )
}
