import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, ChevronRight } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'
import { QPUDiagram } from '@/components/svg/QPUDiagram'

export const metadata: Metadata = {
  title: 'What Is a Quantum Processing Unit (QPU)?',
  description:
    'A complete guide to quantum processing units: how QPUs work, the difference from CPUs and GPUs, qubit types, quantum gates, architectures, manufacturers, and how to access a QPU.',
  keywords: [
    'what is a QPU',
    'quantum processing unit',
    'QPU explained',
    'how quantum computers work',
    'qubit explained',
    'quantum vs classical computing',
  ],
}

// ─── FAQ items for JSON-LD and page render ────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'What does QPU stand for?',
    a: 'QPU stands for Quantum Processing Unit — a specialized processor that uses quantum mechanical phenomena to perform computation.',
  },
  {
    q: 'Is a QPU the same as a quantum computer?',
    a: 'Not exactly. A quantum computer is the full system: the QPU (quantum chip), the cryogenic cooling infrastructure (for superconducting systems), classical control electronics, and the software stack. The QPU is specifically the quantum processor — the chip where qubits are stored and quantum gates are applied.',
  },
  {
    q: 'How many qubits does a QPU need to be useful?',
    a: 'It depends on the application. Today\'s QPUs range from 5 to over 1,000 physical qubits, but the number of qubits is not the only metric. Gate fidelity, connectivity, and error rates determine actual computational capability. For near-term algorithms, effective performance is often measured in "algorithmic qubits" — the number of qubits that can participate in useful, error-limited computation.',
  },
  {
    q: 'What is the difference between physical qubits and logical qubits?',
    a: 'A physical qubit is the raw quantum two-level system (transmon, trapped ion, etc.) — it is noisy and error-prone. A logical qubit is an error-corrected virtual qubit encoded across many physical qubits using quantum error correction codes. A fault-tolerant quantum computer needs thousands of physical qubits per logical qubit. Today\'s systems operate at the physical qubit level.',
  },
  {
    q: 'Can a QPU replace a GPU for AI/ML workloads?',
    a: 'No — not in the foreseeable future. GPUs excel at massively parallel classical matrix operations, which is the foundation of modern machine learning. QPUs operate on fundamentally different computational principles and are not a replacement for GPU-based ML. Quantum computing may eventually accelerate specific ML subroutines (quantum linear algebra, sampling), but the comparison is not apples-to-apples.',
  },
  {
    q: 'What temperature does a QPU operate at?',
    a: 'Superconducting QPUs must be cooled to approximately 15 millikelvin (mK) — colder than outer space — using a dilution refrigerator. This is necessary to maintain superconductivity and reduce thermal noise that would destroy qubit coherence. Trapped-ion and neutral-atom systems can operate at room temperature for the ions themselves, though they still require sophisticated vacuum systems and laser equipment.',
  },
  {
    q: 'What programming languages are used to program a QPU?',
    a: 'Quantum circuits are typically written using domain-specific frameworks: Qiskit (Python, IBM), Cirq (Python, Google), PennyLane (Python, Xanadu), CUDA-Q (C++/Python, NVIDIA), and OpenQASM (assembly-level quantum IR). These compile quantum programs into gate sequences that run on the hardware.',
  },
  {
    q: 'What is quantum advantage?',
    a: 'Quantum advantage (sometimes called quantum supremacy for specific cases) refers to demonstrating that a quantum processor can solve a specific problem faster than any classical computer — or solve a problem that is intractable classically. Demonstrating quantum advantage for practically useful problems remains an open research challenge.',
  },
  {
    q: 'Can I access a QPU without buying one?',
    a: 'Yes. Multiple cloud providers offer QPU access: IBM Quantum Platform (IBM QPUs via Qiskit), Amazon Braket (IonQ, Rigetti, QuEra, IQM), Azure Quantum (IonQ, Quantinuum, Rigetti), and provider-direct cloud systems. Access is pay-per-shot or subscription-based. Some providers offer free tiers for research.',
  },
  {
    q: 'What is NISQ?',
    a: 'NISQ stands for Noisy Intermediate-Scale Quantum — a term coined by physicist John Preskill to describe today\'s quantum processors. NISQ devices have 50–1,000+ qubits but lack error correction, making them error-prone and limited in circuit depth. NISQ algorithms (VQE, QAOA) are designed to work within these constraints.',
  },
]

// ─── Architecture links ───────────────────────────────────────────────────────

const ARCH_LINKS = [
  { label: 'Superconducting', href: '/architectures/superconducting', color: 'text-blue-400', who: 'IBM, Google, Rigetti' },
  { label: 'Trapped Ion', href: '/architectures/trapped-ion', color: 'text-violet-400', who: 'IonQ, Quantinuum' },
  { label: 'Neutral Atom', href: '/architectures/neutral-atom', color: 'text-emerald-400', who: 'QuEra, Pasqal' },
  { label: 'Photonic', href: '/architectures/photonic', color: 'text-pink-400', who: 'PsiQuantum, Xanadu' },
  { label: 'Quantum Annealing', href: '/architectures/quantum-annealing', color: 'text-orange-400', who: 'D-Wave' },
  { label: 'Topological', href: '/architectures/topological', color: 'text-amber-400', who: 'Microsoft (research)' },
]

const MANUFACTURERS = [
  { name: 'IBM', arch: 'Superconducting', href: '/providers/ibm' },
  { name: 'IonQ', arch: 'Trapped Ion', href: '/providers/ionq' },
  { name: 'Quantinuum', arch: 'Trapped Ion', href: '/providers/quantinuum' },
  { name: 'Rigetti', arch: 'Superconducting', href: '/providers/rigetti' },
  { name: 'QuEra', arch: 'Neutral Atom', href: '/providers/quera' },
  { name: 'Pasqal', arch: 'Neutral Atom', href: '/providers/pasqal' },
  { name: 'IQM', arch: 'Superconducting', href: '/providers/iqm' },
  { name: 'D-Wave', arch: 'Annealing', href: '/providers/d-wave' },
]

// ─── FAQ JSON-LD ──────────────────────────────────────────────────────────────

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

// ─── ToC items ────────────────────────────────────────────────────────────────

const TOC = [
  { text: 'Definition', id: 'definition' },
  { text: 'How QPUs Work', id: 'how-qpus-work' },
  { text: 'Qubits', id: 'qubits' },
  { text: 'Quantum Gates', id: 'quantum-gates' },
  { text: 'Measurement', id: 'measurement' },
  { text: 'QPU Architectures', id: 'qpu-architectures' },
  { text: 'QPU vs CPU', id: 'qpu-vs-cpu' },
  { text: 'Current State', id: 'current-state' },
  { text: 'Manufacturers', id: 'manufacturers' },
  { text: 'How to Access a QPU', id: 'how-to-access' },
  { text: 'FAQ', id: 'faq' },
  { text: 'Key Terms', id: 'key-terms' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhatIsAQPUPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />

      <div className="min-h-screen bg-[var(--color-bg-base)]">
        {/* Top bar */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb
              items={[
                { label: 'QPU.co', href: '/' },
                { label: 'Learn', href: '/learn' },
                { label: 'What Is a QPU?' },
              ]}
            />
          </div>
        </div>

        {/* Two-column layout: main + sticky TOC */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-10 lg:gap-14">

            {/* ── Main content ─────────────────────────────────────────── */}
            <article className="min-w-0">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="accent" size="sm">Fundamentals</Badge>
                  <Badge variant="muted" size="sm">12 min read</Badge>
                </div>
                <h1 className="text-[var(--color-text-primary)] mb-3">
                  What Is a Quantum Processing Unit?
                </h1>
                <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-none">
                  A QPU (Quantum Processing Unit) is a specialized processor that exploits quantum
                  mechanical phenomena to perform computations. This guide explains how QPUs work,
                  how they differ from classical processors, and what the technology can — and
                  cannot — do today.
                </p>
              </header>

              <Separator className="mb-8" />

              {/* Diagram */}
              <QPUDiagram />

              {/* ── Definition ─────────────────────────────────────────── */}
              <section aria-labelledby="definition">
                <h2 id="definition" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  Definition
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  A <strong className="text-[var(--color-text-primary)]">Quantum Processing Unit (QPU)</strong> is
                  a specialized processor that exploits quantum mechanical phenomena — superposition,
                  entanglement, and interference — to perform computations. Unlike classical processors
                  that represent information as binary bits (0 or 1), QPUs use <em>qubits</em> that
                  can exist in superpositions of 0 and 1 simultaneously, enabling fundamentally
                  different computational approaches.
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  A QPU is not a replacement for a CPU or GPU. It is a specialized accelerator
                  designed for a specific class of problems — primarily those with quantum-native
                  structure, such as molecular simulation, certain optimization tasks, and
                  quantum cryptography. Most near-term quantum computations use QPUs alongside
                  classical processors in a hybrid architecture.
                </p>
              </section>

              {/* ── How QPUs Work ──────────────────────────────────────── */}
              <section aria-labelledby="how-qpus-work">
                <h2 id="how-qpus-work" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  How QPUs Work
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  Classical computers process information as bits — binary switches that are
                  deterministically 0 or 1. A QPU processes information as quantum bits (qubits)
                  that obey the laws of quantum mechanics. Three quantum phenomena make QPUs
                  computationally interesting:
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    {
                      term: 'Superposition',
                      def: 'A qubit can exist in a combination (superposition) of |0⟩ and |1⟩ simultaneously. Mathematically, the qubit state is α|0⟩ + β|1⟩, where α and β are complex probability amplitudes satisfying |α|² + |β|² = 1.',
                    },
                    {
                      term: 'Entanglement',
                      def: 'Multiple qubits can become entangled — their quantum states become correlated in ways that have no classical analogue. Measuring one qubit instantly determines information about its entangled partner, regardless of distance.',
                    },
                    {
                      term: 'Interference',
                      def: 'Quantum gates manipulate the probability amplitudes of qubit states, causing computational paths leading to wrong answers to destructively interfere (cancel out) while paths leading to correct answers constructively interfere (reinforce). This is what gives quantum algorithms their potential speedup.',
                    },
                  ].map((item) => (
                    <li key={item.term} className="flex gap-3">
                      <ChevronRight size={14} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-[var(--color-text-primary)] text-sm">{item.term}: </strong>
                        <span className="text-sm text-[var(--color-text-secondary)]">{item.def}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* ── Qubits ─────────────────────────────────────────── */}
                <h3 id="qubits" className="scroll-mt-20 text-base font-semibold text-[var(--color-text-primary)] mt-6 mb-3">
                  Qubits
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-none">
                  A qubit is any quantum two-level system that can be controlled with sufficient precision.
                  Physical implementations include: superconducting Josephson junction circuits (cooled to
                  ~15 mK), trapped atomic ions held in electromagnetic traps, neutral atoms
                  captured in optical tweezer arrays, photons encoding quantum information in
                  polarization or path, and semiconductor spin states. Each implementation has different
                  trade-offs in coherence time, gate speed, and scalability.
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  The qubit count alone is a poor measure of a QPU's computational power. A 10-qubit
                  system with high fidelity and long coherence may outperform a 1,000-qubit system
                  with poor error rates for practical algorithms. Metrics like <em>algorithmic qubits</em>,
                  <em> quantum volume</em>, and <em>CLOPS</em> attempt to capture overall system
                  performance more accurately.
                </p>

                {/* ── Quantum Gates ───────────────────────────────────── */}
                <h3 id="quantum-gates" className="scroll-mt-20 text-base font-semibold text-[var(--color-text-primary)] mt-6 mb-3">
                  Quantum Gates
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-none">
                  Quantum gates are the QPU's computational primitives — the quantum equivalent of
                  logic gates (AND, OR, NOT). Unlike classical logic gates, quantum gates are
                  reversible unitary operations: they rotate the qubit's state on the Bloch sphere
                  without destroying quantum information. Common gates include: the Hadamard gate (H)
                  — creates a superposition from a basis state; the CNOT gate — a two-qubit controlled
                  operation that creates entanglement; the T gate and rotation gates for precise phase
                  control; and native gates specific to each hardware platform (e.g., IBM's ECR gate,
                  IonQ's native Mølmer-Sørensen gate).
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-none">
                  Gate fidelity — how accurately a gate operation is implemented on real hardware — is
                  one of the most important hardware metrics. A two-qubit gate fidelity of 99.5% means
                  0.5% error per gate; errors accumulate with circuit depth, limiting how many
                  sequential operations a QPU can reliably perform.
                </p>

                {/* ── Measurement ─────────────────────────────────────── */}
                <h3 id="measurement" className="scroll-mt-20 text-base font-semibold text-[var(--color-text-primary)] mt-6 mb-3">
                  Measurement
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  Quantum measurement is the process of extracting classical information from a qubit.
                  When measured, a qubit in superposition α|0⟩ + β|1⟩ collapses to either 0 (with
                  probability |α|²) or 1 (with probability |β|²) — the superposition is destroyed.
                  This is why quantum circuits must be run many times ("shots") to build up
                  statistical estimates of the output probability distribution. Readout fidelity — how
                  accurately the measurement reflects the true qubit state — is a distinct error
                  source from gate fidelity.
                </p>
              </section>

              {/* ── Architectures ──────────────────────────────────────── */}
              <section aria-labelledby="qpu-architectures">
                <h2 id="qpu-architectures" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  QPU Architectures
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  All QPUs manipulate quantum states, but the physical medium used for qubits — and
                  the method of control — varies significantly across platforms:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {ARCH_LINKS.map((arch) => (
                    <Link
                      key={arch.href}
                      href={arch.href}
                      className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-overlay)] transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${arch.color.replace('text-', 'bg-')}`} />
                      <div>
                        <p className={`text-sm font-semibold ${arch.color}`}>{arch.label}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{arch.who}</p>
                      </div>
                      <ChevronRight size={13} className="ml-auto text-[var(--color-text-muted)] mt-1 shrink-0" />
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  See the full{' '}
                  <Link href="/architectures" className="text-[var(--color-accent)] hover:underline">
                    architecture comparison
                  </Link>{' '}
                  for detailed trade-offs.
                </p>
              </section>

              {/* ── QPU vs CPU ─────────────────────────────────────────── */}
              <section aria-labelledby="qpu-vs-cpu">
                <h2 id="qpu-vs-cpu" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  QPU vs CPU
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  A CPU (Central Processing Unit) is a general-purpose sequential processor optimized
                  for the workloads that make up the vast majority of computing: operating systems,
                  databases, web services, and business logic. CPUs are extremely fast (GHz clock
                  speeds), highly reliable, and can execute arbitrary programs.
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  A QPU is not a general-purpose processor. It is a specialized accelerator for a
                  specific class of problems with quantum-native structure. QPUs cannot run web
                  browsers, databases, or most software. They are designed to solve problems where
                  quantum parallelism — exploring exponentially many computational paths
                  simultaneously — provides a theoretical advantage.
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-none">
                  The key distinction: CPUs execute classical algorithms deterministically; QPUs
                  execute quantum circuits probabilistically, requiring multiple shots to build
                  up statistical estimates. For the foreseeable future, QPUs will be used
                  alongside CPUs, not instead of them.
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  For the GPU comparison, see{' '}
                  <Link href="/qpu-vs-gpu" className="text-[var(--color-accent)] hover:underline">
                    QPU vs GPU vs CPU →
                  </Link>
                </p>
              </section>

              {/* ── Current State ──────────────────────────────────────── */}
              <section aria-labelledby="current-state">
                <h2 id="current-state" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  Current State of QPU Technology
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  We are in the <strong className="text-[var(--color-text-primary)]">NISQ era</strong> —
                  Noisy Intermediate-Scale Quantum. Today's QPUs have 10–1,000+ physical qubits
                  and can execute quantum circuits of modest depth, but lack the error correction
                  needed for fault-tolerant computation. Key current limitations:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'Gate errors accumulate: circuit depth is limited before noise dominates results',
                    'No error correction: physical qubit errors are not corrected in real time (most systems)',
                    'Coherence times: qubits lose their quantum state after microseconds to milliseconds',
                    'Connectivity: most QPUs can only directly interact neighboring qubits, requiring SWAP overhead for non-adjacent operations',
                    'Queue times: cloud QPU access involves wait times of minutes to hours',
                    'Classical simulation: problems up to ~50 qubits can often be simulated classically, limiting verifiable advantage',
                  ].map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm text-[var(--color-text-secondary)]">
                      <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-warning)] shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-none">
                  Progress is real and accelerating. Two-qubit gate fidelities have improved from
                  ~90% to 99.5%+ over the past decade. Qubit counts are scaling. Error
                  correction demonstrations are moving from theory to laboratory results. The
                  roadmap toward fault-tolerant quantum computing is now an engineering challenge
                  rather than a pure research question — but meaningful scale is likely 5–15 years out.
                </p>
              </section>

              {/* ── Manufacturers ──────────────────────────────────────── */}
              <section aria-labelledby="manufacturers">
                <h2 id="manufacturers" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  Major QPU Manufacturers
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  The QPU hardware industry includes a mix of large technology companies, well-funded
                  startups, and national laboratory efforts. Major commercial QPU manufacturers:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                  {MANUFACTURERS.map((mfr) => (
                    <Link
                      key={mfr.href}
                      href={mfr.href}
                      className="p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-overlay)] transition-colors text-center"
                    >
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{mfr.name}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{mfr.arch}</p>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Full list:{' '}
                  <Link href="/providers" className="text-[var(--color-accent)] hover:underline">
                    QPU Provider Directory →
                  </Link>
                </p>
              </section>

              {/* ── How to Access ───────────────────────────────────────── */}
              <section aria-labelledby="how-to-access">
                <h2 id="how-to-access" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  How to Access a QPU
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  No one buys a QPU the way they buy a GPU. Access is primarily cloud-based:
                </p>
                <ul className="space-y-3 mb-4">
                  {[
                    {
                      name: 'IBM Quantum Platform',
                      desc: 'IBM QPUs via Qiskit. Free tier available. Best for superconducting circuit research.',
                      href: '/availability',
                    },
                    {
                      name: 'Amazon Braket',
                      desc: 'IonQ, Rigetti, QuEra, IQM. Pay-per-shot. Managed service, AWS integration.',
                      href: '/availability',
                    },
                    {
                      name: 'Azure Quantum',
                      desc: 'IonQ, Quantinuum, Rigetti. Credits for new users. Azure ecosystem integration.',
                      href: '/availability',
                    },
                    {
                      name: 'Provider Direct',
                      desc: 'IonQ Cloud, D-Wave Leap, Quantinuum Nexus offer direct API access to proprietary hardware.',
                      href: '/availability',
                    },
                  ].map((platform) => (
                    <li key={platform.name} className="flex gap-3">
                      <ChevronRight size={13} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                      <div>
                        <Link href={platform.href} className="text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors">
                          {platform.name}
                        </Link>
                        <p className="text-sm text-[var(--color-text-secondary)]">{platform.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Full cloud access guide:{' '}
                  <Link href="/availability" className="text-[var(--color-accent)] hover:underline">
                    QPU Availability & Cloud Access →
                  </Link>
                </p>
              </section>

              {/* ── FAQ ────────────────────────────────────────────────── */}
              <section aria-labelledby="faq">
                <h2 id="faq" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-6">
                  Frequently Asked Questions
                </h2>
                <dl className="space-y-6">
                  {FAQ_ITEMS.map((item) => (
                    <div key={item.q} className="border-l-2 border-[var(--color-border)] pl-4">
                      <dt className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                        {item.q}
                      </dt>
                      <dd className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {item.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* ── Key Terms ───────────────────────────────────────────── */}
              <section aria-labelledby="key-terms">
                <h2 id="key-terms" className="scroll-mt-20 text-xl font-semibold text-[var(--color-text-primary)] mt-10 mb-4">
                  Key Terms
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-none">
                  Quick reference for terms used throughout this guide. Full definitions in the{' '}
                  <Link href="/glossary" className="text-[var(--color-accent)] hover:underline">
                    Quantum Computing Glossary
                  </Link>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['QPU', 'Quantum Processing Unit — the quantum chip itself'],
                    ['Qubit', 'Quantum bit — the basic unit of quantum information'],
                    ['Gate fidelity', 'Accuracy of a quantum gate operation (0–100%)'],
                    ['Coherence time', 'How long a qubit maintains its quantum state'],
                    ['NISQ', 'Noisy Intermediate-Scale Quantum — era of today\'s QPUs'],
                    ['Quantum volume', 'IBM\'s composite QPU performance benchmark'],
                    ['CLOPS', 'Circuit Layer Operations Per Second — throughput metric'],
                    ['Transpilation', 'Mapping a quantum circuit to native hardware gates'],
                    ['Shot', 'One execution of a quantum circuit'],
                    ['Error correction', 'Encoding logical qubits to suppress physical errors'],
                  ].map(([term, def]) => (
                    <div
                      key={term}
                      className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-panel)] border border-[var(--color-border)]"
                    >
                      <p className="text-xs font-mono font-semibold text-[var(--color-accent)] mb-0.5">
                        {term}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{def}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer nav */}
              <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex gap-4 flex-wrap">
                <Link
                  href="/learn"
                  className="text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  ← Back to Learn
                </Link>
                <Link
                  href="/qpu-vs-gpu"
                  className="text-sm font-mono text-[var(--color-accent)] hover:opacity-80 transition-opacity"
                >
                  QPU vs GPU vs CPU →
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
                <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
                  <p className="text-[11px] text-[var(--color-text-muted)] mb-2 font-mono uppercase tracking-wider">Next</p>
                  <Link
                    href="/qpu-vs-gpu"
                    className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:opacity-80 transition-opacity"
                  >
                    QPU vs GPU vs CPU
                    <ChevronRight size={11} />
                  </Link>
                  <Link
                    href="/glossary"
                    className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:opacity-80 transition-opacity mt-1.5"
                  >
                    Glossary
                    <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
