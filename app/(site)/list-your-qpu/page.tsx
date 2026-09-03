import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ListQPUForm } from '@/components/forms/ListQPUForm'

export const metadata: Metadata = {
  title: 'List Your QPU — QPU Hardware on QPU.co',
  description:
    'Quantum hardware manufacturers can submit their QPU for consideration. QPU.co reviews listings independently.',
}

const HOW_IT_WORKS = [
  'Listings are reviewed independently against our data standards.',
  'Factual specifications must be documented and verifiable via primary sources.',
  'Core specifications — qubits, fidelity, connectivity — cannot be purchased or commercially altered.',
  'Sponsored features such as featured placement are separate from specification accuracy.',
  'Submissions are reviewed before publication. This typically takes up to 5 business days.',
]

export default function ListYourQPUPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {/* Header */}
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'list-your-qpu' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 18, maxWidth: 640 }}>
            Put Your Quantum Hardware in Front of the People Evaluating It
          </h1>
          <p style={{ fontSize: 17, color: 'var(--color-text-secondary)', maxWidth: 580, lineHeight: 1.65, margin: 0 }}>
            QPU.co is the independent discovery and comparison platform for quantum processing units.
            Researchers, engineers, and technical evaluators use QPU.co to discover, compare, and select
            quantum hardware.
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '60px 24px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
          gap: 56,
          alignItems: 'start',
        }}
        className="listyourqpu-grid"
      >
        {/* Left: how it works */}
        <div>
          <section style={{ marginBottom: 40 }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>How Listings Work</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {HOW_IT_WORKS.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg-raised)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono), monospace',
                      color: 'var(--color-text-muted)',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* What you get */}
          <section
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-panel)',
            }}
          >
            <p className="eyebrow" style={{ marginBottom: 12 }}>What a Listing Includes</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Dedicated processor page with technical specifications',
                'Inclusion in architecture and workload comparison tools',
                'Provider profile page with access and documentation links',
                'Coverage in QPU.co search and filter tools',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'var(--color-accent)',
                      flexShrink: 0,
                      marginTop: 8,
                    }}
                    aria-hidden="true"
                  />
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <p
            style={{
              marginTop: 20,
              fontSize: 12,
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            Submitting does not guarantee inclusion. QPU.co maintains editorial discretion over
            what appears in the directory and under what specifications.
          </p>
        </div>

        {/* Right: form */}
        <div
          style={{
            padding: '28px 24px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
          }}
        >
          <h2 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            Submit for Review
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24, maxWidth: '100%' }}>
            Provide your processor details and documentation links. We'll reach out if we have questions
            before publishing.
          </p>
          <ListQPUForm />
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .listyourqpu-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
