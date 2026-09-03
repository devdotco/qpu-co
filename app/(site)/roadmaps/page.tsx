import type { Metadata } from 'next'
import { getProviders, getRoadmapEvents } from '@/lib/data'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { RoadmapTimeline } from '@/components/provider/RoadmapTimeline'

export const metadata: Metadata = {
  title: 'Quantum Hardware Roadmaps',
  description:
    'Public hardware roadmaps from quantum computing manufacturers. Track announced, targeted, and conceptual processor generations.',
}

const STATUS_LEGEND = [
  { label: 'Released', color: '#4ADE80', bg: 'rgba(74,222,128,0.12)' },
  { label: 'Current', color: '#22D3EE', bg: 'rgba(34,211,238,0.12)' },
  { label: 'Announced', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  { label: 'Targeted', color: '#9AA4B2', bg: 'rgba(154,164,178,0.1)' },
  { label: 'Conceptual', color: '#3D4754', bg: 'rgba(61,71,84,0.1)' },
]

export default async function RoadmapsPage() {
  const [providers, allEvents] = await Promise.all([
    getProviders(),
    getRoadmapEvents(),
  ])

  const activeProviders = providers.filter(p => p.status === 'active')
  const hasAnyEvents = allEvents.length > 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {/* Header */}
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'roadmaps' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 18, maxWidth: 600 }}>
            Quantum Hardware Roadmaps
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '58ch' }}>
            Public hardware roadmaps from quantum computing manufacturers. Timelines shift,
            specifications change, and announced hardware does not always ship as described.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {/* Disclaimer */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(245,158,11,0.2)',
            background: 'rgba(245,158,11,0.05)',
            marginBottom: 40,
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: 'var(--color-warning)', fontWeight: 600 }}>Disclaimer:</strong>{' '}
            Hardware roadmaps are inherently uncertain. QPU.co presents roadmap information as announced
            by manufacturers — not as forecasts or commitments. Treat all future dates as estimates only.
          </p>
        </div>

        {/* Status legend */}
        <div style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Status Legend</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {STATUS_LEGEND.map(s => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-panel)',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: s.color,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--color-text-muted)' }}>
            Conceptual milestones are long-term visions with no formal commitment. Targeted milestones
            are public goals without formal announcement.
          </p>
        </div>

        {/* Roadmaps per provider */}
        {!hasAnyEvents ? (
          <EmptyState
            title="Roadmap data is being added"
            description="Roadmap data is added as manufacturers publish it. Check individual provider pages for the latest hardware updates and announcements."
            action={{ label: 'View Providers', href: '/providers' }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {activeProviders.map(provider => {
              const events = allEvents.filter(e => e.providerId === provider.id)
              return (
                <div
                  key={provider.id}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-panel)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--color-border)',
                      background: 'var(--color-bg-raised)',
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {provider.name}
                    </span>
                    <Badge variant="muted">{provider.primaryArchitecture}</Badge>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                      {events.length} event{events.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <RoadmapTimeline events={events} providerId={provider.id} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer note */}
        <p
          style={{
            marginTop: 40,
            fontSize: 12,
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          All roadmap information is sourced from manufacturer announcements and official documentation.
          QPU.co does not independently verify future milestones.
        </p>
      </div>
    </div>
  )
}
