'use client'

import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading')
    // Simulate a subscription (replace with actual API call)
    await new Promise(r => setTimeout(r, 800))
    setState('success')
  }

  return (
    <section style={{
      background: 'var(--color-bg-base)',
      padding: '80px 0 100px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>
            NEWSLETTER
          </span>
          <h2 style={{ margin: '0 0 12px' }}>The QPU Brief</h2>
          <p style={{ margin: '0 0 32px', fontSize: '15px', maxWidth: '46ch', marginLeft: 'auto', marginRight: 'auto' }}>
            Processor launches, benchmark updates, hardware roadmaps, and quantum-computing infrastructure news. No hype.
          </p>

          {state === 'success' ? (
            <div style={{
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.25)',
              borderRadius: '10px',
              padding: '20px 24px',
              color: 'var(--color-success)',
              fontSize: '15px',
              fontWeight: '500',
            }}>
              You&apos;re subscribed. Look for the first issue soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'flex',
                gap: '10px',
                maxWidth: '420px',
                margin: '0 auto',
              }}
                className="newsletter-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  disabled={state === 'loading'}
                  style={{
                    flex: 1,
                    background: 'var(--color-bg-raised)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '11px 14px',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
                />
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  style={{
                    padding: '11px 20px',
                    background: state === 'loading' ? 'rgba(34,211,238,0.5)' : 'var(--color-accent)',
                    color: '#06080B',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: state === 'loading' ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                >
                  {state === 'loading' ? '...' : 'Subscribe'}
                </button>
              </div>

              {state === 'error' && (
                <p style={{ marginTop: '8px', color: 'var(--color-danger)', fontSize: '13px' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}

          <p style={{
            marginTop: '14px',
            fontSize: '11px',
            color: 'var(--color-text-faint)',
            maxWidth: 'none',
          }}>
            No spam. Unsubscribe anytime.{' '}
            <a href="/privacy" style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
              See Privacy Policy.
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .newsletter-row { flex-direction: column !important; }
        }
      `}</style>
    </section>
  )
}
