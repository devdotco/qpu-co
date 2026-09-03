import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const exploreLinks = [
  { href: '/qpus', label: 'All QPUs', desc: 'Browse available and announced quantum processors' },
  { href: '/compare', label: 'Compare QPUs', desc: 'Compare architectures and specs side by side' },
  { href: '/benchmarks', label: 'Benchmarks', desc: 'Published QPU performance metrics' },
  { href: '/pricing', label: 'Pricing', desc: 'Compare public access costs' },
  { href: '/availability', label: 'Availability', desc: 'Access methods and current availability' },
]

const architectureLinks = [
  { href: '/architectures/superconducting', label: 'Superconducting', color: 'var(--color-arch-superconducting)' },
  { href: '/architectures/trapped-ion', label: 'Trapped Ion', color: 'var(--color-arch-trapped-ion)' },
  { href: '/architectures/neutral-atom', label: 'Neutral Atom', color: 'var(--color-arch-neutral-atom)' },
  { href: '/architectures/photonic', label: 'Photonic', color: 'var(--color-arch-photonic)' },
  { href: '/architectures/quantum-annealing', label: 'Quantum Annealing', color: 'var(--color-arch-annealing)' },
  { href: '/architectures/topological', label: 'Topological', color: 'var(--color-arch-topological)' },
]

const providers = [
  { href: '/providers/ionq', label: 'IonQ' },
  { href: '/providers/ibm-quantum', label: 'IBM Quantum' },
  { href: '/providers/rigetti', label: 'Rigetti' },
  { href: '/providers/quantinuum', label: 'Quantinuum' },
  { href: '/providers/iqm', label: 'IQM' },
  { href: '/providers/quera', label: 'QuEra' },
  { href: '/providers/pasqal', label: 'Pasqal' },
  { href: '/providers/d-wave', label: 'D-Wave' },
  { href: '/providers/aqt', label: 'AQT' },
]

// Tiny animated quantum circuit SVG
function CircuitSVG() {
  return (
    <svg
      width="80"
      height="64"
      viewBox="0 0 80 64"
      fill="none"
      aria-hidden="true"
      className="mb-3 opacity-80"
    >
      {/* Lines */}
      <line x1="4" y1="16" x2="76" y2="16" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
      <line x1="4" y1="32" x2="76" y2="32" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
      <line x1="4" y1="48" x2="76" y2="48" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
      {/* Gate boxes */}
      <rect x="16" y="10" width="12" height="12" rx="2" stroke="rgba(34,211,238,0.5)" strokeWidth="1" fill="rgba(34,211,238,0.06)" />
      <text x="22" y="20" textAnchor="middle" fill="rgba(34,211,238,0.7)" fontSize="7" fontFamily="monospace">H</text>
      <rect x="36" y="26" width="12" height="12" rx="2" stroke="rgba(34,211,238,0.5)" strokeWidth="1" fill="rgba(34,211,238,0.06)" />
      <text x="42" y="36" textAnchor="middle" fill="rgba(34,211,238,0.7)" fontSize="7" fontFamily="monospace">X</text>
      <rect x="56" y="10" width="12" height="12" rx="2" stroke="rgba(34,211,238,0.5)" strokeWidth="1" fill="rgba(34,211,238,0.06)" />
      <text x="62" y="20" textAnchor="middle" fill="rgba(34,211,238,0.7)" fontSize="6" fontFamily="monospace">RZ</text>
      {/* CNOT control */}
      <circle cx="42" cy="16" r="3" fill="rgba(34,211,238,0.6)" />
      <line x1="42" y1="19" x2="42" y2="26" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
      {/* Nodes */}
      <circle cx="4" cy="16" r="2.5" fill="rgba(34,211,238,0.4)" />
      <circle cx="4" cy="32" r="2.5" fill="rgba(34,211,238,0.4)" />
      <circle cx="4" cy="48" r="2.5" fill="rgba(34,211,238,0.4)" />
      {/* Animated traveling dot */}
      <circle r="2.5" fill="var(--color-accent)" opacity="0.9">
        <animateMotion
          dur="2.4s"
          repeatCount="indefinite"
          path="M 4,48 L 76,48"
        />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default function QPUsMegaMenu() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-x-8 px-8 py-7">
      {/* Column 1: Explore */}
      <div>
        <p className="mono-label mb-3">Explore</p>
        <ul className="space-y-1">
          {exploreLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group block rounded-[var(--radius-md)] px-2 py-2 -mx-2 hover:bg-[var(--color-bg-panel)] transition-colors"
              >
                <span className="block text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  {link.label}
                </span>
                <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                  {link.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: By Architecture */}
      <div>
        <p className="mono-label mb-3">By Architecture</p>
        <ul className="space-y-1">
          {architectureLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 -mx-2 hover:bg-[var(--color-bg-panel)] transition-colors group"
              >
                <span
                  className="flex-shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: link.color }}
                />
                <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3: Providers */}
      <div>
        <p className="mono-label mb-3">Providers</p>
        <ul className="space-y-1 mb-4">
          {providers.map(p => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1 -mx-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-panel)]"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/providers"
          className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          All providers <ArrowRight size={10} />
        </Link>
      </div>

      {/* Featured panel */}
      <div className="border-l border-[var(--color-border)] pl-8">
        <CircuitSVG />
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
          Find the right processor
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Compare QPUs based on architecture, qubits, connectivity, performance, and workload.
        </p>
        <Link
          href="/qpus"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline"
        >
          Explore QPUs <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
