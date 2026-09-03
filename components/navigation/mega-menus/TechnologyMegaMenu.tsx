import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const architectureLinks = [
  { href: '/architectures/superconducting', label: 'Superconducting', color: 'var(--color-arch-superconducting)' },
  { href: '/architectures/trapped-ion', label: 'Trapped Ion', color: 'var(--color-arch-trapped-ion)' },
  { href: '/architectures/neutral-atom', label: 'Neutral Atom', color: 'var(--color-arch-neutral-atom)' },
  { href: '/architectures/photonic', label: 'Photonic', color: 'var(--color-arch-photonic)' },
  { href: '/architectures/quantum-annealing', label: 'Quantum Annealing', color: 'var(--color-arch-annealing)' },
  { href: '/architectures/topological', label: 'Topological', color: 'var(--color-arch-topological)' },
]

const conceptLinks = [
  { href: '/learn/qubits', label: 'Qubits' },
  { href: '/learn/gates', label: 'Gates' },
  { href: '/learn/entanglement', label: 'Entanglement' },
  { href: '/learn/coherence', label: 'Coherence' },
  { href: '/learn/error-correction', label: 'Error Correction' },
  { href: '/learn/logical-qubits', label: 'Logical Qubits' },
]

const hardwareLinks = [
  { href: '/technology/control-systems', label: 'Control Systems' },
  { href: '/technology/cryogenics', label: 'Cryogenics' },
  { href: '/technology/lasers', label: 'Lasers' },
  { href: '/technology/readout', label: 'Readout' },
  { href: '/technology/quantum-networking', label: 'Quantum Networking' },
]

// SVG: 6 architecture types radiating from center
function ArchRadialSVG() {
  const archColors = [
    'var(--color-arch-superconducting)',
    'var(--color-arch-trapped-ion)',
    'var(--color-arch-neutral-atom)',
    'var(--color-arch-photonic)',
    'var(--color-arch-annealing)',
    'var(--color-arch-topological)',
  ]
  const cx = 40
  const cy = 36
  const r = 26
  const dots = archColors.map((color, i) => {
    const angle = (i / 6) * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      color,
    }
  })

  return (
    <svg
      width="80"
      height="72"
      viewBox="0 0 80 72"
      fill="none"
      aria-hidden="true"
      className="mb-3 opacity-90"
    >
      {/* Spokes */}
      {dots.map((d, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={d.x}
          y2={d.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Center node */}
      <circle cx={cx} cy={cy} r="5" fill="rgba(34,211,238,0.15)" stroke="var(--color-accent)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="2" fill="var(--color-accent)" />
      {/* Architecture dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="4" fill={d.color} opacity="0.85" />
      ))}
    </svg>
  )
}

export default function TechnologyMegaMenu() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-x-8 px-8 py-7">
      {/* Column 1: Architectures */}
      <div>
        <p className="mono-label mb-3">Architectures</p>
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

      {/* Column 2: Quantum Concepts */}
      <div>
        <p className="mono-label mb-3">Quantum Concepts</p>
        <ul className="space-y-1">
          {conceptLinks.map(link => (
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

      {/* Column 3: Hardware */}
      <div>
        <p className="mono-label mb-3">Hardware</p>
        <ul className="space-y-1">
          {hardwareLinks.map(link => (
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
        <ArchRadialSVG />
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
          Understand QPU Architecture
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Six distinct qubit modalities — each with different scaling, fidelity, and connectivity characteristics.
        </p>
        <Link
          href="/architectures"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline"
        >
          Explore architectures <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
