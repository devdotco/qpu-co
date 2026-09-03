'use client'

import * as React from 'react'
import { Tabs, TabsContent } from '@/components/ui/Tabs'
import { CopyButton } from '@/components/ui/CopyButton'
import type { TabItem } from '@/components/ui/Tabs'

// ── Code examples ─────────────────────────────────────────────────────────────

const QISKIT_CODE = `from qiskit import QuantumCircuit
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

# Create a Bell state circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

print(qc.draw())
# Submit to IBM Quantum hardware
service = QiskitRuntimeService()
backend = service.least_busy(operational=True, simulator=False)
sampler = Sampler(backend)
job = sampler.run([qc], shots=1024)
result = job.result()`

const CIRQ_CODE = `import cirq

# Define qubits
q0, q1 = cirq.LineQubit.range(2)

# Build Bell state circuit
circuit = cirq.Circuit([
    cirq.H(q0),
    cirq.CNOT(q0, q1),
    cirq.measure(q0, q1, key='result')
])

print(circuit)
# Simulate
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1024)
print(result.histogram(key='result'))`

const CUDA_Q_CODE = `import cudaq

@cudaq.kernel
def bell_state():
    qubits = cudaq.qvector(2)
    h(qubits[0])
    cx(qubits[0], qubits[1])
    mz(qubits)

# Run on simulator
counts = cudaq.sample(bell_state, shots_count=1024)
print(counts)

# Run on IonQ hardware
cudaq.set_target('ionq', machine='ionq.forte')
counts = cudaq.sample(bell_state, shots_count=1024)`

const PENNYLANE_CODE = `import pennylane as qml
import numpy as np

dev = qml.device('default.qubit', wires=2)

@qml.qnode(dev)
def bell_circuit():
    qml.Hadamard(wires=0)
    qml.CNOT(wires=[0, 1])
    return qml.probs(wires=[0, 1])

# Run and get probabilities
probs = bell_circuit()
print(probs)  # [0.5, 0., 0., 0.5] for |00⟩ and |11⟩

# Switch to hardware: dev = qml.device('qiskit.ibmq', wires=2, ...)`

// ── Tab config ────────────────────────────────────────────────────────────────

const TAB_ITEMS: TabItem[] = [
  { id: 'qiskit',    label: 'Qiskit' },
  { id: 'cirq',      label: 'Cirq' },
  { id: 'cuda-q',    label: 'CUDA-Q' },
  { id: 'pennylane', label: 'PennyLane' },
]

const CODE_EXAMPLES: Record<string, string> = {
  qiskit:    QISKIT_CODE,
  cirq:      CIRQ_CODE,
  'cuda-q':  CUDA_Q_CODE,
  pennylane: PENNYLANE_CODE,
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CodePreview() {
  return (
    <section id="code-examples" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="eyebrow mb-2">Code Examples</p>
          <h2
            className="text-[var(--color-text-primary)]"
            style={{ maxWidth: 'none' }}
          >
            Example: Bell State Circuit
          </h2>
          <p className="text-[var(--color-text-secondary)] mt-2 text-sm">
            The Bell state is the canonical two-qubit entanglement circuit — a
            standard starting point for any quantum framework.
          </p>
        </div>

        <div className="panel p-6">
          <Tabs items={TAB_ITEMS} variant="underline">
            {TAB_ITEMS.map((tab) => {
              const code = CODE_EXAMPLES[tab.id] ?? ''
              return (
                <TabsContent key={tab.id} value={tab.id}>
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                      <CopyButton text={code} />
                    </div>
                    <pre className="code-block pr-10">
                      <code>{code}</code>
                    </pre>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>

          <p className="text-[var(--color-text-muted)] text-xs mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
            Code examples are illustrative. Verify API details with official
            documentation.
          </p>
        </div>
      </div>
    </section>
  )
}
