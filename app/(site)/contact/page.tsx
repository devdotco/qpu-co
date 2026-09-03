'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CorrectionForm } from '@/components/forms/CorrectionForm'

type ContactCategory = 'none' | 'correction'

const CATEGORY_CARDS = [
  {
    id: 'general',
    title: 'General',
    description: 'Questions about QPU.co, the data, or the platform.',
    detail: 'general@qpu.co',
    isEmail: true,
    action: null as ContactCategory | null,
    linkHref: null as string | null,
  },
  {
    id: 'correction',
    title: 'Data Correction',
    description: 'Found an error in our data? Submit a correction with source documentation.',
    detail: null,
    isEmail: false,
    action: 'correction' as ContactCategory,
    linkHref: null as string | null,
  },
  {
    id: 'enterprise',
    title: 'Enterprise Assessment',
    description: 'Request an independent quantum hardware assessment for your organization.',
    detail: null,
    isEmail: false,
    action: null as ContactCategory | null,
    linkHref: '/enterprise',
  },
  {
    id: 'partner',
    title: 'Partnership',
    description: 'Hardware providers, cloud platforms, research institutions, and data partners.',
    detail: null,
    isEmail: false,
    action: null as ContactCategory | null,
    linkHref: '/partner',
  },
  {
    id: 'press',
    title: 'Press',
    description: 'Media inquiries, interview requests, and editorial questions.',
    detail: 'press@qpu.co',
    isEmail: true,
    action: null as ContactCategory | null,
    linkHref: null as string | null,
  },
  {
    id: 'advertising',
    title: 'Advertising',
    description: 'QPU.co accepts limited sponsorships. Sponsored content is clearly labeled and kept separate from editorial.',
    detail: 'general@qpu.co',
    isEmail: true,
    action: null as ContactCategory | null,
    linkHref: null as string | null,
  },
]

export default function ContactPage() {
  const [activeCategory, setActiveCategory] = useState<ContactCategory>('none')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'contact' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 14 }}>Contact</h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '52ch' }}>
            Select a category below to find the right contact or form for your request.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>

        {/* Category cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 12,
            marginBottom: 48,
          }}
        >
          {CATEGORY_CARDS.map(card => {
            const isActive = card.action === activeCategory && activeCategory !== 'none'
            return (
              <div
                key={card.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${isActive ? 'rgba(34,211,238,0.3)' : 'var(--color-border)'}`,
                  background: isActive ? 'rgba(34,211,238,0.04)' : 'var(--color-bg-panel)',
                  cursor: card.action || card.linkHref ? 'pointer' : 'default',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onClick={() => {
                  if (card.action) {
                    setActiveCategory(prev => prev === card.action ? 'none' : card.action!)
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        marginBottom: 6,
                        transition: 'color 0.15s',
                      }}
                    >
                      {card.title}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0 }}>
                      {card.description}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  {card.isEmail && card.detail && (
                    <a
                      href={`mailto:${card.detail}`}
                      style={{
                        fontSize: 12,
                        color: 'var(--color-accent)',
                        fontFamily: 'var(--font-mono), monospace',
                        textDecoration: 'none',
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      {card.detail}
                    </a>
                  )}
                  {card.linkHref && (
                    <Link
                      href={card.linkHref}
                      style={{
                        fontSize: 12,
                        color: 'var(--color-accent)',
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      Go to {card.title} →
                    </Link>
                  )}
                  {card.action && !card.linkHref && !card.isEmail && (
                    <span
                      style={{
                        fontSize: 12,
                        color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                        fontWeight: 500,
                        transition: 'color 0.15s',
                      }}
                    >
                      {isActive ? 'Form shown below ↓' : 'Click to open form →'}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Data Correction Form */}
        {activeCategory === 'correction' && (
          <div
            style={{
              padding: '28px 26px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-panel)',
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                Submit a Data Correction
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '52ch' }}>
                Include a link to a primary source that documents the correct value.
                We will not apply corrections that cannot be verified.
              </p>
            </div>
            <CorrectionForm />
          </div>
        )}
      </div>
    </div>
  )
}
