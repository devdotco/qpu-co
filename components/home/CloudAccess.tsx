interface PlatformCardProps {
  name: string
  providers: string[]
  frameworks: string[]
  region?: string
  accessModel: string
  description?: string
}

function PlatformCard({ name, providers, frameworks, region, accessModel, description }: PlatformCardProps) {
  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        fontSize: '15px',
        fontWeight: '600',
        color: 'var(--color-text-primary)',
      }}>
        {name}
      </div>

      {description && (
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
          {description}
        </p>
      )}

      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-faint)',
          marginBottom: '6px',
        }}>
          Providers
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {providers.map(p => (
            <span key={p} style={{
              padding: '2px 8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-mono)',
            }}>
              {p}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-faint)',
          marginBottom: '6px',
        }}>
          Frameworks
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {frameworks.map(f => (
            <span key={f} style={{
              padding: '2px 8px',
              background: 'rgba(34,211,238,0.06)',
              border: '1px solid rgba(34,211,238,0.15)',
              borderRadius: '4px',
              fontSize: '11px',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-mono)',
            }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '4px',
        borderTop: '1px solid var(--color-border-subtle)',
      }}>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {region ?? accessModel}
        </div>
        <a
          href="/availability"
          style={{
            fontSize: '12px',
            color: 'var(--color-accent)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
          }}
        >
          View Access Options →
        </a>
      </div>
    </div>
  )
}

const platforms = [
  {
    name: 'Amazon Braket',
    providers: ['IonQ', 'Rigetti', 'QuEra'],
    frameworks: ['Qiskit', 'Braket SDK', 'PennyLane'],
    region: 'Multi-region',
    accessModel: 'Pay-per-task',
  },
  {
    name: 'Azure Quantum',
    providers: ['IonQ', 'Quantinuum', 'Rigetti'],
    frameworks: ['Q#', 'Qiskit', 'Cirq'],
    region: 'US East · EU West',
    accessModel: 'Pay-per-shot',
  },
  {
    name: 'IBM Quantum',
    providers: ['IBM'],
    frameworks: ['Qiskit', 'PennyLane', 'CUDA-Q'],
    region: 'US · EU · JP',
    accessModel: 'Open + Subscription',
  },
  {
    name: 'Direct Provider Access',
    providers: ['IonQ', 'Quantinuum', 'D-Wave', 'PASQAL', 'IQM'],
    frameworks: ['Provider-specific'],
    description: 'Access hardware directly from the manufacturer via dedicated cloud portals, on-premises deployment, or enterprise agreements.',
    region: 'Varies by provider',
    accessModel: 'Enterprise',
  },
]

export default function CloudAccess() {
  return (
    <section style={{
      background: 'var(--color-bg-base)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
            CLOUD ACCESS LAYER
          </span>
          <h2 style={{ margin: '0 0 10px' }}>One Hardware Market. Multiple Ways to Access It.</h2>
          <p style={{ margin: 0, fontSize: '15px', maxWidth: '58ch' }}>
            Quantum processors are accessible through major cloud platforms, direct provider portals, and on-premises deployments. QPU.co tracks availability across all access routes.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
        }}
          className="cloud-grid"
        >
          {platforms.map(p => (
            <PlatformCard key={p.name} {...p} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .cloud-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .cloud-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
