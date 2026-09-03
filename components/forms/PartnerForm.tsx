'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { submitForm } from '@/lib/forms'

const PARTNERSHIP_TYPE_OPTIONS = [
  { value: 'hardware-provider', label: 'Hardware Provider' },
  { value: 'cloud-platform', label: 'Cloud Platform' },
  { value: 'software-framework', label: 'Software Framework' },
  { value: 'research-institution', label: 'Research Institution' },
  { value: 'data-provider', label: 'Data Provider' },
  { value: 'other', label: 'Other' },
]

export function PartnerForm() {
  const [fields, setFields] = useState({
    name: '',
    company: '',
    role: '',
    partnershipType: '',
    message: '',
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
    if (!fields.name.trim()) next.name = 'Name is required.'
    if (!fields.company.trim()) next.company = 'Company is required.'
    if (!fields.message.trim()) next.message = 'Please describe the partnership you have in mind.'
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
        type: 'partner',
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
          Message received.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 340, margin: '0 auto' }}>
          We'll be in touch if the partnership makes sense. Thanks for reaching out.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Name"
          placeholder="Your name"
          value={fields.name}
          onChange={e => set('name', e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Company"
          placeholder="Organization"
          value={fields.company}
          onChange={e => set('company', e.target.value)}
          error={errors.company}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Role"
          placeholder="Your title"
          value={fields.role}
          onChange={e => set('role', e.target.value)}
        />
        <Select
          label="Partnership Type"
          placeholder="What kind of partnership?"
          options={PARTNERSHIP_TYPE_OPTIONS}
          value={fields.partnershipType}
          onChange={v => set('partnershipType', v)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor="partner-message"
          style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}
        >
          Message <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>
        </label>
        <textarea
          id="partner-message"
          placeholder="Describe the partnership you have in mind and what you're hoping to accomplish."
          value={fields.message}
          onChange={e => set('message', e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${errors.message ? 'var(--color-danger)' : 'var(--color-border)'}`,
            background: 'var(--color-bg-raised)',
            color: 'var(--color-text-primary)',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
          onBlur={e => { e.currentTarget.style.borderColor = errors.message ? 'var(--color-danger)' : 'var(--color-border)' }}
        />
        {errors.message && (
          <p style={{ fontSize: 12, color: 'var(--color-danger)' }} role="alert">{errors.message}</p>
        )}
      </div>

      {serverError && (
        <p style={{ fontSize: 13, color: 'var(--color-danger)' }} role="alert">{serverError}</p>
      )}

      <Button type="submit" variant="accent" size="lg" loading={loading}>
        Submit
      </Button>
    </form>
  )
}
