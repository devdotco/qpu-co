import Link from 'next/link'
import { ArrowRight, Code2, Globe } from 'lucide-react'

const buildLinks = [
  { href: '/developers', label: 'Developer Overview' },
  { href: '/api', label: 'API' },
  { href: '/frameworks', label: 'SDKs & Frameworks' },
  { href: '/developers', label: 'Code Examples' },
  { href: 'https://github.com/devdotco/qpu-co', label: 'GitHub', external: true },
]

const frameworkLinks = [
  { href: '/frameworks/qiskit', label: 'Qiskit' },
  { href: '/frameworks/cirq', label: 'Cirq' },
  { href: '/frameworks/cuda-q', label: 'CUDA-Q' },
  { href: '/frameworks/pennylane', label: 'PennyLane' },
  { href: '/frameworks/q-sharp', label: 'Q#' },
  { href: '/frameworks/amazon-braket-sdk', label: 'Braket SDK' },
]

const toolLinks = [
  { href: '/qpu-advisor', label: 'QPU Advisor' },
  { href: '/compare', label: 'Compare QPUs' },
  { href: '/benchmarks', label: 'Benchmark Explorer' },
  { href: '/architectures', label: 'Architecture Finder' },
]

function TerminalMockup() {
  return (
    <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-base)] mb-3">
      {/* Terminal title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-overlay)]">
        <span className="w-2 h-2 rounded-full bg-red-500/70" />
        <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <span className="w-2 h-2 rounded-full bg-green-500/70" />
      </div>
      {/* Terminal content */}
      <pre className="px-3 py-3 text-[11px] leading-relaxed font-mono">
        <span style={{ color: 'var(--color-accent)' }}>$</span>
        <span style={{ color: 'var(--color-text-secondary)' }}> qpu recommend workload.json</span>
        {'\n'}
        {'\n'}
        <span style={{ color: 'var(--color-text-muted)' }}>  Architecture: </span>
        <span style={{ color: 'var(--color-arch-trapped-ion)' }}>Trapped Ion</span>
        {'\n'}
        <span style={{ color: 'var(--color-text-muted)' }}>  Candidates:   </span>
        <span style={{ color: 'var(--color-text-primary)' }}>4</span>
        {'\n'}
        <span style={{ color: 'var(--color-text-muted)' }}>  Confidence:   </span>
        <span style={{ color: 'var(--color-success)' }}>87%</span>
      </pre>
    </div>
  )
}

export default function DevelopersMegaMenu() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-x-8 px-8 py-7">
      {/* Column 1: Build */}
      <div>
        <p className="mono-label mb-3">Build</p>
        <ul className="space-y-1">
          {buildLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1 -mx-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-panel)] group"
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
                {link.external && (
                  <Globe size={11} className="opacity-40 group-hover:opacity-60" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: Frameworks */}
      <div>
        <p className="mono-label mb-3">Frameworks</p>
        <ul className="space-y-1">
          {frameworkLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1 -mx-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-panel)]"
              >
                <Code2 size={12} className="text-[var(--color-text-muted)]" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3: Tools */}
      <div>
        <p className="mono-label mb-3">Tools</p>
        <ul className="space-y-1">
          {toolLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1 -mx-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-panel)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured panel */}
      <div className="border-l border-[var(--color-border)] pl-8">
        <TerminalMockup />
        <p className="mono-label mb-2">Product concept</p>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
          QPU Advisor CLI
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Submit your workload description and get an architecture recommendation in seconds.
        </p>
        <Link
          href="/qpu-advisor"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline"
        >
          Try QPU Advisor <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
