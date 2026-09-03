import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Framework, QPU } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatQubits } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────

interface FrameworkDetailProps {
  framework: Framework
  compatibleQpus: QPU[]
}

// ─── Framework-specific extended data ────────────────────────────────────────

interface ProviderCompatRow {
  provider: string
  accessMethod: string
  notes: string
}

interface FrameworkExtendedData {
  installCommand: string
  installNotes: string
  codeExample: string
  cloudAccess: string
  providerCompat: ProviderCompatRow[]
}

const FRAMEWORK_DATA: Record<string, FrameworkExtendedData> = {
  qiskit: {
    installCommand: 'pip install qiskit qiskit-ibm-runtime',
    installNotes:
      'Requires Python 3.8+. For local simulation only, `pip install qiskit` is sufficient. `qiskit-ibm-runtime` is required to submit jobs to IBM Quantum hardware. Optional extras: `pip install qiskit[visualization]` for circuit diagrams.',
    codeExample: `from qiskit import QuantumCircuit
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# Submit to IBM Quantum
service = QiskitRuntimeService()
backend = service.least_busy(operational=True, simulator=False)
sampler = Sampler(backend)
job = sampler.run([qc])
result = job.result()`,
    cloudAccess:
      'IBM Quantum offers a free tier with access to select QPUs via the IBM Quantum Network. Authenticate via `QiskitRuntimeService.save_account(token="...")`. The Sampler and Estimator primitives handle job submission and result retrieval. AWS Braket and Azure Quantum access requires the respective bridge packages.',
    providerCompat: [
      { provider: 'IBM Quantum', accessMethod: 'Native (qiskit-ibm-runtime)', notes: 'Free tier available; Sampler & Estimator primitives; least_busy backend selection' },
      { provider: 'Amazon Braket', accessMethod: 'qiskit-braket-provider plugin', notes: 'Transpiles Qiskit circuits to Braket IR; access IonQ, Rigetti, QuEra via Braket' },
      { provider: 'Azure Quantum', accessMethod: 'Azure Quantum bridge', notes: 'Submit Qiskit circuits to IonQ and Quantinuum backends on Azure' },
    ],
  },
  cirq: {
    installCommand: 'pip install cirq\n# For Google Quantum AI hardware:\npip install cirq-google',
    installNotes:
      'Requires Python 3.10+. `cirq` installs the core framework with local simulation. `cirq-google` is needed for Google Quantum AI hardware access (requires project approval). For IonQ backend: `pip install cirq-ionq`.',
    codeExample: `import cirq

q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit([
    cirq.H(q0),
    cirq.CNOT(q0, q1),
    cirq.measure(q0, q1, key='result')
])

# Local simulation
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1024)

# Google hardware (requires access approval)
import cirq_google
engine = cirq_google.Engine(project_id='your-project-id')`,
    cloudAccess:
      'Google Quantum AI hardware is available to approved research partners via `cirq-google`. Access requires submitting an application to the Google Quantum AI program. IonQ hardware is accessible via `cirq-ionq`. AWS Braket also supports Cirq-native circuits through its SDK integration.',
    providerCompat: [
      { provider: 'Google Quantum AI', accessMethod: 'cirq-google (native)', notes: 'Requires research access approval from Google Quantum AI program' },
      { provider: 'IonQ', accessMethod: 'cirq-ionq plugin', notes: 'pip install cirq-ionq; supports IonQ Harmony and Forte via native gates' },
      { provider: 'Pasqal', accessMethod: 'cirq-pasqal plugin', notes: 'pip install cirq-pasqal; neutral-atom gate emulation and hardware targets' },
    ],
  },
  'cuda-q': {
    installCommand: 'pip install cudaq\n# Alternative:\npip install cuda-quantum\n# Or use the official NVIDIA container:\n# docker pull nvcr.io/nvidia/nightly/cuda-quantum:latest',
    installNotes:
      'Requires Python 3.10+. GPU simulation requires an NVIDIA GPU with CUDA 11.8+. CPU simulation works without a GPU. The NVIDIA container includes all GPU drivers and dependencies pre-configured. For hardware targets, additional backend credentials are required.',
    codeExample: `import cudaq

@cudaq.kernel
def bell_state():
    qubits = cudaq.qvector(2)
    h(qubits[0])
    cx(qubits[0], qubits[1])
    mz(qubits)

# Local GPU simulation
counts = cudaq.sample(bell_state, shots_count=1024)
print(counts)

# Run on IonQ hardware
cudaq.set_target('ionq', machine='ionq.forte')
hardware_counts = cudaq.sample(bell_state, shots_count=100)`,
    cloudAccess:
      'CUDA-Q uses a target-based model: call `cudaq.set_target(...)` to switch from local GPU simulation to cloud QPUs. Supported hardware targets include IonQ, Quantinuum, and IBM Quantum. Each target requires the corresponding API credentials set via environment variables or the CUDA-Q credentials file.',
    providerCompat: [
      { provider: 'NVIDIA (simulation)', accessMethod: 'Local GPU (native)', notes: 'cuStateVec and cuTensorNet backends; multi-GPU support for large circuits' },
      { provider: 'IonQ', accessMethod: 'set_target("ionq")', notes: 'Supports ionq.harmony and ionq.forte; requires IONQ_API_KEY env var' },
      { provider: 'Quantinuum', accessMethod: 'set_target("quantinuum")', notes: 'Supports H1 and H2 systems; requires Quantinuum credentials' },
      { provider: 'IBM Quantum', accessMethod: 'set_target("ibm")', notes: 'Requires IBM Quantum API token; uses Qiskit Runtime under the hood' },
    ],
  },
  pennylane: {
    installCommand: 'pip install pennylane\n# For hardware backends:\npip install pennylane-qiskit pennylane-cirq',
    installNotes:
      'Requires Python 3.10+. The base `pennylane` package includes the `default.qubit` simulator. Hardware plugins (`pennylane-qiskit`, `pennylane-cirq`) require their respective credentials. For AWS Braket: `pip install amazon-braket-pennylane-plugin`. JAX, PyTorch, or TensorFlow can be used as the autodiff backend.',
    codeExample: `import pennylane as qml

dev = qml.device('default.qubit', wires=2)

@qml.qnode(dev)
def bell_circuit():
    qml.Hadamard(wires=0)
    qml.CNOT(wires=[0, 1])
    return qml.probs(wires=[0, 1])

probs = bell_circuit()
print(probs)  # [0.5, 0., 0., 0.5]

# Switch to IBM Quantum hardware:
# dev = qml.device('qiskit.ibmq', wires=2,
#                  backend='ibmq_manila',
#                  ibmqx_token='YOUR_TOKEN')`,
    cloudAccess:
      'PennyLane connects to hardware via device plugins. AWS Braket is accessible natively (`amazon-braket-pennylane-plugin`). IBM Quantum hardware is available via `pennylane-qiskit`. The framework\'s gradient computation works end-to-end through hardware, enabling variational algorithm training directly on QPUs.',
    providerCompat: [
      { provider: 'IBM Quantum', accessMethod: 'pennylane-qiskit plugin', notes: 'pip install pennylane-qiskit; uses Qiskit Runtime under the hood' },
      { provider: 'Amazon Braket', accessMethod: 'amazon-braket-pennylane-plugin (native)', notes: 'pip install amazon-braket-pennylane-plugin; supports all Braket QPUs' },
      { provider: 'Azure Quantum', accessMethod: 'pennylane-azure plugin', notes: 'Access IonQ and Quantinuum via Azure Quantum workspace' },
      { provider: 'Xanadu (Borealis)', accessMethod: 'strawberryfields plugin', notes: 'For photonic QC; pip install pennylane-sf' },
    ],
  },
  qsharp: {
    installCommand: 'pip install qsharp azure-quantum\n# VS Code extension:\n# "Microsoft Quantum Development Kit" from the marketplace',
    installNotes:
      'Requires Python 3.9+ and .NET 8 SDK (for Q# compilation). The VS Code extension provides syntax highlighting, IntelliSense, and integrated circuit visualization. Azure Quantum workspace credentials are required for hardware access.',
    codeExample: `import qsharp

# Inline Q# within Python
result = qsharp.eval("""
    open Microsoft.Quantum.Diagnostics;
    operation BellState() : (Result, Result) {
        use (q1, q2) = (Qubit(), Qubit());
        H(q1);
        CNOT(q1, q2);
        return (M(q1), M(q2));
    }
""")

# Run on Azure Quantum
from azure.quantum import Workspace
from azure.quantum.qiskit import AzureQuantumProvider`,
    cloudAccess:
      'Q# targets Azure Quantum exclusively for hardware access. Create a Workspace in the Azure Portal, then connect via `azure.quantum.Workspace`. Azure Quantum provides access to IonQ, Quantinuum, Rigetti, and Pasqal hardware through a unified billing model. Credits and quotas vary by provider.',
    providerCompat: [
      { provider: 'Azure Quantum (native)', accessMethod: 'azure-quantum SDK', notes: 'Unified billing; Azure Credits apply to all providers on the platform' },
      { provider: 'IonQ (via Azure)', accessMethod: 'azure-quantum target: ionq.*', notes: 'Access ionq.harmony and ionq.forte through Azure Quantum workspace' },
      { provider: 'Quantinuum (via Azure)', accessMethod: 'azure-quantum target: quantinuum.*', notes: 'H-Series systems available; syntax compilation via Quantinuum TKET' },
      { provider: 'Rigetti (via Azure)', accessMethod: 'azure-quantum target: rigetti.*', notes: 'Ankaa and Aspen systems via Azure; requires Quil transpilation' },
    ],
  },
  'amazon-braket-sdk': {
    installCommand: 'pip install amazon-braket-sdk',
    installNotes:
      'Requires Python 3.9+ and an AWS account with Braket service enabled. Jobs are submitted to the `us-east-1` or `eu-west-2` regions depending on the QPU provider. The managed simulator (SV1) is free for small circuits; QPU shots are billed per-shot.',
    codeExample: `from braket.circuits import Circuit
from braket.aws import AwsDevice

# Build Bell state
circuit = Circuit()
circuit.h(0)
circuit.cnot(0, 1)
circuit.measure(0)
circuit.measure(1)

# Run on IonQ Forte (via Braket)
device = AwsDevice("arn:aws:braket:us-east-1::device/qpu/ionq/Forte-1")
task = device.run(circuit, shots=100)
result = task.result()
print(result.measurement_counts)

# Free managed simulator:
# device = AwsDevice(
#   "arn:aws:braket:::device/quantum-simulator/amazon/sv1"
# )`,
    cloudAccess:
      'Amazon Braket is AWS\'s fully managed quantum computing service. QPU access is pay-per-shot with no upfront commitment. The SV1 (state-vector) simulator is free for circuits up to 34 qubits. Braket integrates with AWS IAM, CloudWatch, and S3 for results storage. Hybrid quantum-classical jobs can be submitted via `AwsQuantumJob`.',
    providerCompat: [
      { provider: 'IonQ', accessMethod: 'AwsDevice (Forte-1, Harmony)', notes: 'ionq/Forte-1 and ionq/Harmony; pay-per-shot pricing' },
      { provider: 'Rigetti', accessMethod: 'AwsDevice (Ankaa-3)', notes: 'rigetti/Ankaa-3; Aspen-M-3 also available; native quil compilation' },
      { provider: 'QuEra', accessMethod: 'AwsDevice (Aquila)', notes: 'quera/Aquila; neutral-atom analog device; 256 qubits; AHS programs' },
      { provider: 'D-Wave', accessMethod: 'AwsDevice (Advantage)', notes: 'dwave/DW_2000Q_6 and Advantage; quantum annealing workloads' },
      { provider: 'OQC', accessMethod: 'AwsDevice (Lucy)', notes: 'oqc/Lucy; 8-qubit superconducting; UK-based provider' },
    ],
  },
}

// ─── Helper: cloud platform label/URL ─────────────────────────────────────────

const CLOUD_PLATFORM_LABELS: Record<string, string> = {
  'ibm-quantum': 'IBM Quantum',
  'aws-braket': 'Amazon Braket',
  'azure-quantum': 'Azure Quantum',
  'google-cloud-quantum': 'Google Quantum AI',
  'ionq-cloud': 'IonQ Cloud',
  'quantinuum-nexus': 'Quantinuum Nexus',
  'dwave-leap': 'D-Wave Leap',
}

const CLOUD_PLATFORM_URLS: Record<string, string> = {
  'ibm-quantum': 'https://quantum.ibm.com/',
  'aws-braket': 'https://aws.amazon.com/braket/',
  'azure-quantum': 'https://azure.microsoft.com/products/quantum',
  'google-cloud-quantum': 'https://quantumai.google/',
  'ionq-cloud': 'https://cloud.ionq.com/',
  'quantinuum-nexus': 'https://www.quantinuum.com/products/nexus',
  'dwave-leap': 'https://cloud.dwavesys.com/leap/',
}

function cloudPlatformLabel(slug: string): string {
  return CLOUD_PLATFORM_LABELS[slug] ?? slug
}

function cloudPlatformUrl(slug: string): string {
  return CLOUD_PLATFORM_URLS[slug] ?? '#'
}

// ─── Related frameworks ───────────────────────────────────────────────────────

const ALL_FRAMEWORKS: Array<{ slug: string; name: string }> = [
  { slug: 'qiskit', name: 'Qiskit' },
  { slug: 'cirq', name: 'Cirq' },
  { slug: 'cuda-q', name: 'CUDA-Q' },
  { slug: 'pennylane', name: 'PennyLane' },
  { slug: 'qsharp', name: 'Q#' },
  { slug: 'amazon-braket-sdk', name: 'Amazon Braket SDK' },
]

// ─── Section heading helper ───────────────────────────────────────────────────

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
      {children}
    </h2>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FrameworkDetail({ framework, compatibleQpus }: FrameworkDetailProps) {
  const extData = FRAMEWORK_DATA[framework.slug]
  const relatedFrameworks = ALL_FRAMEWORKS.filter(f => f.slug !== framework.slug)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* ── 1. Breadcrumb ────────────────────────────────────────────────── */}
      <Breadcrumb
        items={[
          { label: 'QPU.co', href: '/' },
          { label: 'Frameworks', href: '/frameworks' },
          { label: framework.name },
        ]}
      />

      {/* ── 2. Hero ──────────────────────────────────────────────────────── */}
      <header className="space-y-4">
        <p className="eyebrow">Quantum Framework</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
          {framework.name}
        </h1>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent" size="md">{framework.maintainer}</Badge>
          {framework.language.map(lang => (
            <Badge key={lang} variant="muted" size="md">{lang}</Badge>
          ))}
          {framework.version && (
            <span className="mono-label">v{framework.version}</span>
          )}
        </div>

        <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-3xl">
          {framework.description}
        </p>
      </header>

      {/* ── 3. Overview panel ────────────────────────────────────────────── */}
      <section>
        <SectionHeading>Overview</SectionHeading>
        <div className="panel p-6 grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="mono-label mb-1">Maintainer</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{framework.maintainer}</p>
            </div>
            <div>
              <p className="mono-label mb-1">Language(s)</p>
              <div className="flex flex-wrap gap-1.5">
                {framework.language.map(lang => (
                  <Badge key={lang} variant="muted" size="sm">{lang}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mono-label mb-1">Version</p>
              <p className="text-sm text-[var(--color-text-primary)]">{framework.version ?? 'See docs'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mono-label mb-1">Supported Architectures</p>
              <div className="flex flex-wrap gap-1.5">
                {framework.supportedArchitectures.map(arch => (
                  <ArchitectureBadge key={arch} architecture={arch} size="sm" />
                ))}
              </div>
            </div>
            <div>
              <p className="mono-label mb-2">Cloud Platforms</p>
              <div className="flex flex-wrap gap-2">
                {framework.cloudPlatforms.map(slug => (
                  <a
                    key={slug}
                    href={cloudPlatformUrl(slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-accent)] hover:underline"
                  >
                    {cloudPlatformLabel(slug)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="sm:col-span-2 pt-4 border-t border-[var(--color-border-subtle)] flex flex-wrap gap-4">
            <a
              href={framework.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <a
              href={framework.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Official Docs
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. Installation ──────────────────────────────────────────────── */}
      <section>
        <SectionHeading>Installation</SectionHeading>
        {extData ? (
          <div className="space-y-4">
            <pre className="code-block whitespace-pre-wrap">{extData.installCommand}</pre>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {extData.installNotes}
            </p>
          </div>
        ) : (
          <div className="panel p-5">
            <p className="text-sm text-[var(--color-text-secondary)]">
              See the{' '}
              <a
                href={framework.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                official documentation
              </a>{' '}
              for installation instructions.
            </p>
          </div>
        )}
      </section>

      {/* ── 5. Basic Circuit Example (Bell State) ────────────────────────── */}
      <section>
        <SectionHeading>Bell State Example</SectionHeading>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">
          A Bell state (maximally entangled two-qubit state) is the canonical first circuit for any quantum framework.
        </p>
        {extData ? (
          <pre className="code-block whitespace-pre-wrap">{extData.codeExample}</pre>
        ) : (
          <div className="panel p-5">
            <p className="text-sm text-[var(--color-text-secondary)]">
              See the{' '}
              <a
                href={framework.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                official tutorials
              </a>{' '}
              for circuit examples.
            </p>
          </div>
        )}
      </section>

      {/* ── 6. Cloud Access ──────────────────────────────────────────────── */}
      <section>
        <SectionHeading>Cloud Access</SectionHeading>
        <div className="panel p-5">
          {extData ? (
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {extData.cloudAccess}
            </p>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              See{' '}
              <a
                href={framework.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                the documentation
              </a>{' '}
              for cloud access details.
            </p>
          )}
        </div>
      </section>

      {/* ── 7. Provider Compatibility table ──────────────────────────────── */}
      <section>
        <SectionHeading>Provider Compatibility</SectionHeading>
        {extData && extData.providerCompat.length > 0 ? (
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Provider</th>
                    <th className="text-left">Access Method</th>
                    <th className="text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {extData.providerCompat.map((row, i) => (
                    <tr key={i}>
                      <td className="font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                        {row.provider}
                      </td>
                      <td>
                        <code className="code-inline">{row.accessMethod}</code>
                      </td>
                      <td className="text-[var(--color-text-secondary)]">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="panel p-5 flex flex-wrap gap-3">
            {framework.cloudPlatforms.map(slug => (
              <a
                key={slug}
                href={cloudPlatformUrl(slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="chip border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg-raised)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                {cloudPlatformLabel(slug)}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── 8. Compatible QPUs grid ──────────────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <SectionHeading>Compatible QPUs</SectionHeading>
          <span className="mono-label">{compatibleQpus.length} systems</span>
        </div>

        {compatibleQpus.length === 0 ? (
          <EmptyState
            title="No compatible QPUs indexed"
            description="Compatible hardware for this framework has not been catalogued yet. Check the documentation for current hardware support."
            action={{ label: 'Browse all QPUs', href: '/qpus' }}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {compatibleQpus.map(qpu => (
              <QPUMiniCard key={qpu.id} qpu={qpu} />
            ))}
          </div>
        )}
      </section>

      {/* ── 9. Documentation Links ───────────────────────────────────────── */}
      <section>
        <SectionHeading>Documentation &amp; Resources</SectionHeading>
        <div className="panel p-5 flex flex-col sm:flex-row gap-4">
          <a
            href={framework.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 flex-1 group rounded-lg p-3 border border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-[var(--color-bg-raised)] hover:bg-[var(--color-bg-overlay)] transition-all"
          >
            <span className="mt-0.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                GitHub Repository
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                {framework.githubUrl.replace('https://', '')}
              </p>
            </div>
          </a>

          <a
            href={framework.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 flex-1 group rounded-lg p-3 border border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-[var(--color-bg-raised)] hover:bg-[var(--color-bg-overlay)] transition-all"
          >
            <span className="mt-0.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                Official Documentation
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                {framework.docsUrl.replace('https://', '')}
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* ── 10. Related Frameworks ───────────────────────────────────────── */}
      <section>
        <SectionHeading>Related Frameworks</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {relatedFrameworks.map(f => (
            <Link
              key={f.slug}
              href={`/frameworks/${f.slug}`}
              className="chip border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg-raised)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors px-3 py-1"
            >
              {f.name}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}

// ─── QPU mini card (internal) ─────────────────────────────────────────────────

function QPUMiniCard({ qpu }: { qpu: QPU }) {
  return (
    <Link
      href={`/qpus/${qpu.slug}`}
      className="block group"
      aria-label={`View ${qpu.name} details`}
    >
      <div className="panel p-4 h-full transition-all duration-150 group-hover:border-[var(--color-border-strong)] group-hover:bg-[var(--color-bg-overlay)]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug">
            {qpu.name}
          </h3>
          <StatusBadge status={qpu.status} size="sm" />
        </div>
        <div className="mb-3">
          <ArchitectureBadge architecture={qpu.architecture} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="mono-label mb-0.5">Qubits</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {formatQubits(qpu.physicalQubits)}
            </p>
          </div>
          <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
