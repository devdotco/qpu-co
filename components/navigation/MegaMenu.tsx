'use client'

import { AnimatePresence, motion } from 'framer-motion'
import QPUsMegaMenu from './mega-menus/QPUsMegaMenu'
import TechnologyMegaMenu from './mega-menus/TechnologyMegaMenu'
import UseCasesMegaMenu from './mega-menus/UseCasesMegaMenu'
import DevelopersMegaMenu from './mega-menus/DevelopersMegaMenu'
import IntelligenceMegaMenu from './mega-menus/IntelligenceMegaMenu'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type MenuId = 'qpus' | 'technology' | 'use-cases' | 'developers' | 'intelligence' | 'resources' | null

interface MegaMenuProps {
  activeMenu: MenuId
  headerHeight?: number
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const menuComponents: Record<Exclude<MenuId, null>, React.ReactNode> = {
  qpus: <QPUsMegaMenu />,
  technology: <TechnologyMegaMenu />,
  'use-cases': <UseCasesMegaMenu />,
  developers: <DevelopersMegaMenu />,
  intelligence: <IntelligenceMegaMenu />,
  resources: <ResourcesMenu />,
}

function ResourcesMenu() {
  const links = [
    { href: '/learn', label: 'Learn' },
    { href: '/learn/what-is-a-qpu', label: 'What is a QPU?' },
    { href: '/learn/qpu-vs-gpu', label: 'QPU vs GPU' },
    { href: '/learn/quantum-computing-guide', label: 'Quantum Computing Guide' },
    { href: '/glossary', label: 'Glossary' },
    { href: '/data-sources', label: 'Data Sources' },
    { href: '/methodology', label: 'Methodology' },
  ]

  return (
    <div className="px-8 py-7">
      <div className="flex items-start gap-16">
        <div>
          <p className="mono-label mb-3">Resources</p>
          <ul className="grid grid-cols-2 gap-x-12 gap-y-1">
            {links.map(link => (
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
        <div className="border-l border-[var(--color-border)] pl-8 max-w-xs">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
            Independent and transparent
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
            QPU.co data is sourced from manufacturer publications, peer-reviewed research, and cloud provider documentation. All sources are cited.
          </p>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline"
          >
            Our methodology <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MegaMenu({ activeMenu, headerHeight = 60, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {activeMenu && (
        <motion.div
          key={activeMenu}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{ top: headerHeight }}
          className="fixed left-0 right-0 z-50"
          role="region"
          aria-label={`${activeMenu} menu`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Top accent line */}
          <div className="h-px bg-[var(--color-accent)] opacity-20" />
          {/* Panel */}
          <div
            className="border-b border-[var(--color-border)]"
            style={{ backgroundColor: 'var(--color-bg-raised)' }}
          >
            <div className="max-w-7xl mx-auto">
              {menuComponents[activeMenu]}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
