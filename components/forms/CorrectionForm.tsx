'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { submitForm } from '@/lib/forms'

export function CorrectionForm() {
  const [fields, setFields] = useState({
    page: '',
    fieldName: '',
    currentValue: '',
    correctValue: '',
    sourceUrl: '',
    email: '',
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
    if (!fields.page.trim()) next.page = 'Please specify the page or QPU affected.'
    if (!fields.fieldName.trim()) next.fieldName = 'Please specify the field name.'
    if (!fields.correctValue.trim()) next.correctValue = 'Please provide the correct value.'
    if (!fields.sourceUrl.trim()) {
      next.sourceUrl = 'A source URL is required to verify corrections.'
    } else if (!/^https?:\/\/.+/.test(fields.sourceUrl)) {
      next.sourceUrl = 'Please enter a valid URL (starting with http:// or https://).'
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
        type: 'correction',
        data: {
          page: fields.page,
          fieldName: fields.fieldName,
          currentValue: fields.currentValue,
          correctValue: fields.correctValue,
          sourceUrl: fields.sourceUrl,
          email: fields.email,
        },
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
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(74,222,128,0.2)',
          background: 'rgba(74,222,128,0.04)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          Correction submitted.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 340, margin: '0 auto' }}>
          We'll review your correction against the source you provided and update the record if it checks out.
          This usually takes 1–3 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input
        label="Page or QPU affected"
        placeholder="e.g. /qpus/ibm-eagle or IBM Eagle r1"
        value={fields.page}
        onChange={e => set('page', e.target.value)}
        error={errors.page}
        required
      />

      <Input
        label="Field name"
        placeholder="e.g. Physical Qubits, Two-qubit gate fidelity"
        value={fields.fieldName}
        onChange={e => set('fieldName', e.target.value)}
        error={errors.fieldName}
        required
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Current value shown"
          placeholder="What QPU.co currently shows"
          value={fields.currentValue}
          onChange={e => set('currentValue', e.target.value)}
        />
        <Input
          label="Correct value"
          placeholder="The accurate value"
          value={fields.correctValue}
          onChange={e => set('correctValue', e.target.value)}
          error={errors.correctValue}
          required
        />
      </div>

      <Input
        label="Source URL"
        type="url"
        placeholder="https://docs.provider.com/spec-page"
        value={fields.sourceUrl}
        onChange={e => set('sourceUrl', e.target.value)}
        error={errors.sourceUrl}
        hint="Link to the primary source that documents the correct value."
        required
      />

      <Input
        label="Your email (optional)"
        type="email"
        placeholder="So we can follow up if needed"
        value={fields.email}
        onChange={e => set('email', e.target.value)}
      />

      {serverError && (
        <p style={{ fontSize: 13, color: 'var(--color-danger)' }} role="alert">{serverError}</p>
      )}

      <Button type="submit" variant="secondary" size="md" loading={loading}>
        Submit Correction
      </Button>
    </form>
  )
}
