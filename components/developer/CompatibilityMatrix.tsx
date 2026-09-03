'use client'

import * as React from 'react'
import type { QPU } from '@/types'

const MATRIX_QPU_IDS = [
  'ibm-eagle-r1',
  'ibm-heron-r2',
  'ionq-forte',
  'ionq-forte-enterprise',
  'rigetti-ankaa-3',
  'quantinuum-h2-1',
  'quera-aquila',
  'iqm-spark',
  'iqm-radiance',
  'pasqal-fresnel',
  'dwave-advantage',
  'dwave-advantage2',
]

const FRAMEWORK_COLS = [
  { id: 'qiskit',            label: 'Qiskit' },
  { id: 'cirq',              label: 'Cirq' },
  { id: 'cuda-q',            label: 'CUDA-Q' },
  { id: 'pennylane',         label: 'PennyLane' },
  { id: 'qsharp',            label: 'Q#' },
  { id: 'amazon-braket-sdk', label: 'Braket SDK' },
]

interface CompatibilityMatrixProps {
  qpus: QPU[]
}

export default function CompatibilityMatrix({ qpus }: CompatibilityMatrixProps) {
  const matrixQpus = MATRIX_QPU_IDS.flatMap((id) => {
    const q = qpus.find((qpu) => qpu.id === id)
    return q ? [q] : []
  })

  return (
    <section
      id="sdk-matrix"
      className="py-16 px-6"
      aria-label="SDK Compatibility Matrix"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h2
            className="text-[var(--color-text-primary)]"
            style={{ maxWidth: 'none' }}
          >
            SDK Compatibility Matrix
          </h2>
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            {matrixQpus.length} QPUs
          </span>
        </div>

        <div
          className="panel overflow-hidden"
          style={{ background: 'var(--color-bg-panel)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="text-left px-4 py-3 text-[var(--color-text-muted)] font-mono text-[11px] tracking-widest uppercase border-b border-[var(--color-border)] whitespace-nowrap bg-[var(--color-bg-raised)]"
                    style={{ minWidth: '180px' }}
                  >
                    QPU / Provider
                  </th>
                  {FRAMEWORK_COLS.map((fw) => (
                    <th
                      key={fw.id}
                      scope="col"
                      className="px-4 py-3 text-center text-[var(--color-text-muted)] font-mono text-[11px] tracking-widest uppercase border-b border-[var(--color-border)] whitespace-nowrap bg-[var(--color-bg-raised)]"
                    >
                      {fw.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixQpus.map((qpu, idx) => (
                  <tr
                    key={qpu.id}
                    className={
                      idx % 2 === 0
                        ? 'bg-transparent'
                        : 'bg-[rgba(255,255,255,0.015)]'
                    }
                  >
                    <td className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[var(--color-text-primary)] font-medium text-sm">
                          {qpu.name}
                        </span>
                        <span className="text-[var(--color-text-muted)] text-xs font-mono">
                          {qpu.providerId}
                        </span>
                      </div>
                    </td>
                    {FRAMEWORK_COLS.map((fw) => {
                      const supported = qpu.frameworks.includes(fw.id)
                      return (
                        <td
                          key={fw.id}
                          className="px-4 py-3 text-center border-b border-[var(--color-border-subtle)]"
                          aria-label={
                            supported
                              ? `${qpu.name} supports ${fw.label}`
                              : `${qpu.name} does not support ${fw.label}`
                          }
                        >
                          {supported ? (
                            <span
                              className="inline-flex items-center justify-center text-[var(--color-success)] text-base"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center text-[var(--color-text-faint)] text-base"
                              aria-hidden="true"
                            >
                              —
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-[var(--color-border-subtle)]">
            <p className="text-[var(--color-text-muted)] text-xs">
              Compatibility changes with framework updates. Verify with official documentation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
