'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { submitForm } from '@/lib/forms'

const ROLE_OPTIONS = [
  { value: 'cto-vp', label: 'CTO / VP Engineering' },
  { value: 'research-director', label: 'Research Director' },
  { value: 'data-scientist', label: 'Data Scientist / Engineer' },
  { value: 'physicist', label: 'Physicist' },
  { value: 'other', label: 'Other' },
]

const ORG_SIZE_OPTIONS = [
  { value: '1-50', label: '1–50 employees' },
  { value: '51-500', label: '51–500 employees' },
  { value: '500-5000', label: '500–5,000 employees' },
  { value: '5000+', label: '5,000+ employees' },
]

const OBJECTIVE_OPTIONS = [
  { value: 'hardware-evaluation', label: 'Hardware Evaluation' },
  { value: 'research-access', label: 'Research Access' },
  { value: 'technical-education', label: 'Technical Education' },
  { value: 'workload-assessment', label: 'Workload Assessment' },
  { value: 'general-briefing', label: 'General Briefing' },
  { value: 'other', label: 'Other' },
]

const ACTIVITY_OPTIONS = [
  { value: 'none', label: 'No quantum work yet' },
  { value: 'exploring', label: 'Exploring / researching' },
  { value: 'active', label: 'Active experiments' },
  { value: 'production', label: 'Production workloads' },
]

export function EnterpriseForm() {
  const [fields, setFields] = useState({
    name: '',
    company: '',
    email: '',
    role: '',
    orgSize: '',
    objective: '',
    activity: '',
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
    if (!fields.email.trim()) {
      next.email = 'Work email is required.'
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
        type: 'enterprise',
        data: {
          name: fields.name,
          company: fields.company,
          email: fields.email,
          role: fields.role,
          orgSize: fields.orgSize,
          objective: fields.objective,
          activity: fields.activity,
          message: fields.message,
        },
        submittedAt: new Date().toISOString(),
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } catch {
      setServerError('Unable to submit. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '32px 28px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(34,211,238,0.2)',
          background: 'rgba(34,211,238,0.04)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(34,211,238,0.12)',
            border: '1px solid rgba(34,211,238,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.5 9l4 4 7-7" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 8,
          }}
        >
          Thank you. We'll review your request and respond within 2 business days.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 340, margin: '0 auto' }}>
          We read every submission carefully. If your request is urgent, you can also reach us at{' '}
          <span style={{ color: 'var(--color-accent)' }}>general@qpu.co</span>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
          placeholder="Organization name"
          value={fields.company}
          onChange={e => set('company', e.target.value)}
          error={errors.company}
          required
        />
      </div>

      <Input
        label="Work Email"
        type="email"
        placeholder="you@company.com"
        value={fields.email}
        onChange={e => set('email', e.target.value)}
        error={errors.email}
        required
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Select
          label="Role"
          placeholder="Select your role"
          options={ROLE_OPTIONS}
          value={fields.role}
          onChange={v => set('role', v)}
        />
        <Select
          label="Organization Size"
          placeholder="Select size"
          options={ORG_SIZE_OPTIONS}
          value={fields.orgSize}
          onChange={v => set('orgSize', v)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Select
          label="Primary Objective"
          placeholder="What are you evaluating for?"
          options={OBJECTIVE_OPTIONS}
          value={fields.objective}
          onChange={v => set('objective', v)}
        />
        <Select
          label="Current Quantum Activity"
          placeholder="Where are you today?"
          options={ACTIVITY_OPTIONS}
          value={fields.activity}
          onChange={v => set('activity', v)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor="enterprise-message"
          style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}
        >
          Message <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="enterprise-message"
          placeholder="Tell us about your workloads, timeline, or specific hardware questions."
          value={fields.message}
          onChange={e => set('message', e.target.value)}
          rows={4}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button type="submit" variant="accent" size="lg" loading={loading}>
          Request an Assessment
        </Button>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          QPU.co does not share contact information with hardware vendors without your consent.
        </p>
      </div>
    </form>
  )
}
