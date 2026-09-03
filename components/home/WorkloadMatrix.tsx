'use client'

import { useState } from 'react'
import type { SuitabilityLevel, ArchitectureType } from '@/types'
import { workloadMatrix } from '@/lib/data'

const WORKLOADS = [
  { key: 'chemistry',       label: 'Chemistry' },
  { key: 'materials-science', label: 'Materials' },
  { key: 'optimization',    label: 'Optimization' },
  { key: 'finance',         label: 'Finance' },
  { key: 'machine-learning', label: 'ML' },
  { key: 'drug-discovery',  label: 'Drug Discovery' },
  { key: 'logistics',       label: 'Logistics' },
]

const ARCHITECTURES: { key: ArchitectureType; label: string; color: string }[] = [
  { key: 'superconducting',   label: 'Superconducting', color: '#60A5FA' },
  { key: 'trapped-ion',       label: 'Trapped Ion',     color: '#A78BFA' },
  { key: 'neutral-atom',      label: 'Neutral Atom',    color: '#34D399' },
  { key: 'photonic',          label: 'Photonic',        color: '#F472B6' },
  { key: 'quantum-annealing', label: 'Annealing',       color: '#FB923C' },
]

const SUITABILITY_CONFIG: Record<SuitabilityLevel, { color: string; label: string; bg: string }> = {
  strong:       { color: '#4ADE80', bg: 'rgba(74,222,128,0.15)',  label: 'Strong' },
  possible:     { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)',  label: 'Possible' },
  experimental: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  label: 'Experimental' },
  limited:      { color: '#F87171', bg: 'rgba(248,113,113,0.12)', label: 'Limited' },
  unknown:      { color: '#3D4754', bg: 'rgba(255,255,255,0.04)', label: 'Unknown' },
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  content: string
  label: string
}

function SuitabilityDot({
  suitability,
  notes,
  onHover,
}: {
  suitability: SuitabilityLevel
  notes: string
  onHover: (state: TooltipState) => void
}) {
  const cfg = SUITABILITY_CONFIG[suitability]
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        onHover({
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top - 8,
          content: notes,
          label: cfg.label,
        })
      }}
      onMouseLeave={() => onHover({ visible: false, x: 0, y: 0, content: '', label: '' })}
    >
      <div style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: cfg.bg,
        border: `1.5px solid ${cfg.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: cfg.color,
        }} />
      </div>
    </div>
  )
}

export default function WorkloadMatrix() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, content: '', label: '',
  })

  function getCell(workload: string, arch: ArchitectureType) {
    return workloadMatrix.find(c => c.workload === workload && c.architecture === arch)
  }

  return (
    <section style={{
      background: 'var(--color-bg-raised)',
      borderBottom: '1px solid var(--color-border)',
      padding: '80px 0 88px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
            WORKLOAD MATCHING
          </span>
          <h2 style={{ margin: '0 0 10px' }}>Matching Workloads to Architecture</h2>
          <p style={{ margin: 0, fontSize: '15px', maxWidth: '58ch' }}>
            Different quantum architectures excel at different problem types. Use this reference to identify which hardware modalities best fit your workload category.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: '560px',
          }}
            aria-label="Workload to architecture suitability matrix"
          >
            <thead>
              <tr>
                <th style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  fontWeight: '500',
                  borderBottom: '1px solid var(--color-border)',
                  width: '160px',
                }}>
                  Workload
                </th>
                {ARCHITECTURES.map(a => (
                  <th key={a.key} style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: a.color,
                    fontWeight: '500',
                    borderBottom: '1px solid var(--color-border)',
                    whiteSpace: 'nowrap',
                  }}>
                    {a.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WORKLOADS.map((w, wi) => (
                <tr key={w.key} style={{
                  background: wi % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    fontWeight: '500',
                    borderBottom: wi < WORKLOADS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {w.label}
                  </td>
                  {ARCHITECTURES.map(a => {
                    const cell = getCell(w.key, a.key)
                    const suitability: SuitabilityLevel = cell?.suitability ?? 'unknown'
                    const notes = cell?.notes ?? 'No data available.'
                    return (
                      <td key={a.key} style={{
                        padding: '12px',
                        textAlign: 'center',
                        borderBottom: wi < WORKLOADS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                      }}>
                        <SuitabilityDot
                          suitability={suitability}
                          notes={notes}
                          onHover={setTooltip}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Legend:
          </span>
          {(['strong', 'possible', 'experimental', 'limited'] as SuitabilityLevel[]).map(s => {
            const cfg = SUITABILITY_CONFIG[s]
            return (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: cfg.color, flexShrink: 0,
                }} />
                {cfg.label}
              </span>
            )
          })}
        </div>

        <p style={{
          marginTop: '12px',
          fontSize: '11px',
          color: 'var(--color-text-faint)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.02em',
        }}>
          Conceptual suitability assessment for current NISQ-era hardware. Actual performance varies. See methodology.
        </p>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: 'var(--color-bg-overlay)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: '8px',
            padding: '10px 14px',
            maxWidth: '260px',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {tooltip.label}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            {tooltip.content}
          </div>
        </div>
      )}
    </section>
  )
}
