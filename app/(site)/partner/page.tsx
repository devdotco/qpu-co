import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Card, CardTitle, CardContent } from '@/components/ui/Card'
import { PartnerForm } from '@/components/forms/PartnerForm'

export const metadata: Metadata = {
  title: 'Partner with QPU.co',
  description:
    'Partnership opportunities with QPU.co for hardware providers, cloud platforms, quantum software companies, and research institutions.',
}

const PARTNERSHIP_TYPES = [
  {
    title: 'Hardware Providers',
    description:
      'Featured provider status, detailed hardware profiles, and direct access integration for verified QPU listings.',
  },
  {
    title: 'Cloud Platforms',
    description:
      'Access platform listing, deep integration with pricing and availability data, and routing connections.',
  },
  {
    title: 'Software Frameworks',
    description:
      'Framework documentation, compatibility tracking across hardware, and developer referrals.',
  },
  {
    title: 'Research Institutions',
    description:
      'Content collaboration, joint coverage of hardware research, and data partnerships for benchmarks and specifications.',
  },
  {
    title: 'Data Providers',
    description:
      'Data exchange agreements for hardware specifications, benchmark results, or market intelligence with clear sourcing.',
  },
]

export default function PartnerPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {/* Header */}
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'partner' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 18, maxWidth: 560 }}>
            Partner with QPU.co
          </h1>
          <p style={{ fontSize: 17, color: 'var(--color-text-secondary)', maxWidth: 560, lineHeight: 1.65, margin: 0 }}>
            We work with hardware providers, cloud platforms, software teams, and research institutions
            to build the most accurate and useful quantum hardware intelligence layer available.
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '60px 24px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
          gap: 56,
          alignItems: 'start',
        }}
        className="partner-grid"
      >
        {/* Left */}
        <div>
          {/* Partnership types */}
          <section style={{ marginBottom: 44 }}>
            <p className="eyebrow" style={{ marginBottom: 20 }}>Partnership Types</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PARTNERSHIP_TYPES.map(p => (
                <Card key={p.title} padding="md">
                  <CardTitle className="mb-1.5">{p.title}</CardTitle>
                  <CardContent>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      {p.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* What we maintain */}
          <section>
            <p className="eyebrow" style={{ marginBottom: 14 }}>What We Maintain</p>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(34,211,238,0.15)',
                background: 'rgba(34,211,238,0.04)',
              }}
            >
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                All partnerships are disclosed. Partner status does not affect the accuracy of factual
                specifications or benchmark data on QPU.co. Commercial relationships are kept separate
                from editorial content — always.
              </p>
            </div>
          </section>
        </div>

        {/* Right: form */}
        <div>
          <div
            style={{
              position: 'sticky',
              top: 80,
              padding: '28px 24px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-panel)',
            }}
          >
            <h2 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 6 }}>
              Get in Touch
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24, maxWidth: '100%' }}>
              Tell us about the partnership you have in mind and we'll follow up.
            </p>
            <PartnerForm />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .partner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
