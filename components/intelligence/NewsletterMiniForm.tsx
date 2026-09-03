'use client'

import { useState } from 'react'

export function NewsletterMiniForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) setDone(true)
  }

  if (done) {
    return (
      <p style={{ fontSize: '13px', color: 'var(--color-success)', marginTop: '8px' }}>
        Subscribed! First issue coming soon.
      </p>
    )
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-2 focus:outline-[var(--color-accent)] focus:border-transparent"
      />
      <button
        type="submit"
        className="w-full py-2 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg-base)] hover:opacity-90 transition-opacity"
      >
        Subscribe
      </button>
    </form>
  )
}
