import Link from 'next/link'
import { ArrowRight, FlaskConical, Atom, TrendingUp, Brain, Pill, Truck, Lock, BarChart3 } from 'lucide-react'

interface ArchDot {
  color: string
  label: string
}

interface UseCase {
  href: string
  icon: React.ElementType
  name: string
  desc: string
  archs: ArchDot[]
}

const archDots: Record<string, ArchDot> = {
  sc: { color: 'var(--color-arch-superconducting)', label: 'Superconducting' },
  ti: { color: 'var(--color-arch-trapped-ion)', label: 'Trapped Ion' },
  na: { color: 'var(--color-arch-neutral-atom)', label: 'Neutral Atom' },
  ph: { color: 'var(--color-arch-photonic)', label: 'Photonic' },
  an: { color: 'var(--color-arch-annealing)', label: 'Annealing' },
  tp: { color: 'var(--color-arch-topological)', label: 'Topological' },
}

const useCases: UseCase[] = [
  {
    href: '/use-cases/chemistry',
    icon: FlaskConical,
    name: 'Chemistry',
    desc: 'Molecular simulation at quantum scale',
    archs: [archDots.sc, archDots.ti, archDots.na],
  },
  {
    href: '/use-cases/materials-science',
    icon: Atom,
    name: 'Materials Science',
    desc: 'Novel material property prediction',
    archs: [archDots.sc, archDots.ti],
  },
  {
    href: '/use-cases/optimization',
    icon: TrendingUp,
    name: 'Optimization',
    desc: 'Combinatorial and logistics problems',
    archs: [archDots.an, archDots.na, archDots.sc],
  },
  {
    href: '/use-cases/finance',
    icon: BarChart3,
    name: 'Finance',
    desc: 'Portfolio and risk optimization',
    archs: [archDots.sc, archDots.an],
  },
  {
    href: '/use-cases/machine-learning',
    icon: Brain,
    name: 'Machine Learning',
    desc: 'Quantum-enhanced ML models',
    archs: [archDots.sc, archDots.ph],
  },
  {
    href: '/use-cases/drug-discovery',
    icon: Pill,
    name: 'Drug Discovery',
    desc: 'Protein folding and binding',
    archs: [archDots.ti, archDots.sc],
  },
  {
    href: '/use-cases/logistics',
    icon: Truck,
    name: 'Logistics',
    desc: 'Routing and supply chain optimization',
    archs: [archDots.an, archDots.sc],
  },
  {
    href: '/use-cases/cryptography',
    icon: Lock,
    name: 'Cryptography',
    desc: 'Post-quantum security research',
    archs: [archDots.sc, archDots.tp, archDots.ti],
  },
]

export default function UseCasesMegaMenu() {
  return (
    <div className="px-8 py-7">
      {/* 4x2 grid of use-case cards */}
      <div className="grid grid-cols-4 gap-3 mb-7">
        {useCases.map(uc => {
          const Icon = uc.icon
          return (
            <Link
              key={uc.href}
              href={uc.href}
              className="group flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-panel)] transition-all"
            >
              <div className="flex items-center gap-2">
                <Icon
                  size={14}
                  className="flex-shrink-0 text-[var(--color-accent)] opacity-80"
                />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {uc.name}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-snug">
                {uc.desc}
              </p>
              {/* Architecture compatibility dots */}
              <div className="flex items-center gap-1 mt-auto pt-1">
                {uc.archs.map((a, i) => (
                  <span
                    key={i}
                    title={a.label}
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                ))}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Featured strip */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            What are you trying to compute?
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Tell us your workload and we'll recommend the right QPU architecture.
          </p>
        </div>
        <Link
          href="/qpu-advisor"
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-muted)] transition-colors"
        >
          Ask QPU Advisor <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
