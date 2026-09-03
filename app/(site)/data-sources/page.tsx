import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'QPU.co Data Sources',
  description:
    'Primary sources used for QPU specifications, benchmark data, availability information, and provider profiles on QPU.co.',
}

const SOURCE_GROUPS = [
  {
    rank: 1,
    title: 'Manufacturer Technical Documentation',
    priority: 'Highest Priority',
    priorityColor: '#22D3EE',
    sources: [
      { name: 'IBM Quantum technical documentation', url: 'https://docs.quantum.ibm.com/' },
      { name: 'IonQ technical specifications', url: 'https://docs.ionq.com/' },
      { name: 'Quantinuum system card', url: 'https://docs.quantinuum.com/' },
      { name: 'Rigetti QPU documentation', url: 'https://docs.rigetti.com/' },
      { name: 'IQM technical sheets', url: 'https://docs.meetiqm.com/' },
      { name: 'QuEra device specifications', url: 'https://bloqade.quera.com/' },
      { name: 'PASQAL technical documentation', url: 'https://docs.pasqal.com/' },
      { name: 'D-Wave system documentation', url: 'https://docs.dwavesys.com/' },
      { name: 'AQT documentation', url: 'https://www.aqt.eu/documentation/' },
    ],
    note: null,
  },
  {
    rank: 2,
    title: 'Cloud Platform Documentation',
    priority: 'High Priority',
    priorityColor: '#9AA4B2',
    sources: [
      { name: 'Amazon Braket device documentation', url: 'https://docs.aws.amazon.com/braket/' },
      { name: 'Azure Quantum provider documentation', url: 'https://learn.microsoft.com/azure/quantum/' },
      { name: 'IBM Quantum Experience documentation', url: 'https://docs.quantum.ibm.com/' },
    ],
    note: null,
  },
  {
    rank: 3,
    title: 'Peer-Reviewed Research',
    priority: 'High Priority (dated)',
    priorityColor: '#9AA4B2',
    sources: [
      { name: 'Published benchmark papers', url: null },
      { name: 'Architecture research papers', url: null },
      { name: 'Performance characterization studies', url: null },
    ],
    note: 'Research papers are dated and may not reflect current hardware. QPU.co notes publication dates and flags when specifications may have been superseded by newer generations.',
  },
  {
    rank: 4,
    title: 'Official Announcements',
    priority: 'Medium Priority',
    priorityColor: '#66717F',
    sources: [
      { name: 'Company press releases', url: null },
      { name: 'Conference presentations (IEEE Quantum Week, APS, etc.)', url: null },
      { name: 'Blog posts from official company sources', url: null },
    ],
    note: null,
  },
  {
    rank: 5,
    title: 'Secondary Sources',
    priority: 'Lowest Priority — used sparingly',
    priorityColor: '#3D4754',
    sources: [
      { name: 'Technology journalism', url: null },
      { name: 'Industry reports', url: null },
    ],
    note: 'Secondary sources are only cited when primary sources are unavailable. Always clearly noted as such. Numeric specifications from secondary sources are flagged as unverified.',
  },
]

export default function DataSourcesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {/* Header */}
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'data-sources' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 14 }}>
            Data Sources
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '58ch' }}>
            Primary sources used for QPU specifications, benchmark data, availability, and provider profiles.
            Sources are listed in priority order; higher-priority sources take precedence when data conflicts.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px' }}>

        {/* Source groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SOURCE_GROUPS.map(group => (
            <div
              key={group.rank}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-panel)',
                overflow: 'hidden',
              }}
            >
              {/* Group header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--color-border)',
                  background: 'var(--color-bg-raised)',
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono), monospace',
                    color: 'var(--color-text-muted)',
                    flexShrink: 0,
                  }}
                >
                  {group.rank}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {group.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-mono), monospace',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: group.priorityColor,
                      }}
                    >
                      {group.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sources list */}
              <div style={{ padding: '12px 20px 16px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {group.sources.map(src => (
                    <li key={src.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: 'var(--color-text-faint)',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      />
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 13,
                            color: 'var(--color-accent)',
                            textDecoration: 'none',
                          }}
                        >
                          {src.name}
                        </a>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                          {src.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {group.note && (
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-muted)',
                      margin: '12px 0 0',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg-raised)',
                      border: '1px solid var(--color-border-subtle)',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}
                  >
                    {group.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Correction CTA */}
        <div
          style={{
            marginTop: 48,
            padding: '20px 22px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 4,
              }}
            >
              Found an error or a better source?
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
              We review all data correction requests and update records when supported by primary documentation.
            </p>
          </div>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-raised)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Submit a correction →
          </Link>
        </div>

        {/* Full methodology link */}
        <p style={{ marginTop: 28, fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          For full details on how we verify and update data, read our{' '}
          <Link
            href="/methodology"
            style={{ color: 'var(--color-accent)', textDecoration: 'underline', textDecorationColor: 'rgba(34,211,238,0.4)' }}
          >
            data methodology
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
