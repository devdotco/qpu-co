import type { Metadata } from 'next'
import { Activity, Cpu, FlaskConical, LayoutDashboard } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import APIWaitlistForm from '@/components/api/APIWaitlistForm'
import APIRoutingDiagram from '@/components/svg/APIRoutingDiagram'

export const metadata: Metadata = {
  title: 'QPU.co API — Quantum Hardware Intelligence by API',
  description:
    'Programmatic access to QPU specifications, availability, benchmarks, and workload recommendations. Join the API waitlist.',
}

// ─── Endpoint data ───────────────────────────────────────────────────────────

interface Endpoint {
  method: 'GET' | 'POST'
  path: string
  description: string
  sample: string
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    path: '/v1/qpus',
    description:
      'List all quantum processors with filtering by architecture, provider, and status.',
    sample: '{ "data": [{ "id": "ionq-forte", "qubits": 36, ... }] }',
  },
  {
    method: 'GET',
    path: '/v1/qpus/{id}',
    description: 'Full specifications for a specific QPU.',
    sample: '{ "id": "ibm-eagle-r3", "qubits": 127, "t1_us": 270, ... }',
  },
  {
    method: 'GET',
    path: '/v1/providers',
    description: 'Quantum hardware providers and their processor portfolios.',
    sample: '{ "data": [{ "id": "ibm", "name": "IBM Quantum", ... }] }',
  },
  {
    method: 'GET',
    path: '/v1/availability',
    description: 'Current access status for all tracked QPUs.',
    sample: '{ "ionq-forte": "online", "ibm-eagle-r3": "maintenance" }',
  },
  {
    method: 'GET',
    path: '/v1/benchmarks',
    description: 'Published benchmark data by QPU and metric.',
    sample: '{ "qpu": "quantinuum-h2-1", "2q_fidelity": 0.999 }',
  },
  {
    method: 'POST',
    path: '/v1/recommend',
    description: 'Workload-based QPU recommendations.',
    sample: '{ "recommended_architecture": "trapped-ion", "confidence": 0.87 }',
  },
]

// ─── Use-case data ───────────────────────────────────────────────────────────

interface UseCase {
  icon: React.ReactNode
  title: string
  description: string
}

const USE_CASES: UseCase[] = [
  {
    icon: <Activity size={20} aria-hidden="true" />,
    title: 'Hardware Availability Monitoring',
    description:
      'Real-time QPU status tracking for automated job dispatch and queue management.',
  },
  {
    icon: <Cpu size={20} aria-hidden="true" />,
    title: 'Automated QPU Selection',
    description:
      'Route workloads to optimal hardware based on circuit requirements and fidelity targets.',
  },
  {
    icon: <FlaskConical size={20} aria-hidden="true" />,
    title: 'Research Tooling Integration',
    description:
      'Embed QPU comparison data into notebooks and research workflows without manual tracking.',
  },
  {
    icon: <LayoutDashboard size={20} aria-hidden="true" />,
    title: 'Hardware Intelligence Dashboards',
    description:
      'Build internal dashboards with live QPU specification and availability data.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '4px',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        background:
          method === 'GET'
            ? 'rgba(74,222,128,0.12)'
            : 'rgba(34,211,238,0.12)',
        color:
          method === 'GET' ? 'var(--color-success)' : 'var(--color-accent)',
        border: `1px solid ${method === 'GET' ? 'rgba(74,222,128,0.2)' : 'rgba(34,211,238,0.2)'}`,
        flexShrink: 0,
      }}
    >
      {method}
    </span>
  )
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div
      className="panel"
      style={{ padding: '20px 24px' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        <MethodBadge method={endpoint.method} />
        <code
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
          }}
        >
          {endpoint.path}
        </code>
      </div>
      <p
        style={{
          margin: '0 0 12px',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          maxWidth: '60ch',
        }}
      >
        {endpoint.description}
      </p>
      <div
        className="code-block"
        style={{
          fontSize: '11px',
          padding: '10px 14px',
          color: 'var(--color-text-muted)',
        }}
      >
        {endpoint.sample}
      </div>
    </div>
  )
}

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  return (
    <div
      className="panel"
      style={{ padding: '28px 28px' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: 'var(--color-accent-dim)',
          color: 'var(--color-accent)',
          marginBottom: '16px',
        }}
      >
        {useCase.icon}
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{useCase.title}</h3>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        {useCase.description}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function APIPage() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section
        className="grid-bg"
        style={{
          background: 'var(--color-bg-base)',
          borderBottom: '1px solid var(--color-border)',
          padding: '80px 0 88px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: '680px' }}>
            {/* Coming Soon badge */}
            <div style={{ marginBottom: '20px' }}>
              <Badge variant="warning" size="md" dot>
                Coming Soon
              </Badge>
            </div>

            <h1 style={{ margin: '0 0 20px' }}>
              Quantum Hardware Intelligence by API
            </h1>

            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.65',
                color: 'var(--color-text-secondary)',
                marginBottom: '36px',
                maxWidth: '56ch',
              }}
            >
              Programmatic access to QPU data, availability, benchmarks, and
              workload recommendations. Build quantum-aware applications without
              manually tracking hardware specifications.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="#waitlist"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  background: 'var(--color-accent)',
                  color: '#06080B',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Join Waitlist
              </a>
              <a
                href="#endpoints"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                View Endpoints
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Conceptual Endpoints ───────────────────────────────────────── */}
      <section
        id="endpoints"
        style={{
          background: 'var(--color-bg-raised)',
          borderBottom: '1px solid var(--color-border)',
          padding: '80px 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>
              API REFERENCE (PREVIEW)
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '0',
              }}
            >
              <h2 style={{ margin: 0 }}>Planned Endpoints</h2>
              <Badge variant="warning" size="sm">
                Illustrative — API not yet available
              </Badge>
            </div>
          </div>

          {/* Endpoint cards — 2-column grid on wider screens */}
          <div className="endpoints-grid" style={{ display: 'grid', gap: '16px' }}>
            {ENDPOINTS.map((ep) => (
              <EndpointCard key={ep.path} endpoint={ep} />
            ))}
          </div>
        </div>

        <style>{`
          .endpoints-grid {
            grid-template-columns: 1fr;
          }
          @media (min-width: 768px) {
            .endpoints-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </section>

      {/* ── 3. Example Request / Response ─────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-bg-base)',
          borderBottom: '1px solid var(--color-border)',
          padding: '80px 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '12px',
              }}
            >
              <span className="eyebrow">REPRESENTATIVE SAMPLE</span>
              <Badge variant="warning" size="sm">
                Not a live API response
              </Badge>
            </div>
            <h2 style={{ margin: 0 }}>Example: Workload Recommendation</h2>
          </div>

          {/* Two-column layout */}
          <div className="example-grid" style={{ display: 'grid', gap: '24px' }}>
            {/* Left — Request */}
            <div>
              <p
                className="mono-label"
                style={{ marginBottom: '10px', display: 'block' }}
              >
                Request
              </p>
              <pre
                className="code-block"
                style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >{`POST /v1/recommend
Authorization: Bearer sk_qpu_...

{
  "workload": "molecular-simulation",
  "framework": "qiskit",
  "priority": "fidelity",
  "min_qubits": 20
}`}</pre>
            </div>

            {/* Right — Response */}
            <div>
              <p
                className="mono-label"
                style={{ marginBottom: '10px', display: 'block' }}
              >
                Response
              </p>
              <pre
                className="code-block"
                style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >{`{
  "recommended_architecture": "trapped-ion",
  "confidence": 0.87,
  "candidates": [
    {
      "qpu": "ionq-forte",
      "fit_score": 0.87,
      "reasoning": [
        "High two-qubit gate fidelity (99.5%)",
        "All-to-all connectivity",
        "Qiskit compatible via Braket"
      ]
    },
    {
      "qpu": "quantinuum-h2-1",
      "fit_score": 0.84,
      "reasoning": [
        "Highest published 2Q fidelity (99.9%)",
        "All-to-all connectivity"
      ]
    }
  ],
  "disclaimer": "Recommendations are informational."
}`}</pre>
            </div>
          </div>

          {/* Disclaimer note */}
          <p
            style={{
              marginTop: '20px',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
            }}
          >
            Representative sample — API not yet available. Response structure
            subject to change.
          </p>
        </div>

        <style>{`
          .example-grid {
            grid-template-columns: 1fr;
          }
          @media (min-width: 768px) {
            .example-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </section>

      {/* ── 4. Use Cases ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-bg-raised)',
          borderBottom: '1px solid var(--color-border)',
          padding: '80px 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '48px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>
              USE CASES
            </span>
            <h2 style={{ margin: 0 }}>What You Can Build</h2>
          </div>

          <div className="usecases-grid" style={{ display: 'grid', gap: '20px' }}>
            {USE_CASES.map((uc) => (
              <UseCaseCard key={uc.title} useCase={uc} />
            ))}
          </div>
        </div>

        <style>{`
          .usecases-grid {
            grid-template-columns: 1fr;
          }
          @media (min-width: 640px) {
            .usecases-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </section>

      {/* ── 5. Routing Vision Diagram ──────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-bg-base)',
          borderBottom: '1px solid var(--color-border)',
          padding: '80px 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>
              ROUTING VISION
            </span>
            <h2 style={{ margin: '0 0 8px' }}>Future QPU Routing Layer</h2>
            <Badge variant="muted" size="sm">
              Under development — not yet available
            </Badge>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <APIRoutingDiagram />
          </div>
        </div>
      </section>

      {/* ── 6. Waitlist Form ──────────────────────────────────────────────── */}
      <section
        id="waitlist"
        style={{
          background: 'var(--color-bg-raised)',
          padding: '80px 0 96px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'grid',
              gap: '60px',
              alignItems: 'start',
            }}
            className="waitlist-grid"
          >
            {/* Left — copy */}
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>
                EARLY ACCESS
              </span>
              <h2 style={{ margin: '0 0 16px' }}>Join the API Waitlist</h2>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '24px',
                  maxWidth: '48ch',
                }}
              >
                The QPU.co API is in development. Join the waitlist to be
                notified when programmatic access to quantum hardware
                intelligence becomes available.
              </p>

              {/* Feature bullets */}
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {[
                  'QPU specs and availability via REST API',
                  'Workload-based hardware recommendations',
                  'Benchmark data for 30+ quantum processors',
                  'SDK support for Python and JavaScript (planned)',
                ].map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              <p
                style={{
                  marginTop: '28px',
                  padding: '14px 18px',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'rgba(245,158,11,0.9)',
                  maxWidth: '44ch',
                  lineHeight: 1.5,
                }}
              >
                This API does not yet exist. Joining the waitlist only
                registers your interest — no API key will be issued until the
                product launches.
              </p>
            </div>

            {/* Right — form */}
            <div
              className="panel"
              style={{ padding: '36px 32px' }}
            >
              <h3 style={{ margin: '0 0 24px', fontSize: '1.0625rem' }}>
                Request Early Access
              </h3>
              <APIWaitlistForm />
            </div>
          </div>
        </div>

        <style>{`
          .waitlist-grid {
            grid-template-columns: 1fr;
          }
          @media (min-width: 900px) {
            .waitlist-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}</style>
      </section>
    </>
  )
}
