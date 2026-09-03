import Link from 'next/link'
import AdvisorSearch from './AdvisorSearch'
import TopologyMapClient from './TopologyMapClient'

export default function Hero() {
  return (
    <section
      className="grid-bg"
      style={{
        background: 'var(--color-bg-base)',
        borderBottom: '1px solid var(--color-border)',
        padding: '80px 0 72px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }}
          className="hero-grid"
        >
          {/* Left column */}
          <div>
            <span className="eyebrow">QUANTUM COMPUTE INTELLIGENCE</span>

            <h1 style={{ marginTop: '16px', marginBottom: '0' }}>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block' }}>
                The World&apos;s
              </span>
              <span style={{ color: 'var(--color-text-primary)', display: 'block' }}>
                Quantum Computers.
              </span>
              <span
                className="gradient-text"
                style={{ display: 'block' }}
              >
                One Platform.
              </span>
            </h1>

            <p style={{
              marginTop: '24px',
              fontSize: '16px',
              lineHeight: '1.65',
              maxWidth: '48ch',
              color: 'var(--color-text-secondary)',
            }}>
              Compare quantum processors, architectures, providers, access options, benchmarks, and availability — then find the QPU best suited to your workload.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
              <Link
                href="/qpus"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  background: 'var(--color-text-primary)',
                  color: '#06080B',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                Explore QPUs
              </Link>
              <Link
                href="/compare"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Compare Processors
              </Link>
            </div>

            {/* Advisor search */}
            <AdvisorSearch />
          </div>

          {/* Right column — topology map */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TopologyMapClient />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}
