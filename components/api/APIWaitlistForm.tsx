'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface FormState {
  name: string
  email: string
  company: string
  useCase: string
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  company: '',
  useCase: '',
}

export default function APIWaitlistForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  if (submitted) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '48px 24px',
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
        }}
      >
        <CheckCircle2
          size={40}
          style={{ color: 'var(--color-success)', marginBottom: '20px' }}
          aria-hidden="true"
        />
        <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>
          You&apos;re on the list.
        </h3>
        <p
          style={{
            margin: '0 0 24px',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            maxWidth: '44ch',
          }}
        >
          We&apos;ll reach out when API access opens. In the meantime, explore{' '}
          <Link
            href="/qpus"
            style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
          >
            QPU specs
          </Link>{' '}
          and the{' '}
          <Link
            href="/advisor"
            style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
          >
            QPU Advisor
          </Link>
          .
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSubmitted(false)
            setForm(INITIAL_STATE)
          }}
        >
          Back to form
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      noValidate
    >
      {/* Name */}
      <Input
        label="Name"
        id="waitlist-name"
        name="name"
        type="text"
        required
        placeholder="Your name"
        value={form.name}
        onChange={handleChange}
        autoComplete="name"
      />

      {/* Work Email */}
      <Input
        label="Work Email"
        id="waitlist-email"
        name="email"
        type="email"
        required
        placeholder="you@company.com"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
      />

      {/* Company (optional) */}
      <Input
        label="Company (optional)"
        id="waitlist-company"
        name="company"
        type="text"
        placeholder="Company or institution"
        value={form.company}
        onChange={handleChange}
        autoComplete="organization"
      />

      {/* Use Case */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="waitlist-use-case"
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
          }}
        >
          Use Case
        </label>
        <textarea
          id="waitlist-use-case"
          name="useCase"
          rows={4}
          required
          placeholder="Describe your use case — e.g. real-time QPU routing for a hybrid quantum-classical pipeline"
          value={form.useCase}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--color-bg-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            fontSize: '14px',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 150ms',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
          }}
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        loading={loading}
        disabled={loading}
        className="w-full"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {loading ? 'Submitting…' : 'Join the API Waitlist'}
      </Button>

      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: 'var(--color-text-faint)',
          textAlign: 'center',
        }}
      >
        No spam. We&apos;ll only contact you about API access.
      </p>
    </form>
  )
}
