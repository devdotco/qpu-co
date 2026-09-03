import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { getFrameworks } from '@/lib/data'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import type { ArchitectureType } from '@/types'

export const metadata: Metadata = {
  title: 'Quantum Frameworks — QPU.co',
  description:
    'Compare quantum computing frameworks: Qiskit, Cirq, CUDA-Q, PennyLane, Q#, and Amazon Braket SDK. Find the right SDK for your hardware target and workload.',
}

const FRAMEWORK_ICONS: Record<string, string> = {
  qiskit: 'Q',
  cirq: 'C',
  'cuda-q': 'N',
  pennylane: 'P',
  'q-sharp': '#',
  'amazon-braket-sdk': 'B',
}

const FRAMEWORK_COLORS: Record<string, string> = {
  qiskit: 'var(--color-arch-superconducting)',
  cirq: 'var(--color-arch-neutral-atom)',
  'cuda-q': '#76B900',
  pennylane: 'var(--color-arch-photonic)',
  'q-sharp': 'var(--color-arch-trapped-ion)',
  'amazon-braket-sdk': 'var(--color-arch-annealing)',
}

export default async function FrameworksPage() {
  const frameworks = await getFrameworks()

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">

      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)] grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <p className="eyebrow mb-3">Frameworks</p>
          <h1 className="text-[var(--color-text-primary)] mb-4">
            Quantum SDK Reference
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-2xl">
            The major quantum software frameworks — their hardware targets, languages, cloud backends,
            and use-case fit. Pick the right SDK before you write a line of code.
          </p>
        </div>
      </section>

      {/* Framework grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {frameworks.map((fw) => {
            const accent = FRAMEWORK_COLORS[fw.slug] ?? 'var(--color-accent)'
            const icon = FRAMEWORK_ICONS[fw.slug] ?? fw.name[0]
            return (
              <div
                key={fw.id}
                className="panel rounded-[var(--radius-lg)] p-6 flex flex-col gap-4 hover:border-[rgba(255,255,255,0.12)] transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-sm font-bold font-mono shrink-0"
                      style={{
                        background: `${accent}18`,
                        color: accent,
                        border: `1px solid ${accent}30`,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <Link href={`/frameworks/${fw.slug}`} className="text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors leading-tight">
                        {fw.name}
                      </Link>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        by {fw.maintainer}
                      </p>
                    </div>
                  </div>
                  <span className="mono-label shrink-0">{fw.version}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 flex-1">
                  {fw.description}
                </p>

                {/* Languages */}
                <div className="flex flex-wrap gap-1.5">
                  {fw.language.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Supported architectures */}
                <div className="flex flex-wrap gap-1.5">
                  {fw.supportedArchitectures.slice(0, 4).map((arch) => (
                    <ArchitectureBadge key={arch} architecture={arch as ArchitectureType} size="sm" />
                  ))}
                  {fw.supportedArchitectures.length > 4 && (
                    <span className="text-[11px] text-[var(--color-text-muted)] self-center">
                      +{fw.supportedArchitectures.length - 4} more
                    </span>
                  )}
                </div>

                {/* Links row */}
                <div className="flex items-center gap-4 pt-1 border-t border-[var(--color-border)]">
                  {fw.githubUrl && (
                    <a
                      href={fw.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                    >
                      <ExternalLink size={12} />
                      GitHub
                    </a>
                  )}
                  {fw.docsUrl && (
                    <a
                      href={fw.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                    >
                      <ExternalLink size={12} />
                      Docs
                    </a>
                  )}
                  <Link href={`/frameworks/${fw.slug}`} className="ml-auto text-xs font-mono text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="panel rounded-[var(--radius-lg)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Framework Comparison
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Framework</th>
                  <th>Maintainer</th>
                  <th>Languages</th>
                  <th>Cloud Platforms</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                {frameworks.map((fw) => (
                  <tr key={fw.id}>
                    <td>
                      <Link
                        href={`/frameworks/${fw.slug}`}
                        className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        {fw.name}
                      </Link>
                    </td>
                    <td className="text-[var(--color-text-secondary)]">{fw.maintainer}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {fw.language.map((l) => (
                          <span key={l} className="mono-label">{l}</span>
                        ))}
                      </div>
                    </td>
                    <td className="text-[var(--color-text-secondary)] text-xs">
                      {fw.cloudPlatforms.length > 0
                        ? fw.cloudPlatforms.join(', ')
                        : '—'}
                    </td>
                    <td className="text-[var(--color-text-muted)] text-xs max-w-[200px]">
                      {fw.slug === 'qiskit' && 'IBM Quantum hardware, circuit compilation'}
                      {fw.slug === 'cirq' && 'Google hardware, NISQ research, fine gate control'}
                      {fw.slug === 'cuda-q' && 'GPU-accelerated simulation, hybrid workloads'}
                      {fw.slug === 'pennylane' && 'QML, variational algorithms, autograd circuits'}
                      {fw.slug === 'q-sharp' && 'Azure Quantum, fault-tolerant algorithm design'}
                      {fw.slug === 'amazon-braket-sdk' && 'Multi-provider access, managed notebooks'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  )
}
