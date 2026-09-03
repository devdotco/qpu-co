import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const col1Links = [
  { href: '/intelligence/news', label: 'Latest News', desc: 'Hardware and industry news' },
  { href: '/intelligence/research', label: 'Research', desc: 'Academic and applied research' },
  { href: '/intelligence/launches', label: 'Processor Launches', desc: 'New QPU announcements' },
  { href: '/companies', label: 'Company Directory', desc: 'Hardware, software, and cloud companies' },
  { href: '/intelligence/roadmaps', label: 'Hardware Roadmaps', desc: "Provider roadmaps and targets" },
]

const col2Links = [
  { href: '/intelligence/funding', label: 'Quantum Funding', desc: 'Investment rounds and grants' },
  { href: '/intelligence/jobs', label: 'Jobs', desc: 'Quantum computing positions' },
  { href: '/intelligence/policy', label: 'Policy', desc: 'Government and standards' },
]

export default function IntelligenceMegaMenu() {
  return (
    <div className="grid grid-cols-[1fr_1fr_280px] gap-x-8 px-8 py-7">
      {/* Column 1 */}
      <div>
        <p className="mono-label mb-3">Track</p>
        <ul className="space-y-1">
          {col1Links.map(link => (
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

      {/* Column 2 */}
      <div>
        <p className="mono-label mb-3">Discover</p>
        <ul className="space-y-1">
          {col2Links.map(link => (
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

      {/* Featured panel */}
      <div className="border-l border-[var(--color-border)] pl-8">
        {/* Pulse indicator graphic */}
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
          </span>
          <span className="text-xs font-mono text-[var(--color-accent)]">LIVE</span>
        </div>

        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          QPU Intelligence
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Track hardware releases, performance changes, company moves, and availability updates across all major quantum platforms.
        </p>
        <Link
          href="/intelligence"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline"
        >
          Explore Intelligence <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
