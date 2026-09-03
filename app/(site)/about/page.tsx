import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Separator } from '@/components/ui/Separator'

export const metadata: Metadata = {
  title: 'About QPU.co — Independent Quantum Hardware Intelligence',
  description:
    'QPU.co is building an independent data and discovery layer for quantum-computing hardware. Our mission is transparency, structured data, and honest hardware comparison.',
}

const WHAT_WE_DO = [
  'Track quantum processors across architectures and providers',
  'Maintain structured, cited hardware specifications',
  'Provide architecture and workload comparison tools',
  'Publish verified benchmark data with source attribution',
  'Map cloud access, availability, and pricing models',
  'Cover hardware developments through QPU Intelligence',
]

const WHAT_WE_DONT_DO = [
  'Operate quantum hardware',
  'Guarantee hardware performance outcomes',
  'Rank processors in exchange for commercial relationships',
  'Accept payment to alter factual specifications',
]

export default function AboutPage() {
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
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'about' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 0 }}>
            About QPU.co
          </h1>
        </div>
      </section>

      {/* Body */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '56px 24px' }}>

        {/* Mission */}
        <section style={{ marginBottom: 56 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Mission</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
              QPU.co is building an independent data and discovery layer for quantum-computing hardware.
              As quantum processors become increasingly accessible through cloud platforms and direct
              research programs, the need for independent, structured hardware intelligence has grown
              significantly.
            </p>
            <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
              We believe researchers, engineers, and organizations evaluating quantum computing should
              have access to accurate, vendor-neutral hardware comparisons — without having to rely on
              manufacturer marketing or outdated academic surveys.
            </p>
          </div>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* What we do / don't do */}
        <section style={{ marginBottom: 56 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
            }}
          >
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>What We Do</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {WHAT_WE_DO.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                      aria-hidden="true"
                    />
                    <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>What We Don't Do</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {WHAT_WE_DONT_DO.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--color-text-muted)',
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                      aria-hidden="true"
                    />
                    <span style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Our approach */}
        <section style={{ marginBottom: 56 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Our Approach</p>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
            Data is sourced from manufacturer documentation, cloud provider documentation, and published
            research. Sponsored content and editorial content are kept strictly separate.
          </p>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
            For full detail on how we collect, verify, and update hardware specifications, see our{' '}
            <Link
              href="/methodology"
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(34,211,238,0.4)',
              }}
            >
              data methodology
            </Link>
            .
          </p>
        </section>

        <div className="mb-14"><Separator /></div>

        {/* Vision */}
        <section>
          <p className="eyebrow" style={{ marginBottom: 16 }}>The Vision</p>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
            In the long term, QPU.co aims to become the routing and access layer for quantum workloads —
            helping developers and researchers find the right hardware and, eventually, dispatch workloads
            to it. Independent, structured data is the foundation.
          </p>
        </section>
      </div>
    </div>
  )
}
