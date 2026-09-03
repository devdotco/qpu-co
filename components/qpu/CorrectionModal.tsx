'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Send, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CorrectionModalProps {
  qpuName: string
  qpuSlug: string
}

const FIELD_OPTIONS = [
  'Physical qubit count',
  'Gate fidelity',
  'Coherence time (T1/T2)',
  'Connectivity topology',
  'Cloud platform availability',
  'Framework support',
  'Access model / pricing',
  'Release date',
  'Status',
  'Other',
]

export function CorrectionModal({ qpuName, qpuSlug }: CorrectionModalProps) {
  const [open, setOpen] = useState(false)
  const [field, setField] = useState('')
  const [correction, setCorrection] = useState('')
  const [source, setSource] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!field || !correction) return
    setLoading(true)
    // Simulate submission — replace with real endpoint if available
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setField('')
      setCorrection('')
      setSource('')
      setLoading(false)
    }, 300)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]',
            'hover:text-[var(--color-text-secondary)] transition-colors',
            'underline underline-offset-2 decoration-dotted',
            'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 rounded-sm',
          )}
        >
          <AlertCircle size={11} />
          Suggest a correction
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border-strong)]',
            'bg-[var(--color-bg-panel)] shadow-2xl',
            'p-6 focus:outline-none',
          )}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <Dialog.Title className="text-sm font-semibold text-[var(--color-text-primary)]">
                Suggest a Correction
              </Dialog.Title>
              <Dialog.Description className="text-xs text-[var(--color-text-muted)] mt-0.5">
                For: <span className="text-[var(--color-text-secondary)]">{qpuName}</span>
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={handleClose}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-[var(--color-success-dim)] flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="9" stroke="var(--color-success)" strokeWidth="1.5" strokeOpacity="0.5" />
                  <path d="M6 10l3 3 5-5" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                Thank you!
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Your correction has been submitted. We will review it and update the data if confirmed.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 text-xs text-[var(--color-accent)] hover:underline underline-offset-2"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field */}
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                  Which field needs correction?
                </label>
                <select
                  value={field}
                  onChange={e => setField(e.target.value)}
                  required
                  className={cn(
                    'w-full h-9 px-3 text-sm rounded-[var(--radius-md)]',
                    'bg-[var(--color-bg-raised)] border border-[var(--color-border)]',
                    'text-[var(--color-text-primary)]',
                    'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
                    'appearance-none',
                  )}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2366717F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    paddingRight: '32px',
                  }}
                >
                  <option value="">Select a field…</option>
                  {FIELD_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Correction */}
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                  Correct value or description
                </label>
                <textarea
                  value={correction}
                  onChange={e => setCorrection(e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe the correct information…"
                  className={cn(
                    'w-full px-3 py-2 text-sm rounded-[var(--radius-md)]',
                    'bg-[var(--color-bg-raised)] border border-[var(--color-border)]',
                    'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                    'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
                    'resize-none',
                  )}
                />
              </div>

              {/* Source URL */}
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                  Source URL <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="https://…"
                  className={cn(
                    'w-full h-9 px-3 text-sm rounded-[var(--radius-md)]',
                    'bg-[var(--color-bg-raised)] border border-[var(--color-border)]',
                    'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                    'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
                  )}
                />
              </div>

              <div className="pt-1">
                <p className="text-[11px] text-[var(--color-text-muted)] mb-3">
                  Submissions are reviewed by the QPU.co editorial team. Factual corrections are prioritized; all verified submissions credit the contributor.
                </p>
                <button
                  type="submit"
                  disabled={loading || !field || !correction}
                  className={cn(
                    'w-full h-9 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-[var(--radius-md)] transition-colors',
                    'bg-[var(--color-accent)] text-[var(--color-bg-base)]',
                    'hover:bg-[#38ddf2] disabled:opacity-50 disabled:pointer-events-none',
                    'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
                  )}
                >
                  {loading ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
                      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <Send size={13} />
                  )}
                  {loading ? 'Submitting…' : 'Submit Correction'}
                </button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
