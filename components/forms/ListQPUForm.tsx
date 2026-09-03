'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { submitForm } from '@/lib/forms'

const ARCHITECTURE_OPTIONS = [
  { value: 'superconducting', label: 'Superconducting' },
  { value: 'trapped-ion', label: 'Trapped Ion' },
  { value: 'neutral-atom', label: 'Neutral Atom' },
  { value: 'photonic', label: 'Photonic' },
  { value: 'quantum-annealing', label: 'Quantum Annealing' },
  { value: 'topological', label: 'Topological' },
  { value: 'other', label: 'Other / Hybrid' },
]

export function ListQPUForm() {
  const [fields, setFields] = useState({
    companyName: '',
    processorName: '',
    architecture: '',
    physicalQubits: '',
    website: '',
    docsUrl: '',
    accessUrl: '',
    contactName: '',
    email: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  function set(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => { const next = { ...prev }; delete next[key]; return next })
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!fields.companyName.trim()) next.companyName = 'Company name is required.'
    if (!fields.processorName.trim()) next.processorName = 'Processor name is required.'
    if (!fields.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = 'Please enter a valid email address.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const result = await submitForm({
        type: 'list-qpu',
        data: { ...fields },
        submittedAt: new Date().toISOString(),
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } catch {
      setServerError('Unable to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '28px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(34,211,238,0.2)',
          background: 'rgba(34,211,238,0.04)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
          Thank you. We'll review your submission and contact you within 5 business days.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 380, margin: '0 auto' }}>
          We review each submission against our specification standards before publication.
          Submitting does not guarantee inclusion.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Company Name"
          placeholder="Your company"
          value={fields.companyName}
          onChange={e => set('companyName', e.target.value)}
          error={errors.companyName}
          required
        />
        <Input
          label="Processor Name"
          placeholder="e.g. Advantage2, Forte"
          value={fields.processorName}
          onChange={e => set('processorName', e.target.value)}
          error={errors.processorName}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Select
          label="Architecture"
          placeholder="Select architecture"
          options={ARCHITECTURE_OPTIONS}
          value={fields.architecture}
          onChange={v => set('architecture', v)}
        />
        <Input
          label="Physical Qubits"
          type="number"
          placeholder="e.g. 127"
          value={fields.physicalQubits}
          onChange={e => set('physicalQubits', e.target.value)}
        />
      </div>

      <Input
        label="Company Website"
        type="url"
        placeholder="https://yourcompany.com"
        value={fields.website}
        onChange={e => set('website', e.target.value)}
      />

      <Input
        label="Technical Documentation URL"
        type="url"
        placeholder="https://docs.yourcompany.com/processor"
        value={fields.docsUrl}
        onChange={e => set('docsUrl', e.target.value)}
        hint="Link to specifications, datasheets, or system cards."
      />

      <Input
        label="Public Access URL (if any)"
        type="url"
        placeholder="Cloud or reservation access page"
        value={fields.accessUrl}
        onChange={e => set('accessUrl', e.target.value)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Primary Contact Name"
          placeholder="Your name"
          value={fields.contactName}
          onChange={e => set('contactName', e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="contact@yourcompany.com"
          value={fields.email}
          onChange={e => set('email', e.target.value)}
          error={errors.email}
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor="listqpu-notes"
          style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}
        >
          Additional Notes <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="listqpu-notes"
          placeholder="Anything else we should know about the processor or access model."
          value={fields.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-raised)',
            color: 'var(--color-text-primary)',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
        />
      </div>

      {serverError && (
        <p style={{ fontSize: 13, color: 'var(--color-danger)' }} role="alert">{serverError}</p>
      )}

      <Button type="submit" variant="accent" size="lg" loading={loading}>
        Submit for Review
      </Button>
    </form>
  )
}
