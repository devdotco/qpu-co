import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Privacy Policy — QPU.co',
  description: 'QPU.co privacy policy covering data collection, use, and user rights.',
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'privacy' }]}
            className="mb-6"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 0 }}>
              Privacy Policy
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
            This is a draft privacy policy for internal review. It has not been reviewed by legal counsel
            and should not be published to users in its current form.
          </p>
        </div>

        {[
          {
            heading: '1. Information We Collect',
            body: `We collect information you provide directly to us, such as when you submit a form, contact us, or request an enterprise assessment. This may include your name, email address, company, and role.

We may also collect usage data automatically when you visit QPU.co, including pages viewed, time on page, and browser/device information. This data is used to improve the platform.`,
          },
          {
            heading: '2. How We Use Information',
            body: `We use the information we collect to respond to your requests, improve QPU.co, communicate with you about updates or assessments, and analyze how the platform is used.

We do not sell personal information to third parties.`,
          },
          {
            heading: '3. Information Sharing',
            body: `QPU.co does not share personal contact information with hardware vendors or commercial partners without your explicit consent. We may share anonymized, aggregated usage data.

We may share information with service providers who help us operate the platform (e.g., email delivery, analytics), subject to confidentiality agreements.`,
          },
          {
            heading: '4. Cookies and Tracking',
            body: `QPU.co may use cookies and similar technologies to maintain session state, analyze usage, and improve the user experience. You can control cookies through your browser settings.`,
          },
          {
            heading: '5. Data Retention',
            body: `We retain personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data by contacting us.`,
          },
          {
            heading: '6. Your Rights',
            body: `Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal data. Contact us at general@qpu.co to exercise these rights.`,
          },
          {
            heading: '7. Security',
            body: `We implement reasonable technical and organizational measures to protect personal information. No method of transmission over the internet is 100% secure.`,
          },
          {
            heading: '8. Changes to This Policy',
            body: `We may update this privacy policy from time to time. We will note the date of the most recent update at the top of this page.`,
          },
          {
            heading: '9. Contact',
            body: `Questions about this privacy policy? Contact us at general@qpu.co.`,
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
