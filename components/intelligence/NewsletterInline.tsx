'use client'

import { useState } from 'react'

export function NewsletterInline() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <p className="text-xs text-[var(--color-success)] font-mono">
        ✓ Subscribed. First issue arriving soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
