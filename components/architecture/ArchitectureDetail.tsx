import Link from 'next/link'
import type { Architecture, QPU, ArchitectureType, UseCase } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { QPUCard } from '@/components/qpu/QPUCard'
import type { ArchitectureContent } from '@/data/architecture-content'

// ── Architecture color map ─────────────────────────────────────────────────────

const ARCH_COLOR: Record<string, string> = {
  'superconducting':   '#60A5FA',
  'trapped-ion':       '#A78BFA',
  'neutral-atom':      '#34D399',
  'photonic':          '#F472B6',
  'quantum-annealing': '#FB923C',
  'topological':       '#FBBF24',
}

// ── Connectivity diagram SVGs (inline, per arch) ───────────────────────────────

function ConnectivityDiagram({ arch }: { arch: string }) {
  const color = ARCH_COLOR[arch] ?? '#9AA4B2'

  if (arch === 'superconducting') {
    // 4x3 grid with nearest-neighbor connections
    const nodes: [number, number][] = []
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) nodes.push([20 + c * 32, 18 + r * 28])
    const edges: [number, number][] = []
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const i = r * 4 + c
      if (c < 3) edges.push([i, i + 1])
      if (r < 2) edges.push([i, i + 4])
    }
    return (
      <svg viewBox="0 0 148 88" width="148" height="88" aria-label="Nearest-neighbor grid topology">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={color} strokeWidth="1" opacity="0.35" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill={color} opacity="0.7" />
        ))}
        <text x={74} y={82} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.5">NEAREST-NEIGHBOR</text>
      </svg>
    )
  }

  if (arch === 'trapped-ion' || arch === 'neutral-atom') {
    // All-to-all: 6 nodes in circle
    const cx = 64, cy = 40, r = 30
    const n = 6
    const pts = Array.from({length: n}, (_, i) => [
      cx + r * Math.cos((i / n) * 2 * Math.PI - Math.PI / 2),
      cy + r * Math.sin((i / n) * 2 * Math.PI - Math.PI / 2),
    ] as [number, number])
    const edges: [number, number][] = []
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) edges.push([a, b])
    return (
      <svg viewBox="0 0 128 88" width="128" height="88" aria-label="All-to-all connectivity">
        {edges.map(([a, b], i) => (
          <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={color} strokeWidth="0.7" opacity="0.2" />
        ))}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill={color} opacity="0.75" />
        ))}
        <text x={64} y={82} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.5">ALL-TO-ALL</text>
      </svg>
    )
  }

  if (arch === 'photonic') {
    return (
      <svg viewBox="0 0 148 88" width="148" height="88" aria-label="Reconfigurable photonic network">
        <path d="M 12,30 Q 40,30 60,44 Q 80,58 108,58" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <path d="M 12,58 Q 40,58 60,44 Q 80,30 108,30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <line x1="54" y1="38" x2="66" y2="50" stroke={color} strokeWidth="2" opacity="0.7" />
        <line x1="54" y1="50" x2="66" y2="38" stroke={color} strokeWidth="2" opacity="0.7" />
        {[[12,30],[12,58],[108,30],[108,58]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill={color} opacity="0.7" />
        ))}
        <text x={60} y={82} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.5">RECONFIGURABLE</text>
      </svg>
    )
  }

  if (arch === 'quantum-annealing') {
    const nodes: [number, number][] = [[30,20],[70,20],[110,20],[30,58],[70,58],[110,58]]
    const edges: [number, number][] = [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[2,5],[0,4],[1,5],[1,3]]
    return (
      <svg viewBox="0 0 148 88" width="148" height="88" aria-label="Sparse Pegasus-like topology">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={color} strokeWidth="0.8" opacity="0.28" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6} fill={color} opacity="0.65" />
        ))}
        <text x={55} y={82} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.5">PEGASUS / ZEPHYR</text>
      </svg>
    )
  }

  // Topological — placeholder arch-dependent
  return (
    <svg viewBox="0 0 148 88" width="148" height="88" aria-label="Topological architecture diagram">
      <path d="M 20,20 C 20,45 110,35 110,60 C 110,80 20,70 20,80" fill="none" stroke={color} strokeWidth="1.5" opacity="0.55" />
      <path d="M 110,20 C 110,45 20,35 20,60 C 20,80 110,70 110,80" fill="none" stroke={color} strokeWidth="1.5" opacity="0.55" />
      <circle cx={65} cy={50} r={5} fill={color} opacity="0.7" />
      <text x={66} y={82} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={color} opacity="0.5">BRAIDING NETWORK</text>
    </svg>
  )
}

// ── Hero SVG import helper ─────────────────────────────────────────────────────

async function getHeroSVG(slug: string) {
  switch (slug) {
    case 'superconducting':   return (await import('@/components/svg/architectures/SuperconductingSVG')).default
    case 'trapped-ion':       return (await import('@/components/svg/architectures/TrappedIonSVG')).default
    case 'neutral-atom':      return (await import('@/components/svg/architectures/NeutralAtomSVG')).default
    case 'photonic':          return (await import('@/components/svg/architectures/PhotonicSVG')).default
    case 'quantum-annealing': return (await import('@/components/svg/architectures/AnnealingSVG')).default
    case 'topological':       return (await import('@/components/svg/architectures/TopologicalSVG')).default
    default: return null
  }
}

// ── FAQ Accordion (client component) ─────────────────────────────────────────

function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <section>
      <h2 style={{ marginBottom: '20px' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {faqs.map((faq, i) => (
          <details
            key={i}
            style={{
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span>{faq.question}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>›</span>
            </summary>
            <div
              style={{
                padding: '0 20px 16px',
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: '14px',
              }}
            >
              <p style={{ margin: 0, maxWidth: 'none' }}>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

// ── Suitability chip ─────────────────────────────────────────────────────────

function SuitabilityChip({ level }: { level: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    strong:       { label: 'Strong Fit',    bg: 'rgba(74,222,128,0.12)',  color: '#4ADE80' },
    possible:     { label: 'Possible',      bg: 'rgba(34,211,238,0.12)', color: '#22D3EE' },
    experimental: { label: 'Experimental',  bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
    limited:      { label: 'Limited',       bg: 'rgba(248,113,113,0.12)', color: '#F87171' },
    unknown:      { label: 'Unknown',       bg: 'rgba(255,255,255,0.06)', color: '#66717F' },
  }
  const c = cfg[level] ?? cfg.unknown
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '2px 10px',
      borderRadius: '99px',
      fontSize: '12px',
      fontWeight: 500,
      background: c.bg,
      color: c.color,
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface ArchitectureDetailProps {
  architecture: Architecture
  qpus: QPU[]
  content: ArchitectureContent
  useCases: UseCase[]
  providers: { slug: string; name: string }[]
}

export async function ArchitectureDetail({
  architecture,
  qpus,
  content,
  useCases,
  providers,
}: ArchitectureDetailProps) {
  const color = ARCH_COLOR[architecture.slug] ?? '#9AA4B2'
  const HeroSVG = await getHeroSVG(architecture.slug)

  const paradigmLabel = content.paradigmLabel
  const archUseCase = useCases.filter(u =>
    u.architectureSuitability[architecture.slug as ArchitectureType] &&
    u.architectureSuitability[architecture.slug as ArchitectureType] !== 'unknown'
  ).slice(0, 6)

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px 80px',
    }}>
      {/* Breadcrumb */}
      <div style={{ paddingTop: '32px', paddingBottom: '24px' }}>
        <Breadcrumb
          items={[
            { label: 'QPU.co', href: '/' },
            { label: 'Architectures', href: '/architectures' },
            { label: architecture.name },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        marginBottom: '64px',
        paddingBottom: '40px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {/* Color accent line at top */}
        <div style={{
          position: 'absolute',
          top: '-32px',
          left: 0,
          width: '48px',
          height: '3px',
          background: color,
          borderRadius: '2px',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '48px',
          alignItems: 'start',
        }}
          className="arch-hero-grid"
        >
          <div>
            {/* Eyebrow */}
            <span className="eyebrow" style={{ display: 'block', marginBottom: '12px', color }}>
              {paradigmLabel}
            </span>

            {/* H1 */}
            <h1 style={{ marginBottom: '16px', color: 'var(--color-text-primary)' }}>
              {architecture.name} Quantum Computers
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '16px',
              lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
              maxWidth: '64ch',
              margin: '0 0 24px',
            }}>
              {architecture.description}
            </p>

            {/* Quick stats row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              paddingTop: '8px',
            }}>
              {[
                { label: 'GATE SPEED',   value: architecture.gateSpeed.split(';')[0] },
                { label: 'CONNECTIVITY', value: architecture.connectivity.split(';')[0].slice(0, 40) + (architecture.connectivity.length > 40 ? '…' : '') },
                { label: 'ENVIRONMENT', value: architecture.operatingEnvironment.split(';')[0] },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="mono-label" style={{ marginBottom: '4px' }}>{stat.label}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-mono)',
                    maxWidth: '24ch',
                  }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero SVG */}
          <div style={{
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
            className="arch-hero-svg"
          >
            {HeroSVG ? <HeroSVG /> : (
              <div style={{ width: 300, height: 180, background: `${color}10`, borderRadius: 8 }} />
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .arch-hero-grid { grid-template-columns: 1fr !important; }
            .arch-hero-svg { display: none; }
          }
        `}</style>
      </div>

      {/* How It Works */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ marginBottom: '20px' }}>How {architecture.name} Qubits Work</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {content.howItWorks.map((para, i) => (
            <p key={i} style={{ margin: 0, lineHeight: 1.8, maxWidth: '78ch' }}>{para}</p>
          ))}
        </div>
      </section>

      {/* Physical Implementation */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ marginBottom: '20px' }}>Physical Implementation</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2px',
          background: 'var(--color-border)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
          className="impl-grid"
        >
          {[
            { label: 'Qubit Medium',         value: content.physicalImplementation.qubitMedium },
            { label: 'Control Mechanism',    value: content.physicalImplementation.controlMechanism },
            { label: 'Operating Environment', value: content.physicalImplementation.operatingEnvironment },
            { label: 'Readout Mechanism',    value: content.physicalImplementation.readoutMechanism },
          ].map(row => (
            <div key={row.label} style={{
              background: 'var(--color-bg-panel)',
              padding: '18px 20px',
            }}>
              <p className="mono-label" style={{ marginBottom: '8px' }}>{row.label}</p>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
                {row.value}
              </p>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 640px) { .impl-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* Connectivity & Gates */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ marginBottom: '20px' }}>Connectivity and Gate Operations</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '32px',
          alignItems: 'start',
        }}
          className="conn-grid"
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px', color: 'var(--color-text-primary)' }}>
              Connectivity
            </h3>
            <p style={{ margin: '0 0 20px', lineHeight: 1.75, maxWidth: '62ch' }}>
              {content.connectivityDetail}
            </p>

            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px', color: 'var(--color-text-primary)' }}>
              Native Gate Set
            </h3>
            <p style={{ margin: '0 0 20px', lineHeight: 1.75, maxWidth: '62ch' }}>
              {content.nativeGates}
            </p>

            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px', color: 'var(--color-text-primary)' }}>
              Gate Speed
            </h3>
            <p style={{ margin: 0, lineHeight: 1.75, maxWidth: '62ch', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {architecture.gateSpeed}
            </p>
          </div>

          {/* Connectivity diagram */}
          <div style={{
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '16px',
            flexShrink: 0,
          }}>
            <ConnectivityDiagram arch={architecture.slug} />
          </div>
        </div>
        <style>{`
          @media (max-width: 640px) { .conn-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* Advantages + Limitations (2-col) */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '56px',
      }}
        className="adv-lim-grid"
      >
        {/* Advantages */}
        <div style={{
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Potential Advantages</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {content.advantages.map((a, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                <span style={{ color: '#4ADE80', flexShrink: 0, marginTop: '2px' }}>✓</span>
                <span style={{ maxWidth: 'none' }}>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div style={{
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Limitations &amp; Challenges</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {content.limitations.map((l, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: '2px' }}>—</span>
                <span style={{ maxWidth: 'none' }}>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <style>{`
          @media (max-width: 640px) { .adv-lim-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* Scaling */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ marginBottom: '16px' }}>Scaling Considerations</h2>
        <div style={{
          background: 'var(--color-bg-raised)',
          border: '1px solid var(--color-border)',
          borderLeft: `3px solid ${color}`,
          borderRadius: '0 8px 8px 0',
          padding: '20px 24px',
        }}>
          <p style={{ margin: 0, lineHeight: 1.8, maxWidth: '78ch' }}>{content.scalingNotes}</p>
        </div>
        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Coherence: {architecture.coherenceNotes}
        </p>
      </section>

      {/* Available QPUs */}
      <section style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Available QPUs</h2>
          <Link
            href={`/qpus?architecture=${architecture.slug}`}
            style={{
              fontSize: '13px',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
            }}
          >
            View all →
          </Link>
        </div>

        {qpus.length === 0 ? (
          <div style={{
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '40px 24px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
          }}>
            No QPUs from this architecture are currently listed.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
            className="qpu-grid"
          >
            {qpus.slice(0, 6).map(qpu => (
              <QPUCard key={qpu.id} qpu={qpu} />
            ))}
          </div>
        )}
        <style>{`
          @media (max-width: 900px) { .qpu-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 560px) { .qpu-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* Leading Companies */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ marginBottom: '16px' }}>Leading Companies</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {architecture.leadingCompanies.map(company => {
            const provider = providers.find(p => p.name.toLowerCase().includes(company.toLowerCase()))
            return provider ? (
              <Link
                key={company}
                href={`/providers/${provider.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'var(--color-bg-panel)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '7px',
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
              >
                {company}
                <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>→</span>
              </Link>
            ) : (
              <span
                key={company}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  background: 'var(--color-bg-panel)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '7px',
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {company}
              </span>
            )
          })}
        </div>
      </section>

      {/* Relevant Use Cases */}
      {archUseCase.length > 0 && (
        <section style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0 }}>Workload Suitability</h2>
            <Link
              href="/use-cases"
              style={{ fontSize: '13px', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
            >
              Full guide →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
            className="usecase-grid"
          >
            {archUseCase.map(uc => {
              const suitability = uc.architectureSuitability[architecture.slug as ArchitectureType]
              return (
                <Link
                  key={uc.id}
                  href={`/use-cases/${uc.slug}`}
                  style={{
                    display: 'block',
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{uc.name}</span>
                    <SuitabilityChip level={suitability} />
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, maxWidth: 'none' }}>
                    {uc.description.slice(0, 80)}…
                  </p>
                </Link>
              )
            })}
          </div>
          <style>{`
            @media (max-width: 640px) { .usecase-grid { grid-template-columns: 1fr !important; } }
          `}</style>

          {/* Suitability notes */}
          {(content.workloadNotes.suited.length > 0 || content.workloadNotes.lesssuited.length > 0) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '20px',
            }}
              className="wl-grid"
            >
              <div style={{
                background: 'rgba(74,222,128,0.04)',
                border: '1px solid rgba(74,222,128,0.15)',
                borderRadius: '8px',
                padding: '16px',
              }}>
                <p className="mono-label" style={{ marginBottom: '10px', color: '#4ADE80' }}>WELL SUITED FOR</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {content.workloadNotes.suited.map((s, i) => (
                    <li key={i} style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', display: 'flex', gap: '7px' }}>
                      <span style={{ color: '#4ADE80', flexShrink: 0 }}>›</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{
                background: 'rgba(248,113,113,0.04)',
                border: '1px solid rgba(248,113,113,0.12)',
                borderRadius: '8px',
                padding: '16px',
              }}>
                <p className="mono-label" style={{ marginBottom: '10px', color: '#F87171' }}>LESS SUITED FOR</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {content.workloadNotes.lesssuited.map((s, i) => (
                    <li key={i} style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', display: 'flex', gap: '7px' }}>
                      <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>—</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <style>{`
                @media (max-width: 640px) { .wl-grid { grid-template-columns: 1fr !important; } }
              `}</style>
            </div>
          )}
        </section>
      )}

      {/* FAQ */}
      <div style={{ marginBottom: '56px' }}>
        <FAQSection faqs={content.faqs} />
      </div>

      {/* Sources */}
      {content.sources.length > 0 && (
        <section style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '32px',
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--color-text-secondary)' }}>Key References</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {content.sources.map((src, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                  [{i + 1}]
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                  >
                    {src.title}
                  </a>
                  <span style={{ color: 'var(--color-text-muted)' }}> — {src.publisher}, {src.year}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
