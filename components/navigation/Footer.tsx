'use client'

import Link from 'next/link'
import Logo from './Logo'

const footerColumns = [
  {
    heading: 'QPUs',
    links: [
      { href: '/qpus', label: 'All QPUs' },
      { href: '/compare', label: 'Compare' },
      { href: '/benchmarks', label: 'Benchmarks' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/availability', label: 'Availability' },
    ],
  },
  {
    heading: 'Technology',
    links: [
      { href: '/architectures', label: 'Architectures' },
      { href: '/learn', label: 'Quantum Concepts' },
      { href: '/intelligence/roadmaps', label: 'Hardware Roadmaps' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { href: '/developers', label: 'Overview' },
      { href: '/developers/api', label: 'API' },
      { href: '/frameworks', label: 'Frameworks' },
      { href: '/developers/examples', label: 'Code Examples' },
    ],
  },
  {
    heading: 'Use Cases',
    links: [
      { href: '/use-cases/chemistry', label: 'Chemistry' },
      { href: '/use-cases/optimization', label: 'Optimization' },
      { href: '/use-cases/finance', label: 'Finance' },
      { href: '/use-cases/machine-learning', label: 'Machine Learning' },
      { href: '/use-cases', label: 'More use cases →' },
    ],
  },
  {
    heading: 'Intelligence',
    links: [
      { href: '/intelligence/news', label: 'News' },
      { href: '/intelligence/research', label: 'Research' },
      { href: '/companies', label: 'Companies' },
      { href: '/intelligence/jobs', label: 'Jobs' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/methodology', label: 'Methodology' },
      { href: '/data-sources', label: 'Data Sources' },
      { href: '/contact', label: 'Contact' },
      { href: '/partner', label: 'Partner' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-bg-raised)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14">
        {/* Top: Logo + tagline */}
        <div className="mb-10">
          <Logo size="md" />
          <p
            className="mt-3 text-sm max-w-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Independent quantum-computing hardware intelligence and discovery.
          </p>
        </div>

        {/* 6-column link grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {footerColumns.map(col => (
            <div key={col.heading}>
              <p
                className="font-mono text-[11px] tracking-widest uppercase mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ borderTop: '1px solid var(--color-border)' }}
        className="max-w-7xl mx-auto px-4 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p
          className="text-xs text-center sm:text-left"
          style={{ color: 'var(--color-text-muted)' }}
        >
          &copy; 2026 QPU.co &mdash; Independent quantum computing hardware intelligence.
        </p>
        <div className="flex items-center gap-4">
          {(['Privacy', 'Terms', 'Data Sources'] as const).map(label => {
            const href =
              label === 'Privacy'
                ? '/privacy'
                : label === 'Terms'
                  ? '/terms'
                  : '/data-sources'
            return (
              <Link
                key={label}
                href={href}
                className="text-xs transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
