import Link from 'next/link'
import type { QPU } from '@/types'
import QPUTable from './QPUTable'

interface QPUExplorerSectionProps {
  qpus: QPU[]
}

export default function QPUExplorerSection({ qpus }: QPUExplorerSectionProps) {
  return (
    <section style={{
      background: 'var(--color-bg-base)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              QPU DATABASE
            </span>
            <h2 style={{ margin: 0 }}>Explore Quantum Processors</h2>
          </div>
          <Link
            href="/qpus"
            style={{
              fontSize: '13px',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em',
            }}
          >
            View all QPUs →
          </Link>
        </div>

        <QPUTable qpus={qpus} />

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link
            href="/qpus"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '9px 20px',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: '6px',
              fontSize: '13px',
              textDecoration: 'none',
              gap: '6px',
            }}
          >
            View All Quantum Processors →
          </Link>
        </div>
      </div>
    </section>
  )
}
