import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { FormSubmission } from '@/lib/forms'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO = process.env.FORM_TO_EMAIL ?? 'nate@dev.co'
const FROM = process.env.FORM_FROM_EMAIL ?? 'noreply@dev.co'

const SUBJECTS: Record<FormSubmission['type'], string> = {
  enterprise:    'QPU.co — Enterprise inquiry',
  newsletter:    'QPU.co — Newsletter signup',
  'list-qpu':   'QPU.co — List a QPU submission',
  correction:    'QPU.co — Data correction report',
  'api-waitlist':'QPU.co — API waitlist signup',
  partner:       'QPU.co — Partnership inquiry',
  contact:       'QPU.co — Contact form',
}

function formatBody(submission: FormSubmission): string {
  const rows = Object.entries(submission.data)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#9AA4B2;white-space:nowrap;vertical-align:top;">${k}</td><td style="padding:6px 0;color:#F5F7F9;">${v}</td></tr>`)
    .join('')

  return `
    <div style="font-family:monospace;background:#06080B;color:#F5F7F9;padding:32px;border-radius:8px;max-width:560px;">
      <p style="margin:0 0 4px;color:#66717F;font-size:12px;">QPU.co form submission</p>
      <p style="margin:0 0 24px;color:#22D3EE;font-size:14px;font-weight:600;">${SUBJECTS[submission.type]}</p>
      <table style="border-collapse:collapse;width:100%;font-size:13px;">${rows}</table>
      <p style="margin:24px 0 0;color:#66717F;font-size:11px;">Submitted: ${submission.submittedAt}</p>
    </div>
  `
}

export async function POST(req: NextRequest) {
  let submission: FormSubmission

  try {
    submission = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
  }

  if (!submission.type || !submission.data) {
    return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: SUBJECTS[submission.type] ?? 'QPU.co — form submission',
      html: formatBody(submission),
      replyTo: submission.data.email ?? submission.data.Email ?? undefined,
    })

    return NextResponse.json({ success: true, message: 'Sent.' })
  } catch (err) {
    console.error('[submit-form]', err)
    return NextResponse.json({ success: false, message: 'Failed to send.' }, { status: 500 })
  }
}
