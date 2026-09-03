'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { QPU, Benchmark } from '@/types'
import { Tabs, TabsContent } from '@/components/ui/Tabs'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { architectureLabel } from '@/lib/utils'

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  qpus: QPU[]
  benchmarks: Benchmark[]
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PROVIDER_NAMES: Record<string, string> = {
  ibm: 'IBM Quantum',
  ionq: 'IonQ',
  rigetti: 'Rigetti Computing',
  quantinuum: 'Quantinuum',
  quera: 'QuEra Computing',
  iqm: 'IQM Quantum Computers',
  pasqal: 'PASQAL',
  dwave: 'D-Wave Systems',
}

const TAB_ITEMS = [
  { id: 'hardware-metrics', label: 'Hardware Metrics' },
  { id: 'system-benchmarks', label: 'System Benchmarks' },
  { id: 'application-benchmarks', label: 'Application Benchmarks' },
  { id: 'vendor-metrics', label: 'Vendor Metrics' },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function fidelityColorClass(value: number | null): string {
  if (value === null) return 'text-[var(--color-text-muted)]'
  if (value >= 99.5) return 'text-[var(--color-success)]'
  if (value >= 99.0) return 'text-[var(--color-warning)]'
  return 'text-[var(--color-text-muted)]'
}

function formatFidelity(value: number | null): string {
  if (value === null) return '—'
  return `${value.toFixed(2)}%`
}

function formatCoherence(value: number | null, unit: string): string {
  if (value === null) return '—'
  return `${value} ${unit}`
}

// ── Custom chart tooltip ───────────────────────────────────────────────────────

interface TooltipPayload {
  name: string
  value: number
  unit?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: { value: number; payload: TooltipPayload }[]
  label?: string
  unit?: string
}

function ChartTooltip({ active, payload, label, unit }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        fontSize: '0.8125rem',
      }}
    >
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 2, maxWidth: '20ch' }}>{label}</p>
      <p style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
        {payload[0].value}{unit ? ` ${unit}` : ''}
      </p>
    </div>
  )
}

// ── Explainer card ─────────────────────────────────────────────────────────────

interface ExplainerCardProps {
  name: string
  description: string
  details: { label: string; text: string }[]
}

function ExplainerCard({ name, description, details }: ExplainerCardProps) {
  return (
    <div
      style={{
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
      }}
    >
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
        {name}
      </h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
        {description}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {details.map((d) => (
          <div key={d.label}>
            <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
              {d.label}:{' '}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {d.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function BenchmarksClient({ qpus, benchmarks }: Props) {
  // Prepare benchmark data by metric type
  const qvData = benchmarks
    .filter((b) => b.metric === 'quantum-volume')
    .map((b) => {
      const qpu = qpus.find((q) => q.id === b.qpuId)
      return { name: qpu?.name ?? b.qpuId, value: b.value, source: b.source.publisher }
    })
    .sort((a, b) => b.value - a.value)

  const clopsData = benchmarks
    .filter((b) => b.metric === 'clops')
    .map((b) => {
      const qpu = qpus.find((q) => q.id === b.qpuId)
      return { name: qpu?.name ?? b.qpuId, value: b.value }
    })
    .sort((a, b) => b.value - a.value)

  const aqData = benchmarks
    .filter((b) => b.metric === 'algorithmic-qubits')
    .map((b) => {
      const qpu = qpus.find((q) => q.id === b.qpuId)
      return { name: qpu?.name ?? b.qpuId, value: b.value, source: b.source.publisher }
    })
    .sort((a, b) => b.value - a.value)

  // QPUs that have fidelity or coherence data (gate-based only)
  const gateBasedQpus = qpus.filter(
    (q) => q.paradigm === 'gate-based' || q.paradigm === 'hybrid'
  )

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 4 }}>
          <span className="eyebrow">Intelligence</span>
        </div>
        <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 12 }}>
          QPU Benchmarks
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '60ch', lineHeight: 1.65 }}>
          Performance metrics for quantum processors. No single benchmark captures full QPU capability —
          evaluate multiple metrics in context of your workload.
        </p>
      </div>

      {/* Disclaimer panel */}
      <div
        style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.22)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: 36,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}
        role="note"
        aria-label="Benchmark methodology disclaimer"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
          <path
            d="M9 1.5L16.5 15H1.5L9 1.5Z"
            stroke="var(--color-warning)"
            strokeWidth="1.4"
            strokeLinejoin="round"
            fill="none"
          />
          <line x1="9" y1="7" x2="9" y2="10.5" stroke="var(--color-warning)" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="9" cy="12.5" r="0.75" fill="var(--color-warning)" />
        </svg>
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-warning)', fontWeight: 600, marginBottom: 4 }}>
            Methodology Note
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Benchmarks are published by manufacturers and cloud providers using their own methodologies.
            Not all metrics are defined consistently or directly comparable across architectures or vendors.
            QPU.co reports metrics as published.{' '}
            <Link href="/methodology" style={{ color: 'var(--color-accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              See Methodology →
            </Link>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs items={TAB_ITEMS} defaultValue="hardware-metrics">
        {/* ── Tab 1: Hardware Metrics ─────────────────────────────────────── */}
        <TabsContent value="hardware-metrics">
          {/* Explainer cards 2×2 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
              marginBottom: 40,
            }}
          >
            <ExplainerCard
              name="Two-Qubit Gate Fidelity"
              description="The probability that a two-qubit gate operation produces the correct quantum state. Higher is better. Typical values: 99.0–99.9% for leading systems."
              details={[
                { label: 'Why it matters', text: 'Determines how many gates can be applied before errors dominate.' },
                { label: 'Arch note', text: 'Typically measured by randomized benchmarking. Comparison across architectures requires caution.' },
              ]}
            />
            <ExplainerCard
              name="Measurement / Readout Fidelity"
              description="Probability that qubit state measurement returns the correct value."
              details={[
                { label: 'Typical values', text: '98–99.9%' },
                { label: 'Measurement', text: 'State discrimination via single-shot readout; varies by qubit type.' },
              ]}
            />
            <ExplainerCard
              name="T1 — Energy Relaxation Time"
              description="Time before a qubit in excited state spontaneously decays. Limits total circuit duration."
              details={[
                { label: 'Units', text: 'Microseconds (µs) for superconducting; seconds for trapped-ion' },
                { label: 'Note', text: 'Trapped-ion and neutral-atom systems typically have much longer T1 than superconducting qubits.' },
              ]}
            />
            <ExplainerCard
              name="T2 — Dephasing Time"
              description="Time before quantum phase information is lost. Limits effective circuit depth."
              details={[
                { label: 'Variants', text: 'T2 (Ramsey) and T2* (Hahn echo) measured differently; always check methodology.' },
                { label: 'Note', text: 'T2 ≤ 2×T1. Gate time must be short compared to T2 for reliable operation.' },
              ]}
            />
          </div>

          {/* Hardware metrics table */}
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Hardware Metrics by QPU
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              Gate-based quantum processors. Annealers and analog systems use different performance characterizations.
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                className="data-table"
                style={{ width: '100%', borderCollapse: 'collapse' }}
                aria-label="QPU hardware metrics"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>QPU</th>
                    <th style={{ textAlign: 'left' }}>Architecture</th>
                    <th style={{ textAlign: 'right' }}>2Q Gate Fidelity</th>
                    <th style={{ textAlign: 'right' }}>Readout Fidelity</th>
                    <th style={{ textAlign: 'right' }}>T1</th>
                    <th style={{ textAlign: 'right' }}>T2</th>
                    <th style={{ textAlign: 'left' }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {gateBasedQpus.map((qpu) => {
                    const twoQ = qpu.fidelity?.twoQubitGate?.value ?? null
                    const readout = qpu.fidelity?.readout?.value ?? null
                    const t1 = qpu.coherence?.t1
                    const t2 = qpu.coherence?.t2
                    const source = qpu.sources[0]
                    return (
                      <tr key={qpu.id}>
                        <td>
                          <Link
                            href={`/qpus/${qpu.slug}`}
                            style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
                            className="hover:text-[var(--color-accent)] transition-colors"
                          >
                            {qpu.name}
                          </Link>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {PROVIDER_NAMES[qpu.providerId] ?? qpu.providerId}
                          </div>
                        </td>
                        <td>
                          <ArchitectureBadge architecture={qpu.architecture} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span
                            className={`font-mono text-sm ${fidelityColorClass(twoQ)}`}
                          >
                            {formatFidelity(twoQ)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span
                            className={`font-mono text-sm ${fidelityColorClass(readout)}`}
                          >
                            {formatFidelity(readout)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                          {t1?.value != null
                            ? `${t1.value} ${t1.unit}`
                            : t1?.notes
                            ? <span title={t1.notes} style={{ color: 'var(--color-text-muted)', cursor: 'help' }}>—†</span>
                            : '—'}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                          {t2?.value != null
                            ? `${t2.value} ${t2.unit}`
                            : t2?.notes
                            ? <span title={t2.notes} style={{ color: 'var(--color-text-muted)', cursor: 'help' }}>—†</span>
                            : '—'}
                        </td>
                        <td>
                          {source ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                              className="hover:text-[var(--color-text-secondary)] transition-colors"
                            >
                              {source.publisher}
                            </a>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend for fidelity color coding */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)' }} />
              ≥ 99.5% — excellent
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-warning)' }} />
              99.0–99.5% — good
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
              &lt; 99.0% or not published
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 12 }}>
            † Value not published as a single number; hover for notes. Data sourced from manufacturer documentation and published research.
            Specifications change with hardware updates. —† indicates range available in source documentation.
          </p>
        </TabsContent>

        {/* ── Tab 2: System Benchmarks ──────────────────────────────────────── */}
        <TabsContent value="system-benchmarks">
          {/* QV section */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Quantum Volume (QV)
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 8 }}>
              IBM&apos;s holistic benchmark measuring effective circuit depth achievable with high fidelity. Accounts for
              qubit count, connectivity, and gate error rates. Higher QV = more capable system for general circuits.
            </p>
            <div
              style={{
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.18)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginBottom: 24,
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <strong style={{ color: 'var(--color-warning)' }}>Limitation:</strong> Defined by IBM. Not universally
              adopted. Does not directly translate to application performance.
            </div>

            {qvData.length > 0 ? (
              <>
                <div
                  style={{
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 20px 16px',
                    marginBottom: 12,
                  }}
                >
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={qvData}
                      margin={{ top: 8, right: 16, left: 0, bottom: 32 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        angle={-20}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        label={{
                          value: 'QV',
                          angle: -90,
                          position: 'insideLeft',
                          fill: 'var(--color-text-muted)',
                          fontSize: 11,
                        }}
                      />
                      <Tooltip
                        content={<ChartTooltip unit="QV" />}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {qvData.map((_, index) => (
                          <Cell key={index} fill="var(--color-accent)" fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Screen-reader accessible table */}
                <details style={{ marginBottom: 8 }}>
                  <summary style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                    View QV data as table (screen reader)
                  </summary>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }} aria-label="Quantum Volume data">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>QPU</th>
                        <th style={{ textAlign: 'right' }}>Quantum Volume</th>
                        <th style={{ textAlign: 'left' }}>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qvData.map((d) => (
                        <tr key={d.name}>
                          <td>{d.name}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{d.value}</td>
                          <td>{d.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Source: IBM Quantum documentation. QV measured per IBM cross-entropy benchmarking protocol.
                </p>
              </>
            ) : (
              <EmptyState
                title="No QV data available"
                description="QPU.co only publishes independently verified benchmark results. QV data will be added as it is confirmed from manufacturer sources."
              />
            )}
          </section>

          {/* CLOPS section */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              CLOPS — Circuit Layer Operations Per Second
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>
              Measures QPU throughput — how many circuit layers (QV-class circuits) can be executed per second.
              Relevant for workloads requiring many circuit repetitions, such as variational algorithms and error correction.
            </p>

            {clopsData.length > 0 ? (
              <div
                style={{
                  background: 'var(--color-bg-panel)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 20px 16px',
                  marginBottom: 12,
                }}
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={clopsData} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<ChartTooltip unit="CLOPS" />}
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--color-accent)" fillOpacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                title="No CLOPS data available"
                description="QPU.co publishes only confirmed benchmark results. CLOPS data will be added as it is sourced from manufacturer publications."
              />
            )}
          </section>

          {/* AQ section */}
          <section style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Algorithmic Qubits (#AQ) — IonQ
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 8 }}>
              IonQ&apos;s measure of effective circuit capability, based on achievable two-qubit gate operations before
              errors dominate. Defined as the largest <em>n</em> such that an <em>n</em>-qubit quantum Fourier transform
              can be executed with &gt;50% success probability.
            </p>
            <div
              style={{
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.18)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginBottom: 24,
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <strong style={{ color: 'var(--color-warning)' }}>Note:</strong> #AQ is IonQ&apos;s proprietary metric.
              Direct comparison with QV or other metrics requires care — they measure fundamentally different properties.
            </div>

            {aqData.length > 0 ? (
              <>
                <div
                  style={{
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 20px 16px',
                    marginBottom: 12,
                  }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={aqData} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        label={{
                          value: '#AQ',
                          angle: -90,
                          position: 'insideLeft',
                          fill: 'var(--color-text-muted)',
                          fontSize: 11,
                        }}
                      />
                      <Tooltip
                        content={<ChartTooltip unit="#AQ" />}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {aqData.map((_, index) => (
                          <Cell key={index} fill="#A78BFA" fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <details style={{ marginBottom: 8 }}>
                  <summary style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                    View #AQ data as table (screen reader)
                  </summary>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }} aria-label="Algorithmic Qubits data">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>QPU</th>
                        <th style={{ textAlign: 'right' }}>Algorithmic Qubits (#AQ)</th>
                        <th style={{ textAlign: 'left' }}>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aqData.map((d) => (
                        <tr key={d.name}>
                          <td>{d.name}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{d.value}</td>
                          <td>{d.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Source: IonQ product documentation. #AQ = algorithmic qubit count per IonQ&apos;s definition.
                </p>
              </>
            ) : (
              <EmptyState
                title="No #AQ data available"
                description="QPU.co publishes only confirmed benchmark data from manufacturer sources."
              />
            )}
          </section>
        </TabsContent>

        {/* ── Tab 3: Application Benchmarks ─────────────────────────────────── */}
        <TabsContent value="application-benchmarks">
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Application Benchmarks
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, maxWidth: '68ch' }}>
              Application benchmarks run realistic quantum algorithms on actual hardware, measuring end-to-end
              performance on tasks relevant to users. These provide more practical insight than hardware metrics
              but are harder to standardize and reproduce across vendors.
            </p>
          </div>

          {/* Sub-sections */}
          {[
            {
              id: 'chemistry',
              title: 'Quantum Chemistry',
              description: 'Variational Quantum Eigensolver (VQE), Quantum Phase Estimation (QPE), and related chemistry simulation benchmarks.',
            },
            {
              id: 'optimization',
              title: 'Optimization',
              description: 'Quantum Approximate Optimization Algorithm (QAOA) performance on combinatorial optimization problems.',
            },
            {
              id: 'ml',
              title: 'Machine Learning',
              description: 'Quantum machine learning circuit benchmarks, classification tasks, and kernel method evaluations.',
            },
            {
              id: 'rcs',
              title: 'Random Circuit Sampling',
              description: 'Linear cross-entropy benchmarking (XEB) scores and random circuit sampling fidelity metrics.',
            },
          ].map((section) => (
            <div key={section.id} style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
                {section.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                {section.description}
              </p>
              <EmptyState
                title="Application benchmark data coming soon"
                description="QPU.co publishes only independently verified results. This section will expand as rigorous third-party benchmark data becomes available."
              />
            </div>
          ))}
        </TabsContent>

        {/* ── Tab 4: Vendor Metrics ──────────────────────────────────────────── */}
        <TabsContent value="vendor-metrics">
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Vendor-Defined Metrics
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, maxWidth: '68ch' }}>
              Quantum hardware vendors publish their own performance metrics using custom definitions. These provide
              useful context but are not standardized and may not be directly comparable across vendors.
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                className="data-table"
                style={{ width: '100%', borderCollapse: 'collapse' }}
                aria-label="Vendor-defined metrics"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Vendor</th>
                    <th style={{ textAlign: 'left' }}>Metric Name</th>
                    <th style={{ textAlign: 'left' }}>Definition</th>
                    <th style={{ textAlign: 'right' }}>Latest Value</th>
                    <th style={{ textAlign: 'left' }}>Date</th>
                    <th style={{ textAlign: 'left' }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>IBM</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>Quantum Volume (QV)</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', maxWidth: 300 }}>
                      Largest random square circuit successfully executed with heavy output probability &gt;2/3. Holistic — accounts for qubit count, connectivity, and gate fidelity.
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      32 (Eagle r1)
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Nov 2021</td>
                    <td>
                      <a
                        href="https://docs.quantum.ibm.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                        className="hover:text-[var(--color-text-secondary)] transition-colors"
                      >
                        IBM Docs
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>IonQ</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>Algorithmic Qubits (#AQ)</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', maxWidth: 300 }}>
                      Largest <em>n</em> such that an <em>n</em>-qubit QFT achieves &gt;50% success probability. Represents practical circuit capability.
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      35 (Forte)
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Jun 2023</td>
                    <td>
                      <a
                        href="https://ionq.com/quantum-systems"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                        className="hover:text-[var(--color-text-secondary)] transition-colors"
                      >
                        IonQ
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Quantinuum</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>System Model H2 Fidelity</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', maxWidth: 300 }}>
                      Two-qubit ZZ gate fidelity measured by randomized benchmarking. Reported as average over all qubit pairs.
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      99.9% (H2-1)
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Jan 2024</td>
                    <td>
                      <a
                        href="https://www.quantinuum.com/hardware/h2"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                        className="hover:text-[var(--color-text-secondary)] transition-colors"
                      >
                        Quantinuum
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Vendor-defined metrics are not independently verified by QPU.co. Values as reported by manufacturers.
            Metric definitions and measurement methodologies are vendor-specific.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
