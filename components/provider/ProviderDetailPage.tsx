import Link from 'next/link'
import type { Provider, QPU, RoadmapEvent } from '@/types'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { QPUCard } from '@/components/qpu/QPUCard'
import { RoadmapTimeline } from './RoadmapTimeline'

interface ProviderDetailPageProps {
  provider: Provider
  qpus: QPU[]
  roadmapEvents: RoadmapEvent[]
}

const COUNTRY_LABELS: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  FI: 'Finland',
  FR: 'France',
  DE: 'Germany',
  GB: 'United Kingdom',
  JP: 'Japan',
}

function countryLabel(code: string): string {
  return COUNTRY_LABELS[code] ?? code
}

function cloudPlatformLabel(slug: string): string {
  const labels: Record<string, string> = {
    'aws-braket': 'Amazon Braket',
    'azure-quantum': 'Azure Quantum',
    'ibm-quantum': 'IBM Quantum',
    'ionq-cloud': 'IonQ Cloud',
    'dwave-leap': 'D-Wave Leap',
    'quantinuum-nexus': 'Quantinuum Nexus',
  }
  return labels[slug] ?? slug
}

function cloudPlatformUrl(slug: string): string {
  const urls: Record<string, string> = {
    'aws-braket': 'https://aws.amazon.com/braket/',
    'azure-quantum': 'https://azure.microsoft.com/products/quantum',
    'ibm-quantum': 'https://quantum.ibm.com/',
    'ionq-cloud': 'https://cloud.ionq.com/',
    'dwave-leap': 'https://cloud.dwavesys.com/leap/',
    'quantinuum-nexus': 'https://www.quantinuum.com/products/nexus',
  }
  return urls[slug] ?? '#'
}

function frameworkLabel(slug: string): string {
  const labels: Record<string, string> = {
    qiskit: 'Qiskit',
    cirq: 'Cirq',
    pennylane: 'PennyLane',
    'cuda-q': 'CUDA-Q',
    qsharp: 'Q#',
    'amazon-braket-sdk': 'Braket SDK',
    bloqade: 'Bloqade',
    tket: 'TKET',
    pyquil: 'pyQuil',
  }
  return labels[slug] ?? slug
}

function frameworkUrl(slug: string): string {
  const urls: Record<string, string> = {
    qiskit: 'https://qiskit.org',
    cirq: 'https://quantumai.google/cirq',
    pennylane: 'https://pennylane.ai',
    'cuda-q': 'https://developer.nvidia.com/cuda-quantum',
    qsharp: 'https://azure.microsoft.com/products/quantum',
    'amazon-braket-sdk': 'https://github.com/amazon-braket/amazon-braket-sdk-python',
    bloqade: 'https://bloqade.quera.com',
    tket: 'https://tket.quantinuum.com',
    pyquil: 'https://github.com/rigetti/pyquil',
  }
  return urls[slug] ?? '#'
}

function statusVariant(status: Provider['status']): 'success' | 'muted' | 'warning' {
  if (status === 'active') return 'success'
  if (status === 'acquired') return 'warning'
  return 'muted'
}

function statusLabel(status: Provider['status']): string {
  const labels: Record<Provider['status'], string> = {
    active: 'Active',
    acquired: 'Acquired',
    defunct: 'Defunct',
    stealth: 'Stealth',
  }
  return labels[status]
}

// Deduplicate cloud platforms across QPUs
function getProviderClouds(qpus: QPU[]): string[] {
  const set = new Set<string>()
  for (const q of qpus) for (const cp of q.cloudPlatforms) set.add(cp)
  return Array.from(set)
}

// Deduplicate frameworks across QPUs
function getProviderFrameworks(qpus: QPU[]): string[] {
  const set = new Set<string>()
  for (const q of qpus) for (const f of q.frameworks) set.add(f)
  return Array.from(set)
}

// Deduplicate sources across QPUs
function getProviderSources(qpus: QPU[]) {
  const seen = new Set<string>()
  const results: { title: string; publisher: string; url: string }[] = []
  for (const q of qpus) {
    for (const s of q.sources) {
      if (!seen.has(s.url)) {
        seen.add(s.url)
        results.push({ title: s.title, publisher: s.publisher, url: s.url })
      }
    }
  }
  return results
}

const sectionTitle: React.CSSProperties = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  margin: '0 0 16px',
  letterSpacing: '-0.01em',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-panel)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
}

export default function ProviderDetailPage({
  provider,
  qpus,
  roadmapEvents,
}: ProviderDetailPageProps) {
  const clouds = getProviderClouds(qpus)
  const frameworks = getProviderFrameworks(qpus)
  const sources = getProviderSources(qpus)

  return (
    <div style={{ background: 'var(--color-bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ padding: '24px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}
        >
          <ol style={{ display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                QPU.co
              </Link>
            </li>
            <li style={{ color: 'var(--color-border-strong)' }}>/</li>
            <li>
              <Link href="/providers" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                Providers
              </Link>
            </li>
            <li style={{ color: 'var(--color-border-strong)' }}>/</li>
            <li style={{ color: 'var(--color-text-secondary)' }}>{provider.name}</li>
          </ol>
        </nav>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: '40px',
            padding: '32px 0 80px',
            alignItems: 'start',
          }}
          className="provider-layout"
        >
          {/* ─── Main Content ─── */}
          <div style={{ minWidth: 0 }}>
            {/* Hero */}
            <div
              style={{
                ...cardStyle,
                marginBottom: 24,
                background: 'var(--color-bg-raised)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  {provider.name}
                </h1>
                <Badge variant={statusVariant(provider.status)} size="md">
                  {statusLabel(provider.status)}
                </Badge>
              </div>

              {/* Architecture badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                <ArchitectureBadge architecture={provider.primaryArchitecture} size="md" />
                {provider.secondaryArchitectures.map(arch => (
                  <ArchitectureBadge key={arch} architecture={arch} size="md" />
                ))}
              </div>

              {/* Meta */}
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  marginBottom: 16,
                  flexWrap: 'wrap',
                }}
              >
                <span>{countryLabel(provider.country)}</span>
                {provider.founded && <span>Founded {provider.founded}</span>}
                {provider.employees && <span>{provider.employees} employees</span>}
                {provider.funding && <span>{provider.funding}</span>}
              </div>

              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 20px', maxWidth: '72ch' }}>
                {provider.description}
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-accent)',
                    color: 'var(--color-bg-base)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Visit Website ↗
                </a>
                {provider.documentation && (
                  <a
                    href={provider.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg-panel)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: '13px',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    Documentation
                  </a>
                )}
                {qpus.length > 0 && (
                  <a
                    href="#qpus"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg-panel)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: '13px',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    View QPUs
                  </a>
                )}
              </div>
            </div>

            {/* Current QPUs */}
            <section id="qpus" style={{ marginBottom: 32 }}>
              <h2 style={sectionTitle}>Current Processors</h2>
              {qpus.length === 0 ? (
                <EmptyState
                  title="No QPUs currently listed"
                  description={`We don't have any QPU records for ${provider.name} yet.`}
                />
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {qpus.map(qpu => (
                    <QPUCard key={qpu.id} qpu={qpu} providerName={provider.name} />
                  ))}
                </div>
              )}
            </section>

            {/* Hardware Roadmap */}
            <section style={{ marginBottom: 32 }}>
              <div style={{ ...cardStyle }}>
                <h2 style={sectionTitle}>Hardware Roadmap</h2>
                <RoadmapTimeline events={roadmapEvents} providerId={provider.id} />
              </div>
            </section>

            {/* Cloud Access */}
            {clouds.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div style={cardStyle}>
                  <h2 style={sectionTitle}>Cloud Access</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {clouds.map(cp => {
                      // Find QPUs on this platform and their access models
                      const qpusOnPlatform = qpus.filter(q => q.cloudPlatforms.includes(cp))
                      const allModels = new Set<string>()
                      for (const q of qpusOnPlatform) for (const m of q.accessModels) allModels.add(m)

                      return (
                        <div
                          key={cp}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 12,
                            padding: '14px',
                            background: 'var(--color-bg-raised)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border-subtle)',
                          }}
                        >
                          <div>
                            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '13px', color: 'var(--color-text-primary)' }}>
                              {cloudPlatformLabel(cp)}
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>
                              {qpusOnPlatform.length} {qpusOnPlatform.length === 1 ? 'processor' : 'processors'} ·{' '}
                              {Array.from(allModels).join(', ')}
                            </p>
                          </div>
                          <a
                            href={cloudPlatformUrl(cp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-accent)',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            Get started ↗
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Developer Ecosystem */}
            {frameworks.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div style={cardStyle}>
                  <h2 style={sectionTitle}>Developer Ecosystem</h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 16, maxWidth: 'none' }}>
                    {provider.name} hardware is compatible with the following quantum software frameworks.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {frameworks.map(fw => (
                      <a
                        key={fw}
                        href={frameworkUrl(fw)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-bg-raised)',
                          border: '1px solid var(--color-border)',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'var(--color-text-secondary)',
                          textDecoration: 'none',
                          transition: 'border-color 0.12s, color 0.12s',
                        }}
                      >
                        {frameworkLabel(fw)}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Data Sources */}
            {sources.length > 0 && (
              <section>
                <div style={cardStyle}>
                  <h2 style={sectionTitle}>Data Sources</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sources.map(s => (
                      <div key={s.url} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--color-bg-raised)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          {s.publisher}
                        </span>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                        >
                          {s.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ─── Right Sidebar ─── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>
            {/* Quick Stats */}
            <div style={cardStyle}>
              <h3 style={{ ...sectionTitle, marginBottom: 12 }}>Quick Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Processors</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                    {qpus.length} {qpus.length === 1 ? 'QPU' : 'QPUs'}
                  </p>
                </div>
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Architecture</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, textTransform: 'capitalize' }}>
                    {provider.primaryArchitecture.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Cloud Platforms</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                    {clouds.length}
                  </p>
                </div>
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Country</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0 }}>
                    {countryLabel(provider.country)}
                  </p>
                </div>
                {provider.founded && (
                  <div>
                    <p className="mono-label" style={{ marginBottom: 2 }}>Founded</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0 }}>
                      {provider.founded}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Access Hardware */}
            {clouds.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ ...sectionTitle, marginBottom: 12 }}>Access This Hardware</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {clouds.map(cp => (
                    <a
                      key={cp}
                      href={cloudPlatformUrl(cp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        background: 'var(--color-bg-raised)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        transition: 'border-color 0.12s',
                      }}
                    >
                      <span>{cloudPlatformLabel(cp)}</span>
                      <span style={{ color: 'var(--color-accent)' }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Compare */}
            <div style={cardStyle}>
              <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Compare</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
                Compare {provider.name} processors side by side with other QPUs.
              </p>
              <Link
                href="/compare"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 12px',
                  background: 'var(--color-accent-dim)',
                  border: '1px solid rgba(34,211,238,0.25)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Compare {provider.shortName} processors →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .provider-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
