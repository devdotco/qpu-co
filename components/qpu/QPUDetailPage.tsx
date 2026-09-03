import Link from 'next/link'
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react'
import type { QPU, Source } from '@/types'
import { providers } from '@/data/providers'
import { useCases } from '@/data/use-cases'
import { frameworks as allFrameworks } from '@/data/frameworks'
import { architectureLabel, formatQubits, formatDateShort, cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { Badge } from '@/components/ui/Badge'
import { MetricCard } from '@/components/ui/MetricCard'
import { TechnicalTable } from '@/components/ui/TechnicalTable'
import type { TechnicalTableRow } from '@/components/ui/TechnicalTable'
import { DataFreshness } from '@/components/ui/DataFreshness'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ArchitectureTopology } from '@/components/svg/ArchitectureTopology'
import { QPUCard } from '@/components/qpu/QPUCard'
import { CompareButton } from '@/components/qpu/CompareButton'
import { CorrectionModal } from '@/components/qpu/CorrectionModal'

interface QPUDetailPageProps {
  qpu: QPU
  relatedQpus: QPU[]
}

const SOURCE_TYPE_LABELS: Record<Source['sourceType'], string> = {
  manufacturer: 'Manufacturer',
  'cloud-provider': 'Cloud Provider',
  research: 'Research',
  'technical-paper': 'Technical Paper',
  announcement: 'Announcement',
  secondary: 'Secondary',
}

export default function QPUDetailPage({ qpu, relatedQpus }: QPUDetailPageProps) {
  // Look up provider and use-cases from static data
  const provider = providers.find(p => p.id === qpu.providerId)
  const providerName = provider?.name ?? qpu.providerId

  // Use cases applicable to this architecture
  const applicableUseCases = useCases
    .filter(uc => {
      const suit = uc.architectureSuitability[qpu.architecture]
      return suit === 'strong' || suit === 'possible' || suit === 'experimental'
    })
    .slice(0, 6)

  // Framework details
  const qpuFrameworks = allFrameworks.filter(f => qpu.frameworks.includes(f.id))

  // ── Technical table rows ──
  const techRows: TechnicalTableRow[] = [
    { label: 'Architecture', value: architectureLabel(qpu.architecture) },
    { label: 'Paradigm', value: qpu.paradigm === 'gate-based' ? 'Gate-based' : qpu.paradigm === 'annealing' ? 'Quantum Annealing' : qpu.paradigm === 'analog' ? 'Analog' : 'Hybrid' },
    { label: 'Physical Qubits', value: qpu.physicalQubits, unit: 'qubits' },
    ...(qpu.logicalQubits !== null ? [{ label: 'Logical Qubits', value: qpu.logicalQubits, unit: 'qubits' }] : []),
    ...(qpu.algorithmicQubits ? [{ label: 'Algorithmic Qubits (#AQ)', value: qpu.algorithmicQubits, unit: '#AQ', notes: 'IonQ Algorithmic Qubit metric — practical circuit capacity measure.' }] : []),
    {
      label: 'Connectivity',
      value: qpu.connectivity ? qpu.connectivity.topology : null,
      notes: qpu.connectivity?.description ?? undefined,
    },
    {
      label: 'All-to-All',
      value: qpu.connectivity ? (qpu.connectivity.allToAll ? 'Yes' : 'No') : null,
    },
    {
      label: 'Average Degree',
      value: qpu.connectivity?.avgDegree ?? null,
    },
    {
      label: 'Native Gates',
      value: qpu.nativeGates ? qpu.nativeGates.join(', ') : null,
    },
    {
      label: 'Cloud Platforms',
      value: qpu.cloudPlatforms.length > 0 ? qpu.cloudPlatforms.join(', ') : null,
    },
    {
      label: 'Regions',
      value: qpu.regions.length > 0 ? qpu.regions.join(', ') : null,
    },
    {
      label: 'Access Models',
      value: qpu.accessModels.length > 0 ? qpu.accessModels.map(m => m.replace(/-/g, ' ')).join(', ') : null,
    },
    {
      label: 'Announced',
      value: formatDateShort(qpu.announcedAt),
    },
    {
      label: 'Released',
      value: formatDateShort(qpu.releasedAt),
    },
  ]

  // ── Access pricing info ──
  const pricing = qpu.pricing
  const pricingDisplay = pricing
    ? (pricing.pricePerShot != null && pricing.pricePerShot !== undefined)
      ? `$${pricing.pricePerShot.toFixed(5)} / shot`
      : (pricing.pricePerTask != null && pricing.pricePerTask !== undefined)
        ? `$${pricing.pricePerTask.toFixed(4)} / task`
        : 'Contact provider'
    : 'Not available'

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
      {/* ── Breadcrumb ── */}
      <Breadcrumb
        items={[
          { label: 'QPU.co', href: '/' },
          { label: 'QPUs', href: '/qpus' },
          { label: providerName, href: `/providers/${qpu.providerId}` },
          { label: qpu.name },
        ]}
        className="mb-6"
      />

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* ════════════════════════════════════════════════
            LEFT COLUMN — Main content
            ════════════════════════════════════════════════ */}
        <div className="space-y-8 min-w-0">
          {/* ── Header Panel ── */}
          <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] p-6">
            {/* Provider link */}
            <Link
              href={`/providers/${qpu.providerId}`}
              className="text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors mb-2 inline-block"
              aria-label={`View all QPUs from ${providerName}`}
            >
              {providerName}
            </Link>

            {/* QPU name */}
            <h1 className="text-[var(--color-text-primary)] mb-4">{qpu.name}</h1>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <StatusBadge status={qpu.status} size="md" />
              <ArchitectureBadge architecture={qpu.architecture} size="md" />
              <Badge variant="outline">
                {qpu.paradigm === 'gate-based' ? 'Gate-based' : qpu.paradigm === 'annealing' ? 'Annealing' : qpu.paradigm === 'analog' ? 'Analog' : 'Hybrid'}
              </Badge>
            </div>

            {/* Description */}
            {qpu.description && (
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-5 max-w-none">
                {qpu.description}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <CompareButton qpuId={qpu.id} qpuName={qpu.name} size="md" />
              {qpu.cloudPlatforms.length > 0 && (
                <Link
                  href={`#access`}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 text-sm font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-overlay)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  View Access Options →
                </Link>
              )}
            </div>

            {/* Data freshness */}
            <DataFreshness updatedAt={qpu.updatedAt} verifiedAt={qpu.verifiedAt ?? undefined} />
          </section>

          {/* ── Performance Metrics ── */}
          <Section id="performance" title="Performance Metrics">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              <MetricCard
                label="1Q Gate Fidelity"
                value={qpu.fidelity?.singleQubitGate?.value ?? null}
                unit="%"
                description={qpu.fidelity?.singleQubitGate?.notes ?? undefined}
                source={qpu.fidelity?.singleQubitGate?.source}
                highlight={qpu.fidelity?.singleQubitGate?.value !== null}
              />
              <MetricCard
                label="2Q Gate Fidelity"
                value={qpu.fidelity?.twoQubitGate?.value ?? null}
                unit="%"
                description={qpu.fidelity?.twoQubitGate?.notes ?? undefined}
                source={qpu.fidelity?.twoQubitGate?.source}
                highlight={qpu.fidelity?.twoQubitGate?.value !== null}
              />
              <MetricCard
                label="Readout Fidelity"
                value={qpu.fidelity?.readout?.value ?? null}
                unit="%"
                description={qpu.fidelity?.readout?.notes ?? undefined}
                source={qpu.fidelity?.readout?.source}
              />
              <MetricCard
                label="Coherence T1"
                value={qpu.coherence?.t1?.value ?? null}
                unit={qpu.coherence?.t1?.unit ?? 'µs'}
                description={qpu.coherence?.t1?.notes ?? undefined}
                source={qpu.coherence?.t1?.source}
              />
              <MetricCard
                label="Coherence T2"
                value={qpu.coherence?.t2?.value ?? null}
                unit={qpu.coherence?.t2?.unit ?? 'µs'}
                description={qpu.coherence?.t2?.notes ?? undefined}
                source={qpu.coherence?.t2?.source}
              />
              {qpu.connectivity && (
                <MetricCard
                  label="Connectivity"
                  value={qpu.connectivity.allToAll ? 'All-to-all' : qpu.connectivity.topology}
                  description={
                    qpu.connectivity.avgDegree !== null && qpu.connectivity.avgDegree !== undefined
                      ? `Avg. degree: ${qpu.connectivity.avgDegree}`
                      : undefined
                  }
                />
              )}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] italic">
              Performance metrics vary by operating conditions and measurement methodology. Values represent manufacturer-reported or independently measured figures.
            </p>
          </Section>

          {/* ── Processor Topology ── */}
          <Section id="topology" title="Processor Topology">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-raised)] overflow-hidden p-4">
              <ArchitectureTopology architecture={qpu.architecture} />
            </div>
            <p className="mt-2 text-[11px] text-[var(--color-text-muted)] text-center italic">
              Conceptual {architectureLabel(qpu.architecture)} architecture representation
              {qpu.topology ? ` · ${qpu.topology}` : ''}
            </p>
          </Section>

          {/* ── Best Suited For ── */}
          {applicableUseCases.length > 0 && (
            <Section id="use-cases" title="Best Suited For">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {applicableUseCases.map(uc => {
                  const suit = uc.architectureSuitability[qpu.architecture]
                  const color = suit === 'strong' ? 'var(--color-success)' : suit === 'possible' ? 'var(--color-warning)' : 'var(--color-text-muted)'
                  return (
                    <div
                      key={uc.id}
                      className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-raised)]"
                    >
                      <span
                        style={{ color }}
                        className="shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        {suit === 'strong' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">{uc.name}</p>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 capitalize">{suit}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] italic">
                Based on {architectureLabel(qpu.architecture)} architecture characteristics and published use-case research.
              </p>
            </Section>
          )}

          {/* ── Technical Specifications ── */}
          <Section id="specs" title="Technical Specifications">
            <TechnicalTable rows={techRows} />
          </Section>

          {/* ── Sources ── */}
          {qpu.sources.length > 0 && (
            <Section id="sources" title="Data Sources">
              <div className="space-y-3">
                {qpu.sources.map((source, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-raised)]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug truncate">
                        {source.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--color-text-muted)]">{source.publisher}</span>
                        <Badge variant="muted" size="sm">
                          {SOURCE_TYPE_LABELS[source.sourceType]}
                        </Badge>
                        <span className="text-[11px] text-[var(--color-text-faint)]">
                          Accessed {source.accessedAt}
                        </span>
                      </div>
                    </div>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline underline-offset-2 transition-colors"
                        aria-label={`Open source: ${source.title}`}
                      >
                        <ExternalLink size={11} />
                        Open
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[var(--color-text-muted)] italic">
                All factual specifications cite primary manufacturer or cloud provider documentation.
              </p>
            </Section>
          )}

          {/* ── Related QPUs ── */}
          {relatedQpus.length > 0 && (
            <Section id="related" title="Related Processors">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedQpus.map(rel => {
                  const relProvider = providers.find(p => p.id === rel.providerId)
                  return (
                    <QPUCard
                      key={rel.id}
                      qpu={rel}
                      providerName={relProvider?.shortName}
                      compact
                    />
                  )
                })}
              </div>
            </Section>
          )}
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT SIDEBAR
            ════════════════════════════════════════════════ */}
        <aside className="space-y-4 lg:sticky lg:top-[80px]" aria-label="QPU details sidebar">
          {/* Card 1 — Access */}
          <SidebarCard id="access" title="Access This QPU">
            {qpu.cloudPlatforms.length > 0 ? (
              <div className="space-y-2">
                {qpu.cloudPlatforms.map(platform => (
                  <div
                    key={platform}
                    className="flex items-center justify-between gap-2 py-2 border-b border-[var(--color-border-subtle)] last:border-none"
                  >
                    <span className="text-sm text-[var(--color-text-secondary)] font-mono">{platform}</span>
                    <Badge variant="muted" size="sm">Cloud</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">Contact provider for access options.</p>
            )}

            {pricing && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <p className="mono-label mb-1.5">Pricing</p>
                <p className="text-sm text-[var(--color-text-primary)] font-medium">{pricingDisplay}</p>
                {pricing.notes && (
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1 leading-snug">{pricing.notes}</p>
                )}
              </div>
            )}

            {qpu.accessModels.length > 0 && (
              <div className="mt-3">
                <p className="mono-label mb-1.5">Access Model</p>
                <div className="flex flex-wrap gap-1">
                  {qpu.accessModels.map(m => (
                    <Badge key={m} variant="outline" size="sm">
                      {m.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {provider?.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-1.5 w-full h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-raised)] text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-overlay)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <ExternalLink size={12} />
                Visit {provider.shortName ?? provider.name}
              </a>
            )}
          </SidebarCard>

          {/* Card 2 — Framework Compatibility */}
          {qpuFrameworks.length > 0 && (
            <SidebarCard title="Framework Compatibility">
              <div className="space-y-2">
                {qpuFrameworks.map(fw => (
                  <div key={fw.id} className="flex items-center gap-2.5 py-1.5 border-b border-[var(--color-border-subtle)] last:border-none">
                    <CheckCircle2 size={13} className="text-[var(--color-success)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] leading-none">{fw.name}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{fw.maintainer}</p>
                    </div>
                    {fw.docsUrl && (
                      <a
                        href={fw.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 text-[10px] text-[var(--color-accent)] hover:underline"
                        aria-label={`${fw.name} documentation`}
                      >
                        Docs →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </SidebarCard>
          )}

          {/* Card 3 — Quick Stats */}
          <SidebarCard title="Quick Stats">
            <div className="space-y-3">
              <QuickStat label="Physical Qubits" value={formatQubits(qpu.physicalQubits)} />
              {qpu.algorithmicQubits && (
                <QuickStat label="Algorithmic Qubits" value={`#AQ ${qpu.algorithmicQubits}`} />
              )}
              <QuickStat label="Architecture" value={architectureLabel(qpu.architecture)} />
              <QuickStat
                label="Status"
                value={qpu.status.charAt(0).toUpperCase() + qpu.status.slice(1).replace(/-/g, ' ')}
              />
              {qpu.cloudPlatforms.length > 0 && (
                <QuickStat label="Platforms" value={String(qpu.cloudPlatforms.length)} />
              )}
              {qpu.nativeGates && (
                <QuickStat label="Native Gates" value={String(qpu.nativeGates.length)} />
              )}
            </div>
          </SidebarCard>

          {/* Card 4 — Suggest Correction */}
          <SidebarCard title="Data Accuracy">
            <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">
              QPU.co maintains independently verified hardware specifications. If you spot an error or have updated data, please let us know.
            </p>
            <CorrectionModal qpuName={qpu.name} qpuSlug={qpu.slug} />
          </SidebarCard>
        </aside>
      </div>
    </div>
  )
}

// ── Helper components ─────────────────────────────────────────────────────────

function Section({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-label={title}>
      <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-sm bg-[var(--color-accent)] opacity-60"
          aria-hidden="true"
        />
        {title}
      </h2>
      {children}
    </section>
  )
}

function SidebarCard({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] p-4"
    >
      <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-4"
        style={{ letterSpacing: '0.08em' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[11px] font-mono text-[var(--color-text-muted)]">{label}</span>
      <span className={cn('text-sm font-mono font-medium text-[var(--color-text-primary)] text-right', value === '—' && 'text-[var(--color-text-faint)]')}>
        {value}
      </span>
    </div>
  )
}
