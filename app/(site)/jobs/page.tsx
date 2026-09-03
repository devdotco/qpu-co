import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

export const metadata: Metadata = {
  title: 'Quantum Computing Jobs — QPU.co',
  description:
    'Quantum computing job listings: hardware engineering, quantum physics, software development, research, and operations roles at leading quantum companies.',
}

const CATEGORIES = [
  'Engineering',
  'Physics',
  'Software',
  'Research',
  'Sales',
  'Operations',
]

const LOCATIONS = ['Remote', 'United States', 'Europe', 'Asia Pacific']

export default function JobsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {/* Header */}
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'jobs' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 14 }}>
            Quantum Computing Jobs
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '52ch' }}>
            Roles at quantum hardware companies, research institutions, and quantum software organizations.
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: 40,
          alignItems: 'start',
        }}
        className="jobs-grid"
      >
        {/* Sidebar filters */}
        <aside>
          <div
            style={{
              position: 'sticky',
              top: 80,
              padding: '18px 16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-panel)',
            }}
          >
            <p className="eyebrow" style={{ marginBottom: 14 }}>Category</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CATEGORIES.map(cat => (
                <span
                  key={cat}
                  style={{
                    display: 'block',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 13,
                    color: 'var(--color-text-muted)',
                    cursor: 'default',
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Location</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {LOCATIONS.map(loc => (
                  <span
                    key={loc}
                    style={{
                      display: 'block',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 13,
                      color: 'var(--color-text-muted)',
                      cursor: 'default',
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Status disclaimer */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(245,158,11,0.2)',
              background: 'rgba(245,158,11,0.05)',
              marginBottom: 28,
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--color-warning)', fontWeight: 600 }}>Early access:</strong>{' '}
              The QPU.co jobs board is in development. Contact us to post a quantum computing role.
            </p>
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {CATEGORIES.map(cat => (
              <Badge key={cat} variant="muted">
                {cat}
              </Badge>
            ))}
          </div>

          {/* Empty state */}
          <EmptyState
            title="Job listings coming soon"
            description="QPU.co is building a dedicated quantum computing jobs board for researchers, physicists, and engineers following hardware development. Employers can contact us to list roles."
            action={{ label: 'Contact us to post a role', href: '/contact' }}
          />

          {/* Employer CTA */}
          <div
            style={{
              marginTop: 40,
              padding: '24px 22px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-panel)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  Post a Quantum Job
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '48ch', lineHeight: 1.6 }}>
                  Reach researchers, physicists, and engineers actively following quantum hardware
                  development. QPU.co is building a focused audience of quantum computing professionals.
                </p>
              </div>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '9px 18px',
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
                Get in touch →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .jobs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
