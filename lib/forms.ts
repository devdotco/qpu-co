export interface FormSubmission {
  type: 'enterprise' | 'newsletter' | 'list-qpu' | 'correction' | 'api-waitlist' | 'partner' | 'contact'
  data: Record<string, string>
  submittedAt: string
}

export async function submitForm(submission: FormSubmission): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    return { success: false, message: json.message ?? 'Something went wrong. Please try again.' }
  }

  return res.json()
}
