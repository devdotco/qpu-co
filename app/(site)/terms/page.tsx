import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Terms of Use — QPU.co',
  description: 'QPU.co terms of use covering permitted use, data accuracy, and limitations of liability.',
}

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'terms' }]}
            className="mb-6"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 0 }}>
              Terms of Use
            </h1>
            <Badge variant="warning">Placeholder</Badge>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

        {/* Placeholder notice */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(245,158,11,0.3)',
            background: 'rgba(245,158,11,0.06)',
            marginBottom: 40,
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-warning)', fontWeight: 600, marginBottom: 4 }}>
            PLACEHOLDER — Replace with actual legal text before launch.
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
            This is a draft terms of use for internal review. It has not been reviewed by legal counsel
            and should not be published to users in its current form.
          </p>
        </div>

        {[
          {
            heading: '1. Acceptance of Terms',
            body: `By accessing or using QPU.co, you agree to be bound by these Terms of Use. If you do not agree, do not use the platform.`,
          },
          {
            heading: '2. Use of the Platform',
            body: `QPU.co provides information about quantum computing hardware for research, educational, and commercial evaluation purposes. You may use QPU.co for lawful purposes only.

You may not scrape, copy, or redistribute QPU.co data in bulk without written permission. Individual data points may be cited with attribution.`,
          },
          {
            heading: '3. Accuracy of Information',
            body: `QPU.co makes reasonable efforts to maintain accurate hardware specifications and benchmark data. However, quantum hardware is rapidly evolving and data may not always reflect the most current state.

QPU.co does not warrant that any data on the platform is accurate, complete, or current. Do not rely solely on QPU.co data for commercial procurement decisions.`,
          },
          {
            heading: '4. No Warranty',
            body: `QPU.co is provided "as is" without warranties of any kind, express or implied. We do not guarantee uptime, accuracy, or fitness for any particular purpose.`,
          },
          {
            heading: '5. Limitation of Liability',
            body: `To the maximum extent permitted by law, QPU.co and its operators shall not be liable for any indirect, incidental, or consequential damages arising from use of or inability to use the platform.`,
          },
          {
            heading: '6. Intellectual Property',
            body: `The QPU.co name, logo, and editorial content are the intellectual property of QPU.co. Hardware specifications sourced from manufacturers remain the property of their respective owners.`,
          },
          {
            heading: '7. Third-Party Links',
            body: `QPU.co links to third-party websites, documentation, and data sources. We are not responsible for the content or privacy practices of external sites.`,
          },
          {
            heading: '8. Changes to Terms',
            body: `We may update these terms at any time. Continued use of QPU.co after changes constitutes acceptance of the updated terms.`,
          },
          {
            heading: '9. Governing Law',
            body: `These terms are governed by the laws of [JURISDICTION — TO BE DETERMINED]. Disputes shall be resolved in [VENUE — TO BE DETERMINED].`,
          },
          {
            heading: '10. Contact',
            body: `Questions about these terms? Contact us at general@qpu.co.`,
          },
        ].map(section => (
          <section key={section.heading} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, color: 'var(--color-text-primary)', marginBottom: 10 }}>
              {section.heading}
            </h2>
            {section.body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
