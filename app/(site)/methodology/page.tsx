import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Separator } from '@/components/ui/Separator'

export const metadata: Metadata = {
  title: 'QPU.co Data Methodology',
  description:
    'How QPU.co collects, verifies, and maintains quantum hardware data. Source hierarchy, benchmark methodology, specification standards, and editorial independence.',
}

const DATA_STATUS_DEFINITIONS = [
  {
    label: 'Verified',
    color: '#4ADE80',
    bg: 'rgba(74,222,128,0.08)',
    description: 'Confirmed from a primary source within the past 6 months.',
  },
  {
    label: 'Unverified',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    description: 'Not yet confirmed from a primary source.',
  },
  {
    label: 'Disclosed',
    color: '#9AA4B2',
    bg: 'rgba(154,164,178,0.08)',
    description: 'Public information that may not have been independently reviewed.',
  },
  {
    label: 'Not publicly disclosed',
    color: '#66717F',
    bg: 'rgba(102,113,127,0.08)',
    description: 'Provider has not published this information.',
  },
]

const SOURCE_HIERARCHY = [
  {
    rank: '1',
    title: 'Manufacturer Technical Documentation',
    label: 'Highest priority',
    examples: [
      'IBM Quantum technical documentation',
      'IonQ technical specifications',
      'Quantinuum system card',
      'Rigetti QPU documentation',
      'IQM technical sheets',
      'QuEra device specifications',
      'PASQAL technical documentation',
      'D-Wave system documentation',
    ],
  },
  {
    rank: '2',
    title: 'Cloud Platform Documentation',
    label: 'High priority',
    examples: [
      'Amazon Braket device documentation',
      'Azure Quantum provider documentation',
      'IBM Quantum Experience documentation',
    ],
  },
  {
    rank: '3',
    title: 'Peer-Reviewed Research',
    label: 'High priority with date caveat',
    examples: [
      'Published benchmark papers',
      'Architecture research papers',
      'Performance characterization studies',
    ],
    note: 'Research papers are dated and may not reflect current hardware. We note the publication date and flag when specifications may have been superseded.',
  },
  {
    rank: '4',
    title: 'Official Announcements',
    label: 'Medium priority',
    examples: [
      'Company press releases',
      'Conference presentations',
      'Blog posts from official company sources',
    ],
  },
  {
    rank: '5',
    title: 'Secondary Sources',
    label: 'Lowest priority — used sparingly',
    examples: [
      'Technology journalism',
      'Industry reports',
    ],
    note: 'Only cited when primary sources are unavailable. Always clearly noted.',
  },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
        color: 'var(--color-text-primary)',
        marginBottom: 16,
      }}
    >
      {children}
    </h2>
  )
}

function ProseP({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 14, maxWidth: '68ch' }}>
      {children}
    </p>
  )
}

export default function MethodologyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {/* Header */}
      <section
        style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '56px 24px 48px',
        }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'methodology' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 14 }}>
            Data Methodology
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '58ch' }}>
            How we collect, verify, and maintain quantum hardware data. Updated when our practices change.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px' }}>

        {/* Data Collection */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading>Data Collection</SectionHeading>
          <ProseP>
            QPU.co collects hardware specifications from the following source hierarchy, in priority order.
            When sources conflict, higher-priority sources take precedence. All numeric values cite a primary source.
          </ProseP>
          <ProseP>
            We do not use AI-generated specifications.
          </ProseP>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
            {SOURCE_HIERARCHY.map(src => (
              <div
                key={src.rank}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-panel)',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-raised)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono), monospace',
                    color: 'var(--color-text-muted)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {src.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {src.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-mono), monospace',
                        letterSpacing: '0.06em',
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {src.label}
                    </span>
                  </div>
                  <ul
                    style={{
                      margin: '0 0 8px',
                      padding: '0 0 0 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    {src.examples.map(ex => (
                      <li
                        key={ex}
                        style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}
                      >
                        {ex}
                      </li>
                    ))}
                  </ul>
                  {src.note && (
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--color-text-muted)',
                        fontStyle: 'italic',
                        margin: 0,
                        lineHeight: 1.5,
                        paddingTop: 4,
                        borderTop: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      {src.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Specification Verification */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading>Specification Verification</SectionHeading>
          <ProseP>
            Each specification includes a source URL and access date. We mark data with one of the
            following status indicators:
          </ProseP>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {DATA_STATUS_DEFINITIONS.map(s => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: s.bg,
                  border: `1px solid ${s.color}20`,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono), monospace',
                    color: s.color,
                    whiteSpace: 'nowrap',
                    marginTop: 1,
                    minWidth: 120,
                  }}
                >
                  {s.label}
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {s.description}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Unknown Data */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading>Unknown or Undisclosed Data</SectionHeading>
          <ProseP>
            When specifications are unknown or unpublished, QPU.co displays <code className="code-inline">—</code> rather
            than estimating or inferring values. We do not extrapolate specifications. An absent value is
            not the same as a zero — it means the data is not available from a primary source.
          </ProseP>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Benchmarks */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading>Benchmarks</SectionHeading>
          <ProseP>
            Benchmark data is reported as published by manufacturers or cloud providers. QPU.co does
            not run independent benchmarks. We note when:
          </ProseP>
          <ul style={{ margin: '0 0 14px', padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'A metric is vendor-defined and has not been independently verified',
              'Metrics are not directly comparable across architectures',
              'Measurement methodologies differ between providers',
            ].map(point => (
              <li key={point} style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Comparison Methodology */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading>Comparison Methodology</SectionHeading>
          <ProseP>
            Some specifications — qubit count being the most common example — cannot be fairly compared
            across architectures without context. A processor with 100 trapped-ion qubits and all-to-all
            connectivity serves fundamentally different computational tasks than one with 100 superconducting
            qubits and nearest-neighbor connectivity.
          </ProseP>
          <ProseP>
            QPU.co surfaces these nuances in comparison tools and does not oversimplify cross-architecture
            comparisons. Where a direct comparison would be misleading, we add contextual notes.
          </ProseP>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Editorial Independence */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading>Editorial Independence</SectionHeading>
          <ProseP>
            No manufacturer, cloud provider, or third party can pay to change factual rankings,
            specifications, or benchmark data on QPU.co. Sponsored placements and commercial relationships
            are disclosed separately from editorial content.
          </ProseP>
          <ProseP>
            QPU.co does not have equity relationships with any quantum hardware manufacturer.
          </ProseP>
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(34,211,238,0.15)',
              background: 'rgba(34,211,238,0.04)',
              marginTop: 16,
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
              If you see something that looks like it contradicts this, we want to know. Please use our{' '}
              <Link
                href="/contact"
                style={{ color: 'var(--color-accent)', textDecoration: 'underline', textDecorationColor: 'rgba(34,211,238,0.4)' }}
              >
                contact form
              </Link>{' '}
              to flag it.
            </p>
          </div>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Data Corrections */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading>Data Corrections</SectionHeading>
          <ProseP>
            If you identify an error in our data, please submit a correction. We review all correction
            requests and update records when corrections are supported by primary source documentation.
            Corrections that cannot be verified against a primary source will not be applied.
          </ProseP>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--color-accent)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Submit a data correction →
          </Link>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Update frequency */}
        <section>
          <SectionHeading>Update Frequency</SectionHeading>
          <ProseP>
            We aim to review specifications for actively deployed hardware every 90 days, and update
            immediately when major changes are announced by manufacturers or cloud providers. Each
            data point includes a "last verified" date so you can assess its freshness.
          </ProseP>
        </section>
      </div>
    </div>
  )
}
