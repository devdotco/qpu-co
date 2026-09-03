import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { EnterpriseForm } from '@/components/forms/EnterpriseForm'
import { EnterpriseFlow } from '@/components/svg/EnterpriseFlow'

export const metadata: Metadata = {
  title: 'Enterprise Quantum Infrastructure Assessment — QPU.co',
  description:
    'QPU.co helps R&D teams, technical executives, and research institutions evaluate quantum computing hardware, compare providers, and identify appropriate workloads.',
}

const WHO_CARDS = [
  {
    title: 'R&D and Innovation Teams',
    body: 'Evaluate processor architectures before committing to cloud providers or research partnerships.',
  },
  {
    title: 'Technical Executives',
    body: 'Understand the quantum hardware landscape without vendor-biased briefings.',
  },
  {
    title: 'Research Institutions',
    body: 'Identify hardware options for specific research domains and access models suited to academic workflows.',
  },
  {
    title: 'Pharmaceutical / Materials Companies',
    body: 'Assess quantum chemistry hardware for near-term molecular simulation and drug discovery research.',
  },
  {
    title: 'Financial Institutions',
    body: 'Evaluate optimization and simulation QPU candidates for portfolio, risk, and logistics applications.',
  },
]

const SERVICE_CARDS = [
  {
    title: 'Hardware Landscape Assessment',
    body: 'Independent overview of available QPUs by architecture, provider, and access model.',
  },
  {
    title: 'QPU Comparison',
    body: 'Structured comparison of processors relevant to your workload type, with appropriate architectural context.',
  },
  {
    title: 'Architecture Analysis',
    body: 'Technical briefing on which architectures suit your problem domain and why architecture matters for your use case.',
  },
  {
    title: 'Access Strategy',
    body: 'Cloud vs. direct vs. research program recommendations based on your team\'s needs and timeline.',
  },
  {
    title: 'Workload Evaluation',
    body: 'Assessment of workload suitability for current-generation hardware, including honest readiness estimates.',
  },
  {
    title: 'Provider Introductions',
    body: 'Connections to hardware providers and cloud platforms — after we understand what\'s right for you.',
  },
]

export default function EnterprisePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
      }}
    >
      {/* Hero */}
      <section
        style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '56px 24px 48px',
        }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'enterprise' }]}
            className="mb-6"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Badge variant="outline">Enterprise</Badge>
          </div>
          <h1
            style={{
              color: 'var(--color-text-primary)',
              marginBottom: 18,
              maxWidth: 640,
            }}
          >
            Make Better Quantum Infrastructure Decisions
          </h1>
          <p
            style={{
              fontSize: 17,
              color: 'var(--color-text-secondary)',
              maxWidth: 560,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            QPU.co helps technical teams and research institutions navigate quantum
            hardware — independently.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        {/* Two-column layout: content + form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
            gap: 60,
            alignItems: 'start',
          }}
          className="enterprise-grid"
        >
          {/* Left column */}
          <div>
            {/* Who this is for */}
            <section style={{ marginBottom: 56 }}>
              <p className="eyebrow" style={{ marginBottom: 20 }}>Who This Is For</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {WHO_CARDS.map(card => (
                  <Card key={card.title} padding="md">
                    <CardTitle className="mb-1.5">{card.title}</CardTitle>
                    <CardContent>
                      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
                        {card.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* What we help with */}
            <section style={{ marginBottom: 56 }}>
              <p className="eyebrow" style={{ marginBottom: 20 }}>What We Help With</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                {SERVICE_CARDS.map(card => (
                  <Card key={card.title} padding="md">
                    <CardTitle className="mb-1.5">{card.title}</CardTitle>
                    <CardContent>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                        {card.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Flow diagram */}
            <section style={{ marginBottom: 56 }}>
              <p className="eyebrow" style={{ marginBottom: 20 }}>How It Works</p>
              <div
                style={{
                  padding: '28px 24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-panel)',
                }}
              >
                <EnterpriseFlow />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--color-text-muted)',
                  marginTop: 10,
                  fontFamily: 'var(--font-mono), monospace',
                }}
              >
                We assess your workloads and help route them to appropriate hardware — not the nearest commercial partner.
              </p>
            </section>

            {/* Honest positioning */}
            <section>
              <p className="eyebrow" style={{ marginBottom: 16 }}>Our Positioning</p>
              <div
                style={{
                  padding: '20px 22px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(34,211,238,0.15)',
                  background: 'rgba(34,211,238,0.04)',
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  QPU.co is an independent intelligence platform. We do not operate hardware,
                  guarantee performance outcomes, or have commercial agreements that influence our
                  assessments. Hardware capabilities are changing rapidly — we help teams make
                  informed decisions based on current evidence.
                </p>
              </div>
              <p style={{ marginTop: 14, fontSize: 13, color: 'var(--color-text-muted)' }}>
                Read our{' '}
                <Link
                  href="/methodology"
                  style={{ color: 'var(--color-accent)', textDecoration: 'underline', textDecorationColor: 'rgba(34,211,238,0.4)' }}
                >
                  data methodology
                </Link>{' '}
                for more on how we maintain editorial independence.
              </p>
            </section>
          </div>

          {/* Right column: form */}
          <div>
            <div
              style={{
                position: 'sticky',
                top: 80,
                padding: '28px 24px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-panel)',
              }}
            >
              <h2 style={{ fontSize: 18, marginBottom: 6, color: 'var(--color-text-primary)' }}>
                Request an Assessment
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24, maxWidth: '100%' }}>
                Tell us about your organization and what you're trying to accomplish.
                We'll review your request and respond within 2 business days.
              </p>
              <EnterpriseForm />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .enterprise-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
