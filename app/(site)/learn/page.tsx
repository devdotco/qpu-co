import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  Cpu,
  Code2,
  ArrowRight,
  CheckCircle,
  Circle,
} from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Learn Quantum Computing — QPU.co',
  description:
    'Structured guides to quantum computing fundamentals, QPU hardware, programming frameworks, and real-world applications.',
}

// ─── Track definitions ─────────────────────────────────────────────────────

interface TrackItem {
  title: string
  href: string
  readTime: string
  available?: boolean
}

interface Track {
  number: string
  title: string
  icon: React.ReactNode
  description: string
  color: string
  items: TrackItem[]
}

const TRACKS: Track[] = [
  {
    number: '01',
    title: 'Quantum Fundamentals',
    icon: <BookOpen size={18} />,
    description:
      'Core concepts — from what a qubit is to the difference between quantum and classical computation.',
    color: 'text-[var(--color-accent)]',
    items: [
      { title: 'What is a QPU?', href: '/what-is-a-qpu', readTime: '12 min', available: true },
      { title: 'Quantum Computing Overview', href: '/quantum-computing', readTime: '10 min' },
      { title: 'What is a Qubit?', href: '/qubit', readTime: '8 min' },
      { title: 'Quantum Gates', href: '/quantum-gates', readTime: '10 min' },
      { title: 'Quantum Error Correction', href: '/quantum-error-correction', readTime: '14 min' },
      { title: 'QPU vs GPU vs CPU', href: '/qpu-vs-gpu', readTime: '9 min', available: true },
      { title: 'Glossary', href: '/glossary', readTime: 'Reference', available: true },
    ],
  },
  {
    number: '02',
    title: 'Hardware & Architecture',
    icon: <Cpu size={18} />,
    description:
      'How different qubit technologies work, what trade-offs they make, and how to read QPU specifications.',
    color: 'text-violet-400',
    items: [
      { title: 'Quantum Architectures Overview', href: '/architectures', readTime: '11 min' },
      { title: 'Superconducting Qubits', href: '/architectures/superconducting', readTime: '12 min' },
      { title: 'Trapped Ion', href: '/architectures/trapped-ion', readTime: '11 min' },
      { title: 'Neutral Atom', href: '/architectures/neutral-atom', readTime: '10 min' },
      { title: 'Photonic', href: '/architectures/photonic', readTime: '9 min' },
      { title: 'Quantum Annealing', href: '/architectures/quantum-annealing', readTime: '8 min' },
      { title: 'QPU Benchmarks Explained', href: '/benchmarks', readTime: '13 min' },
    ],
  },
  {
    number: '03',
    title: 'Programming & Access',
    icon: <Code2 size={18} />,
    description:
      'Write and run quantum circuits using the major frameworks, and access QPU hardware from the cloud.',
    color: 'text-emerald-400',
    items: [
      { title: 'Developer Overview', href: '/developers', readTime: '7 min' },
      { title: 'Qiskit', href: '/frameworks/qiskit', readTime: '15 min' },
      { title: 'Cirq', href: '/frameworks/cirq', readTime: '12 min' },
      { title: 'CUDA-Q', href: '/frameworks/cuda-q', readTime: '10 min' },
      { title: 'PennyLane', href: '/frameworks/pennylane', readTime: '11 min' },
      { title: 'Cloud Access Guide', href: '/availability', readTime: '9 min' },
      { title: 'QPU Advisor', href: '/qpu-advisor', readTime: 'Interactive' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="mb-4">
            <Breadcrumb
              items={[{ label: 'QPU.co', href: '/' }, { label: 'Learn' }]}
            />
          </div>
          <p className="eyebrow mb-3">Learning Tracks</p>
          <h1 className="text-[var(--color-text-primary)] mb-4">
            Learn Quantum Computing
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-2xl max-w-none">
            From fundamentals to hardware programming — structured learning tracks for
            researchers, engineers, and curious minds.
          </p>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            No account required. Explore at your own pace.
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {TRACKS.map((track) => (
          <TrackCard key={track.number} track={track} />
        ))}

        {/* Coming soon note */}
        <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 bg-[var(--color-bg-raised)]">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
            More guides coming soon
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            QPU.co is actively building out guides for all three tracks. Start with the available
            pages and bookmark the rest — they're being added continuously.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/what-is-a-qpu"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-[var(--color-accent)] hover:opacity-80 transition-opacity"
            >
              Start with &ldquo;What Is a QPU?&rdquo;
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Track Card ───────────────────────────────────────────────────────────────

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="border border-[var(--color-border)] rounded-[var(--radius-xl)] bg-[var(--color-bg-panel)] overflow-hidden">
      {/* Track header */}
      <div className="px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-bg-panel)] border border-[var(--color-border)] flex items-center justify-center">
            <span className={track.color}>{track.icon}</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-[var(--color-text-muted)] tracking-widest uppercase">
                Track {track.number}
              </span>
            </div>
            <h2 className={`text-lg font-semibold mb-1 ${track.color.replace('text-', 'text-[var(--color-text-primary)]')} text-[var(--color-text-primary)]`}>
              {track.title}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {track.description}
            </p>
          </div>
        </div>
      </div>

      {/* Track items */}
      <div className="divide-y divide-[var(--color-border-subtle)]">
        {track.items.map((item, i) => (
          <TrackItem key={item.href} item={item} index={i} accentColor={track.color} />
        ))}
      </div>
    </div>
  )
}

function TrackItem({
  item,
  index,
  accentColor,
}: {
  item: TrackItem
  index: number
  accentColor: string
}) {
  const isAvailable = item.available === true
  const content = (
    <div className="flex items-center gap-4 px-6 py-3.5">
      {/* Step number / check icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isAvailable ? (
          <CheckCircle size={16} className={accentColor} />
        ) : (
          <Circle size={16} className="text-[var(--color-text-faint)]" />
        )}
      </div>

      {/* Step number */}
      <span className="font-mono text-[11px] text-[var(--color-text-muted)] w-5 text-right shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Title */}
      <span
        className={`flex-1 text-sm font-medium ${
          isAvailable
            ? 'text-[var(--color-text-primary)]'
            : 'text-[var(--color-text-muted)]'
        }`}
      >
        {item.title}
      </span>

      {/* Read time + arrow */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-[var(--color-text-muted)] hidden sm:block">
          {item.readTime}
        </span>
        {isAvailable && (
          <ArrowRight size={13} className={accentColor} />
        )}
      </div>
    </div>
  )

  if (isAvailable) {
    return (
      <Link
        href={item.href}
        className="block hover:bg-[var(--color-bg-overlay)] transition-colors group"
        aria-label={`${item.title} — ${item.readTime}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className="opacity-50 cursor-not-allowed"
      title="Coming soon"
      aria-disabled="true"
    >
      {content}
    </div>
  )
}
