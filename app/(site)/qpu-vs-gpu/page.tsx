import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Separator } from '@/components/ui/Separator'
import { ComputeStack } from '@/components/svg/ComputeStack'

export const metadata: Metadata = {
  title: 'QPU vs GPU vs CPU — Quantum vs Classical Computing',
  description:
    'How QPUs, GPUs, and CPUs differ. QPUs are not GPU replacements — they solve different problem types. A guide to hybrid quantum-classical computing.',
}

// ─── Comparison data ──────────────────────────────────────────────────────────

interface ProcessorSpec {
  name: string
  tagline: string
  paradigm: string
  cores: string
  speed: string
  optimizedFor: string[]
  notFor: string[]
  scale: string
  example: string
  borderColor: string
  labelColor: string
}

const PROCESSORS: ProcessorSpec[] = [
  {
    name: 'CPU',
    tagline: 'Central Processing Unit',
    paradigm: 'Classical, sequential + limited parallel',
    cores: '4–128 high-performance cores',
    speed: '3–5 GHz clock speed',
    optimizedFor: [
      'Operating systems',
      'Databases and web servers',
      'Business logic and most software',
      'Serial algorithms',
      'Low-latency tasks',
    ],
    notFor: [
      'Training large ML models',
      'Quantum-native algorithms',
    ],
    scale: 'Billions of transistors, mature CMOS process',
    example: 'Apple M4, AMD EPYC, Intel Xeon',
    borderColor: 'border-[rgba(255,255,255,0.18)]',
    labelColor: 'text-[var(--color-text-secondary)]',
  },
  {
    name: 'GPU',
    tagline: 'Graphics Processing Unit',
    paradigm: 'Classical, massively parallel',
    cores: 'Thousands of stream processors / CUDA cores',
    speed: '1–3 GHz clock, HBM memory bandwidth',
    optimizedFor: [
      'Neural network training and inference',
      'Matrix and tensor operations',
      'Computer graphics and rendering',
      'Scientific HPC simulation',
      'Parallelizable numerical computation',
    ],
    notFor: [
      'Serial low-latency tasks (use CPU)',
      'Quantum-native algorithms',
    ],
    scale: 'Tens of thousands of cores, GDDR6X/HBM',
    example: 'NVIDIA H100, A100, AMD Instinct MI300X',
    borderColor: 'border-[rgba(255,255,255,0.18)]',
    labelColor: 'text-[var(--color-text-secondary)]',
  },
  {
    name: 'QPU',
    tagline: 'Quantum Processing Unit',
    paradigm: 'Quantum-state computation',
    cores: '10–1,000+ qubits (with very different error characteristics)',
    speed: 'Gate time: 10ns–1ms; probabilistic, many shots required',
    optimizedFor: [
      'Quantum chemistry simulation',
      'Certain optimization problems (QAOA)',
      'Quantum algorithm research',
      'Quantum key distribution / cryptography',
      'Materials science simulation',
    ],
    notFor: [
      'Web apps, databases, most business software',
      'General ML inference (use GPU)',
      'Any task a classical computer handles well',
    ],
    scale: 'NISQ era: 10–5,000 qubits, high error rates',
    example: 'IBM Heron r2, IonQ Forte, Quantinuum H2',
    borderColor: 'border-[rgba(34,211,238,0.3)]',
    labelColor: 'text-[var(--color-accent)]',
  },
]

// ─── ToC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { text: 'Three-Way Comparison', id: 'comparison' },
  { text: 'Hybrid Quantum-Classical', id: 'hybrid' },
  { text: 'When to Consider a QPU', id: 'when-to-use' },
  { text: 'QPUs Alongside GPUs', id: 'cuda-q' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QPUvsGPUPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb
            items={[
              { label: 'QPU.co', href: '/' },
              { label: 'Learn', href: '/learn' },
              { label: 'QPU vs GPU vs CPU' },
            ]}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-10 lg:gap-14">

          {/* ── Main content ─────────────────────────────────────────── */}
          <article className="min-w-0">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-[var(--color-text-primary)] mb-3">
                QPU vs GPU vs CPU
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-none">
                Quantum processors are not replacements for classical computing — they are
                specialized accelerators for specific problem types. Understanding the
                difference prevents both overestimating and underestimating quantum hardware.
              </p>
            </header>

            {/* Diagram */}
            <ComputeStack />

            <Separator className="my-8" />

            {/* ── Three-way comparison ───────────────────────────────── */}
            <section aria-labelledby="comparison">
              <h2 id="comparison" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                Three-Way Comparison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {PROCESSORS.map((p) => (
                  <ProcessorCard key={p.name} spec={p} />
                ))}
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-none">
                The critical point: these are complementary, not competitive. A complete
                high-performance computing stack in the quantum era will have CPUs for control
                flow, GPUs for classical numerical computation and ML, and QPUs for specific
                quantum subroutines — all working together in a hybrid architecture.
              </p>
            </section>

            {/* ── Hybrid quantum-classical ───────────────────────────── */}
            <section aria-labelledby="hybrid">
              <h2 id="hybrid" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                Hybrid Quantum-Classical Computing
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                Nearly every near-term quantum algorithm is <em>hybrid</em> — classical and
                quantum processors collaborate in an iterative loop. The two most prominent
                hybrid algorithms illustrate this pattern:
              </p>

              <div className="space-y-4 mb-6">
                {[
                  {
                    name: 'VQE (Variational Quantum Eigensolver)',
                    desc: 'Used for quantum chemistry. The QPU prepares and measures a parameterized quantum state (ansatz). A classical optimizer (on CPU/GPU) updates the circuit parameters to minimize the measured energy expectation value. The loop iterates until convergence.',
                    role: 'QPU: state preparation + measurement · CPU: optimization loop',
                  },
                  {
                    name: 'QAOA (Quantum Approximate Optimization Algorithm)',
                    desc: 'For combinatorial optimization. The QPU evaluates the cost function encoded as a quantum circuit. The classical processor (typically L-BFGS or gradient descent) updates the circuit angles. The QPU returns better and better approximate solutions as angles improve.',
                    role: 'QPU: cost evaluation · CPU/GPU: parameter optimization',
                  },
                ].map((algo) => (
                  <div
                    key={algo.name}
                    className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)]"
                  >
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                      {algo.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                      {algo.desc}
                    </p>
                    <p className="text-xs font-mono text-[var(--color-accent)] bg-[var(--color-accent-muted)] px-2 py-1 rounded-[var(--radius-sm)] inline-block">
                      {algo.role}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-none">
                In hybrid algorithms, the QPU is a coprocessor — it handles the quantum
                circuit evaluation that benefits from quantum parallelism, while the classical
                system (CPU or GPU) handles everything else: optimization, data preprocessing,
                result aggregation, and control flow. Neither processor is fully sufficient on
                its own.
              </p>
            </section>

            {/* ── When to consider a QPU ─────────────────────────────── */}
            <section aria-labelledby="when-to-use">
              <h2 id="when-to-use" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                When to Consider a QPU
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5 max-w-none">
                Honest assessment for 2024–2026. QPU capability is advancing rapidly, but
                the technology is still early-stage. Here is a realistic breakdown:
              </p>

              <div className="space-y-4">
                {/* NOT for */}
                <div className="p-4 rounded-[var(--radius-lg)] border border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.05)]">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={15} className="text-[var(--color-danger)] shrink-0" />
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      NOT for (today)
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      'Most business software, web applications, APIs',
                      'General machine learning inference (GPUs are orders of magnitude better)',
                      'Database queries, file processing, most optimization',
                      'Any problem a well-tuned classical solver handles in under an hour',
                    ].map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-danger)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* POSSIBLY for */}
                <div className="p-4 rounded-[var(--radius-lg)] border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.05)]">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={15} className="text-[var(--color-warning)] shrink-0" />
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      POSSIBLY for (research, 2024–2026)
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      'Quantum chemistry simulation for small molecules (VQE on 20–50 qubits)',
                      'Quantum algorithm research and benchmarking',
                      'Hybrid optimization for specific problem structures with time constraints',
                      'Quantum simulation of physical systems (Hamiltonian dynamics)',
                    ].map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-warning)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* EVENTUALLY for */}
                <div className="p-4 rounded-[var(--radius-lg)] border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.05)]">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={15} className="text-[var(--color-accent)] shrink-0" />
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      EVENTUALLY for (fault-tolerant era, 2030s+)
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      'Cryptographically relevant Shor\'s algorithm (integer factoring)',
                      'Large-scale materials and drug discovery simulation',
                      'Quantum ML subroutines with demonstrated speedup',
                      'Financial optimization at scales that defeat classical methods',
                    ].map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-5 mb-3 max-w-none">
                The timeline caveat: quantum hardware progress is faster than expected in some
                areas (gate fidelity, error correction proofs-of-concept) and slower in others
                (practical problem advantage at scale). Treat the above as directional, not
                a firm forecast.
              </p>
            </section>

            {/* ── CUDA-Q / GPU-QPU hybrid ────────────────────────────── */}
            <section aria-labelledby="cuda-q">
              <h2 id="cuda-q" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                Running QPUs Alongside GPUs
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                NVIDIA&apos;s CUDA-Q platform explicitly targets the GPU-QPU hybrid architecture:
                quantum circuits are expressed in C++/Python, classical simulation runs on
                NVIDIA GPUs, and when hardware is available, circuits can be dispatched to
                real QPU backends (IQM, IonQ, Quantinuum, and others) using the same codebase.
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                This GPU-QPU pairing makes practical sense: GPUs can simulate small quantum
                circuits classically (up to ~30 qubits with state-vector simulation, more with
                tensor network methods). As QPU hardware scales, the same algorithms that were
                developed and tested on GPU simulators transition to real QPU execution.
              </p>
              <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)]">
                <p className="text-xs font-mono text-[var(--color-accent)] mb-1">CUDA-Q architecture</p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Unified programming model → GPU simulation target ↔ QPU hardware target.
                  Classical optimization runs on GPU; quantum circuit evaluation on QPU.
                  See:{' '}
                  <Link href="/frameworks/cuda-q" className="text-[var(--color-accent)] hover:underline">
                    CUDA-Q framework guide →
                  </Link>
                </p>
              </div>
            </section>

            {/* Footer nav */}
            <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex gap-4 flex-wrap">
              <Link
                href="/what-is-a-qpu"
                className="text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                ← What Is a QPU?
              </Link>
              <Link
                href="/glossary"
                className="text-sm font-mono text-[var(--color-accent)] hover:opacity-80 transition-opacity"
              >
                Glossary →
              </Link>
            </div>
          </article>

          {/* ── Right: Sticky ToC ─────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="eyebrow mb-3 text-[var(--color-text-muted)]">Contents</p>
              <nav aria-label="Table of contents">
                <ul className="space-y-1">
                  {TOC.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block text-xs leading-relaxed py-0.5 pl-3 border-l-2 border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] transition-all duration-150"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-6 pt-5 border-t border-[var(--color-border)] space-y-2">
                <p className="text-[11px] text-[var(--color-text-muted)] font-mono uppercase tracking-wider">
                  Related
                </p>
                {[
                  { label: 'What Is a QPU?', href: '/what-is-a-qpu' },
                  { label: 'QPU Architectures', href: '/architectures' },
                  { label: 'CUDA-Q Framework', href: '/frameworks/cuda-q' },
                  { label: 'Glossary', href: '/glossary' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:opacity-80 transition-opacity"
                  >
                    {link.label}
                    <ChevronRight size={10} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

// ─── Processor Card ───────────────────────────────────────────────────────────

function ProcessorCard({ spec }: { spec: ProcessorSpec }) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border ${spec.borderColor} bg-[var(--color-bg-panel)] p-5 flex flex-col`}
    >
      <div className="mb-4">
        <p className={`font-mono text-2xl font-bold mb-0.5 ${spec.labelColor}`}>
          {spec.name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">{spec.tagline}</p>
      </div>

      <dl className="space-y-2 mb-4 text-xs">
        {[
          { label: 'Paradigm', value: spec.paradigm },
          { label: 'Scale', value: spec.scale },
          { label: 'Speed', value: spec.speed },
          { label: 'Example', value: spec.example },
        ].map(({ label, value }) => (
          <div key={label}>
            <dt className="text-[var(--color-text-muted)] font-mono uppercase text-[10px] tracking-wider">
              {label}
            </dt>
            <dd className="text-[var(--color-text-secondary)] mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          Optimized for
        </p>
        <ul className="space-y-1 mb-4">
          {spec.optimizedFor.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <CheckCircle2 size={10} className="text-[var(--color-success)] mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          Not for
        </p>
        <ul className="space-y-1">
          {spec.notFor.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-xs text-[var(--color-text-muted)]">
              <XCircle size={10} className="text-[var(--color-danger)] mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
