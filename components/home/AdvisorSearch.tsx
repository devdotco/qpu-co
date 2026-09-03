'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'Molecular simulation',
  'Portfolio optimization',
  'Vehicle routing',
  'Quantum ML',
]

export default function AdvisorSearch() {
  const [query, setQuery] = useState('')
  const [chipIndex, setChipIndex] = useState(0)
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setChipIndex(i => (i + 1) % EXAMPLES.length)
    }, 3000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim() || EXAMPLES[chipIndex]
    router.push(`/qpu-advisor?q=${encodeURIComponent(q)}`)
  }

  function handleChipClick(example: string) {
    setQuery(example)
  }

  return (
    <div style={{ marginTop: '28px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', maxWidth: '560px' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="What are you trying to compute?"
            style={{
              width: '100%',
              background: 'var(--color-bg-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '15px',
              color: 'var(--color-text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          />
        </div>

        {/* Example chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', maxWidth: '560px' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleChipClick(ex)}
              style={{
                padding: '3px 10px',
                borderRadius: '9999px',
                border: `1px solid ${i === chipIndex ? 'rgba(34,211,238,0.4)' : 'var(--color-border)'}`,
                background: i === chipIndex ? 'rgba(34,211,238,0.06)' : 'transparent',
                color: i === chipIndex ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          style={{
            marginTop: '12px',
            padding: '10px 24px',
            background: 'var(--color-accent)',
            color: '#06080B',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.01em',
          }}
        >
          Find a QPU →
        </button>
      </form>

      <p style={{
        marginTop: '8px',
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.02em',
      }}>
        AI-assisted recommendations based on published hardware characteristics.
      </p>
    </div>
  )
}
